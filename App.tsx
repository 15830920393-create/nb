
import React, { useState, useEffect, useCallback } from 'react';
import { 
  MessageCircle, 
  Users, 
  Compass, 
  User, 
  Search as SearchIcon, 
  PlusCircle
} from 'lucide-react';
import { TabType, Chat, SubViewType, Message, Contact, BankCard, MessageType, Moment } from './types';
import ChatList from './components/ChatList';
import ContactList from './components/ContactList';
import Discover from './components/Discover';
import Me from './components/Me';
import ChatWindow from './components/ChatWindow';
import Moments from './components/Moments';
import PostMoment from './components/PostMoment';
import Pay from './components/Pay';
import Settings from './components/Settings';
import Channels from './components/Channels';
import WalletDetail from './components/WalletDetail';
import SearchOverlay from './components/SearchOverlay';
import ScanView from './components/ScanView';
import StatusPicker from './components/StatusPicker';
import AddFriendOverlay from './components/AddFriendOverlay';
import GameCenter from './components/GameCenter';
import BankCardsOverlay from './components/BankCardsOverlay';
import AddCardOverlay from './components/AddCardOverlay';
import TransferOverlay from './components/TransferOverlay';
import PaymentCodeOverlay from './components/PaymentCodeOverlay';
import ReceiptCodeOverlay from './components/ReceiptCodeOverlay';
import ProfileSettings from './components/ProfileSettings';
import Login from './components/Login';
import ContactDetail from './components/ContactDetail';
import EditRemarkTags from './components/EditRemarkTags';
import VoiceCallOverlay from './components/VoiceCallOverlay';
import PrivacySettings from './components/PrivacySettings';

const WECHAT_TEAM_ID = 'wechat_team';

const DEFAULT_CHATS: Chat[] = [
  {
    id: WECHAT_TEAM_ID,
    name: '微信团队',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/WeChat_logo.svg/2000px-WeChat_logo.svg.png',
    lastMessage: '欢迎使用微信',
    time: '刚刚',
    unreadCount: 0,
    messages: [
      { id: '1', senderId: WECHAT_TEAM_ID, type: 'text', text: '欢迎来到微信！在这里，你可以与朋友们畅所欲言。', timestamp: Date.now(), isMe: false }
    ],
    isAI: true
  }
];

const DEFAULT_MOMENTS: Moment[] = [
  {
    id: 'm1',
    author: '微信团队',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/WeChat_logo.svg/2000px-WeChat_logo.svg.png',
    content: '欢迎来到微信。在这里，你可以分享生活，连接世界。🚀',
    images: ['https://picsum.photos/seed/wechat/600/400'],
    likes: 12,
    isLiked: false,
    comments: [{ author: '爱丽丝', text: '终于等到你！' }],
    time: '2小时前'
  }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [activeSubView, setActiveSubView] = useState<SubViewType>('none');
  
  const [chats, setChats] = useState<Chat[]>(DEFAULT_CHATS);
  const [moments, setMoments] = useState<Moment[]>(DEFAULT_MOMENTS);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [bankCards, setBankCards] = useState<BankCard[]>([]);
  const [balance, setBalance] = useState(0);
  const [myStatus, setMyStatus] = useState<string | null>(null);
  const [myAvatar, setMyAvatar] = useState('');
  const [momentsCover, setMomentsCover] = useState('https://picsum.photos/seed/wechatcover/800/600');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'receiving'>('connecting');

  // 从本地加载数据：这是实现“保留进度”的关键
  const loadUserData = useCallback((userId: string) => {
    const savedData = localStorage.getItem(`wechat_user_data_${userId}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setChats(parsed.chats || DEFAULT_CHATS);
      setMoments(parsed.moments || DEFAULT_MOMENTS);
      setContacts(parsed.contacts || []);
      setBankCards(parsed.bankCards || []);
      setBalance(parsed.balance ?? 0);
      setMyStatus(parsed.myStatus || null);
      setMyAvatar(parsed.myAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`);
      setMomentsCover(parsed.momentsCover || 'https://picsum.photos/seed/wechatcover/800/600');
    }
  }, []);

  // 监听 Storage 变化
  useEffect(() => {
    const handleStorageSync = (e: StorageEvent) => {
      if (currentUser && e.key === `wechat_user_data_${currentUser}`) {
        const newData = JSON.parse(e.newValue || '{}');
        if (newData.chats) setChats(newData.chats);
        if (newData.contacts) setContacts(newData.contacts);
        if (newData.balance !== undefined) setBalance(newData.balance);
        if (newData.moments) setMoments(newData.moments);
      }
    };

    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, [currentUser]);

  // 启动检查
  useEffect(() => {
    const lastUser = localStorage.getItem('wechat_last_active_user');
    if (lastUser) {
      setCurrentUser(lastUser);
      loadUserData(lastUser);
      setIsLoggedIn(true);
    }
  }, [loadUserData]);

  // 每当数据变化，立即持久化
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      const dataToSave = { 
        chats, moments, contacts, bankCards, balance, myStatus, myAvatar, momentsCover 
      };
      localStorage.setItem(`wechat_user_data_${currentUser}`, JSON.stringify(dataToSave));
      
      const registry = JSON.parse(localStorage.getItem('wechat_global_registry') || '{}');
      if (registry[currentUser]) {
        registry[currentUser].avatar = myAvatar;
        localStorage.setItem('wechat_global_registry', JSON.stringify(registry));
      }
    }
  }, [chats, moments, contacts, bankCards, balance, myStatus, myAvatar, momentsCover, isLoggedIn, currentUser]);

  const handleSendMessage = (text: string, type: MessageType = 'text', amount?: string, duration?: number) => {
    if (!selectedChatId || !currentUser) return;
    
    const timestamp = Date.now();
    const msgId = timestamp.toString();
    const newMessage: Message = {
      id: msgId,
      senderId: currentUser,
      text: text,
      type: type,
      timestamp: timestamp,
      isMe: true,
      status: 'sent',
      amount: amount,
      duration: duration
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: type === 'text' ? text : `[${type}]`,
          time: '刚刚'
        };
      }
      return chat;
    }));

    if (selectedChatId !== WECHAT_TEAM_ID) {
      const otherDataStr = localStorage.getItem(`wechat_user_data_${selectedChatId}`);
      if (otherDataStr) {
        const otherData = JSON.parse(otherDataStr);
        const incomingMsg: Message = { ...newMessage, isMe: false, senderId: currentUser };
        
        let targetChat = otherData.chats.find((c: any) => c.id === currentUser);
        if (targetChat) {
          targetChat.messages.push(incomingMsg);
          targetChat.lastMessage = type === 'text' ? text : `[${type}]`;
          targetChat.time = '刚刚';
          targetChat.unreadCount = (targetChat.unreadCount || 0) + 1;
        } else {
          otherData.chats.unshift({
            id: currentUser,
            name: currentUser,
            avatar: myAvatar,
            lastMessage: type === 'text' ? text : `[${type}]`,
            time: '刚刚',
            unreadCount: 1,
            messages: [incomingMsg]
          });
        }
        
        localStorage.setItem(`wechat_user_data_${selectedChatId}`, JSON.stringify(otherData));
        window.dispatchEvent(new StorageEvent('storage', {
          key: `wechat_user_data_${selectedChatId}`,
          newValue: JSON.stringify(otherData)
        }));
      }
    }

    if (type === 'transfer' && amount) {
      setBalance(b => Math.max(0, b - parseFloat(amount)));
    }
  };

  const handleLoginSuccess = (userId: string) => {
    setCurrentUser(userId);
    loadUserData(userId);
    setIsLoggedIn(true);
    localStorage.setItem('wechat_last_active_user', userId);
    setConnectionStatus('connecting');
  };

  const handleLogout = () => {
    localStorage.removeItem('wechat_last_active_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveSubView('none');
  };

  const startChatWithContact = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;
    const existingChat = chats.find(c => c.id === contactId);
    if (!existingChat) {
      const newChat: Chat = {
        id: contact.id,
        name: contact.remark || contact.name,
        avatar: contact.avatar,
        lastMessage: '',
        time: '刚刚',
        unreadCount: 0,
        messages: [],
        isAI: contact.id === WECHAT_TEAM_ID
      };
      setChats([newChat, ...chats]);
    }
    setSelectedChatId(contactId);
    setActiveSubView('none');
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const activeChat = chats.find(c => c.id === selectedChatId);
  const activeContact = contacts.find(c => c.id === selectedContactId);

  return (
    <div className="flex flex-col h-full w-full bg-[#EDEDED] overflow-hidden relative select-none touch-none">
      <div className="bg-[#EDEDED] h-[env(safe-area-inset-top)] w-full shrink-0" />

      {activeSubView === 'moments' && (
        <Moments myAvatar={myAvatar} moments={moments} cover={momentsCover} onUpdateMoments={setMoments} onBack={() => setActiveSubView('none')} onPost={() => setActiveSubView('post-moment')} onUpdateCover={setMomentsCover} />
      )}
      {activeSubView === 'post-moment' && (
        <PostMoment myAvatar={myAvatar} userName={currentUser || '微信用户'} onBack={() => setActiveSubView('moments')} onPublish={(m) => { setMoments([m, ...moments]); setActiveSubView('moments'); }} />
      )}
      {activeSubView === 'pay' && <Pay balance={balance} onBack={() => setActiveSubView('none')} onOpenWalletDetail={() => setActiveSubView('wallet-detail')} onOpenPaymentCode={() => setActiveSubView('payment-code')} />}
      {activeSubView === 'contact-detail' && activeContact && (
        <ContactDetail 
          contact={activeContact} 
          onBack={() => setActiveSubView('none')} 
          onOpenEdit={() => setActiveSubView('edit-remark-tags')} 
          onStartChat={startChatWithContact}
          onStartCall={() => setActiveSubView('voice-call')}
          onDelete={() => { setContacts(c => c.filter(x => x.id !== activeContact.id)); setActiveSubView('none'); }}
          onUpdatePrivacy={(updates) => setContacts(c => c.map(x => x.id === activeContact.id ? {...x, ...updates} : x))}
        />
      )}
      {activeSubView === 'voice-call' && activeChat && <VoiceCallOverlay chat={activeChat} onBack={() => setActiveSubView('none')} />}
      {activeSubView === 'profile-settings' && <ProfileSettings avatar={myAvatar} onUpdateAvatar={setMyAvatar} onBack={() => setActiveSubView('none')} />}
      {activeSubView === 'settings' && <Settings onBack={() => setActiveSubView('none')} onLogout={handleLogout} onOpenPrivacy={() => setActiveSubView('privacy-settings')} />}
      {activeSubView === 'status-picker' && <StatusPicker onSelect={(s) => setMyStatus(s)} onBack={() => setActiveSubView('none')} />}
      {activeSubView === 'add-friend' && (
        <AddFriendOverlay 
          onBack={() => setActiveSubView('none')} 
          onAdd={(c) => { 
            if (!contacts.find(x => x.id === c.id)) setContacts([c, ...contacts]); 
            setActiveSubView('none'); 
          }} 
        />
      )}

      {selectedChatId && activeChat && (
        <ChatWindow 
          chat={activeChat} 
          myAvatar={myAvatar}
          onBack={() => {
            setSelectedChatId(null);
            setChats(prev => prev.map(c => c.id === selectedChatId ? {...c, unreadCount: 0} : c));
          }} 
          onSendMessage={(t, ty, a, d) => handleSendMessage(t, ty as MessageType, a, d)}
          onRecallMessage={(msgId) => setChats(prev => prev.map(c => c.id === selectedChatId ? {...c, messages: c.messages.map(m => m.id === msgId ? {...m, isRecalled: true} : m)} : c))}
          onDeleteMessage={(msgId) => setChats(prev => prev.map(c => c.id === selectedChatId ? {...c, messages: c.messages.filter(m => m.id !== msgId)} : c))}
          onReceiveMessage={() => {}} 
          onOpenRedPacket={(msgId) => { setBalance(b => b + 1.28); setChats(prev => prev.map(c => c.id === selectedChatId ? {...c, messages: c.messages.map(m => m.id === msgId ? {...m, isOpened: true} : m)} : c)); }}
          onReceiveTransfer={(msgId) => {
            const msg = activeChat.messages.find(m => m.id === msgId);
            if (msg && msg.amount) setBalance(b => b + parseFloat(msg.amount || '0'));
            setChats(prev => prev.map(c => c.id === selectedChatId ? {...c, messages: c.messages.map(m => m.id === msgId ? {...m, isReceived: true} : m)} : c));
          }}
          onOpenTransfer={() => setActiveSubView('transfer')}
          onOpenCall={() => setActiveSubView('voice-call')}
        />
      )}

      {!selectedChatId && activeSubView === 'none' && (
        <>
          <header className="bg-[#EDEDED] px-5 py-4 flex justify-between items-center shrink-0">
            <h1 className="text-[18px] font-bold text-[#111]">
              {activeTab === TabType.CHATS && (connectionStatus === 'connected' ? '微信' : '微信(连接中...)')}
              {activeTab === TabType.CONTACTS && '通讯录'}
              {activeTab === TabType.DISCOVER && '发现'}
              {activeTab === TabType.ME && '我'}
            </h1>
            <div className="flex gap-5">
              <SearchIcon size={20} className="text-[#111] cursor-pointer" onClick={() => setActiveSubView('search')} />
              <PlusCircle size={20} className="text-[#111] cursor-pointer" onClick={() => setActiveSubView('add-friend')} />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
            {activeTab === TabType.CHATS && <ChatList chats={chats} onSelectChat={setSelectedChatId} />}
            {activeTab === TabType.CONTACTS && (
              <ContactList contacts={contacts} onAddFriend={() => setActiveSubView('add-friend')} onSelectContact={(id) => { setSelectedContactId(id); setActiveSubView('contact-detail'); }} />
            )}
            {activeTab === TabType.DISCOVER && (
              <Discover onOpenMoments={() => setActiveSubView('moments')} onOpenChannels={() => setActiveSubView('channels')} onOpenScan={() => setActiveSubView('scan')} onOpenGames={() => setActiveSubView('game')} />
            )}
            {activeTab === TabType.ME && (
              <Me userId={currentUser} avatar={myAvatar} status={myStatus} onOpenStatus={() => setActiveSubView('status-picker')} onOpenPay={() => setActiveSubView('pay')} onOpenProfile={() => setActiveSubView('profile-settings')} onOpenSettings={() => setActiveSubView('settings')} onOpenMoments={() => setActiveSubView('moments')} />
            )}
          </main>

          <nav className="fixed bottom-0 w-full bg-[#F7F7F7] border-t border-[#DDD] flex justify-around items-center pt-1 pb-[calc(10px+env(safe-area-inset-bottom))] z-50">
            <TabButton icon={<MessageCircle size={24} />} label="微信" active={activeTab === TabType.CHATS} onClick={() => setActiveTab(TabType.CHATS)} />
            <TabButton icon={<Users size={24} />} label="通讯录" active={activeTab === TabType.CONTACTS} onClick={() => setActiveTab(TabType.CONTACTS)} />
            <TabButton icon={<Compass size={24} />} label="发现" active={activeTab === TabType.DISCOVER} onClick={() => setActiveTab(TabType.DISCOVER)} />
            <TabButton icon={<User size={24} />} label="我" active={activeTab === TabType.ME} onClick={() => setActiveTab(TabType.ME)} />
          </nav>
        </>
      )}
    </div>
  );
};

const TabButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-[#07C160]' : 'text-[#333]'}`}>
    {React.cloneElement(icon as React.ReactElement<any>, { fill: active ? 'currentColor' : 'none', strokeWidth: active ? 2.5 : 2 })}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
