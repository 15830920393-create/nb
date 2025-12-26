
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

const DEFAULT_CHATS: Chat[] = [
  {
    id: 'gemini-ai',
    name: '文件传输助手',
    avatar: 'https://cdn-icons-png.flaticon.com/512/3233/3233497.png',
    lastMessage: '欢迎使用微信专业版',
    time: '刚刚',
    unreadCount: 0,
    messages: [
      { id: '1', senderId: 'gemini-ai', type: 'text', text: '文件传输助手已就绪，已开启数据持久化。', timestamp: Date.now(), isMe: false }
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

const DEFAULT_CONTACTS: Contact[] = [
  { id: 'c1', name: '爱丽丝', avatar: 'https://picsum.photos/seed/alice/200', status: '正在使用微信 Pro', remark: 'Alice', tags: ['朋友'], isBlocked: false, hideMyMoments: false }
];

const DEFAULT_CARDS: BankCard[] = [
  { id: '1', bankName: '招商银行', cardNumber: '**** 8888', type: 'Debit', color: '#07C160' }
];

const DEFAULT_COVER = 'https://picsum.photos/seed/wechatcover/800/600';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [activeSubView, setActiveSubView] = useState<SubViewType>('none');
  
  const [chats, setChats] = useState<Chat[]>(DEFAULT_CHATS);
  const [moments, setMoments] = useState<Moment[]>(DEFAULT_MOMENTS);
  const [contacts, setContacts] = useState<Contact[]>(DEFAULT_CONTACTS);
  const [bankCards, setBankCards] = useState<BankCard[]>(DEFAULT_CARDS);
  const [balance, setBalance] = useState(88888.88);
  const [myStatus, setMyStatus] = useState<string | null>(null);
  const [myAvatar, setMyAvatar] = useState('https://picsum.photos/seed/user-me/400');
  const [momentsCover, setMomentsCover] = useState(DEFAULT_COVER);
  
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'receiving'>('connecting');

  const triggerHaptic = (type: 'light' | 'medium' | 'error' = 'light') => {
    if ('vibrate' in navigator) {
      if (type === 'error') navigator.vibrate([50, 50, 50]);
      else navigator.vibrate(type === 'light' ? 10 : 25);
    }
  };

  const loadUserData = useCallback((userId: string) => {
    try {
      const savedData = localStorage.getItem(`wechat_user_${userId}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setChats(parsed.chats || DEFAULT_CHATS);
        setMoments(parsed.moments || DEFAULT_MOMENTS);
        setContacts(parsed.contacts || DEFAULT_CONTACTS);
        setBankCards(parsed.bankCards || DEFAULT_CARDS);
        setBalance(parsed.balance ?? 88888.88);
        setMyStatus(parsed.myStatus || null);
        setMyAvatar(parsed.myAvatar || 'https://picsum.photos/seed/user-me/400');
        setMomentsCover(parsed.momentsCover || DEFAULT_COVER);
      } else {
        setChats(DEFAULT_CHATS);
        setMoments(DEFAULT_MOMENTS);
        setContacts(DEFAULT_CONTACTS);
        setBankCards(DEFAULT_CARDS);
        setBalance(88888.88);
        setMyStatus(null);
        setMyAvatar('https://picsum.photos/seed/user-me/400');
        setMomentsCover(DEFAULT_COVER);
      }
    } catch (e) {
      console.error("Failed to load user data:", e);
      triggerHaptic('error');
    }
  }, []);

  useEffect(() => {
    const lastUser = localStorage.getItem('wechat_last_active_user');
    if (lastUser) {
      setCurrentUser(lastUser);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      try {
        const dataToSave = { 
          chats, 
          moments, 
          contacts, 
          bankCards, 
          balance, 
          myStatus, 
          myAvatar, 
          momentsCover 
        };
        localStorage.setItem(`wechat_user_${currentUser}`, JSON.stringify(dataToSave));
        localStorage.setItem('wechat_last_active_user', currentUser);
      } catch (e) {
        console.warn("Storage full or error:", e);
      }
    }
  }, [chats, moments, contacts, bankCards, balance, myStatus, myAvatar, momentsCover, isLoggedIn, currentUser]);

  const handleLoginSuccess = (userId: string) => {
    triggerHaptic('medium');
    setCurrentUser(userId);
    loadUserData(userId);
    setIsLoggedIn(true);
    setConnectionStatus('connecting');
  };

  const handleLogout = () => {
    localStorage.removeItem('wechat_last_active_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveSubView('none');
    triggerHaptic('medium');
  };

  useEffect(() => {
    if (isLoggedIn && connectionStatus === 'connecting') {
      const timers = [
        setTimeout(() => setConnectionStatus('receiving'), 1000),
        setTimeout(() => setConnectionStatus('connected'), 2000)
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isLoggedIn, connectionStatus]);

  const handleSendMessage = (text: string, type: MessageType = 'text', amount?: string, duration?: number) => {
    if (!selectedChatId) return;
    const msgId = Date.now().toString();
    const newMessage: Message = {
      id: msgId,
      senderId: 'me',
      text: text,
      type: type,
      timestamp: Date.now(),
      isMe: true,
      status: 'sent',
      amount: amount,
      duration: duration,
      isOpened: false,
      isReceived: false
    };

    if (type === 'transfer' && amount) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        setBalance(prev => Math.max(0, prev - numAmount));
      }
    }

    setChats(prev => prev.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: type === 'text' ? text : (type === 'voice' ? '[语音]' : (type === 'image' ? '[图片]' : (type === 'transfer' ? `[转账] ¥${amount}` : `[${type}]`))),
          time: '刚刚'
        };
      }
      return chat;
    }));
  };

  const handleReceiveMessage = (chatId: string, text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: chatId,
      text: text,
      type: 'text',
      timestamp: Date.now(),
      isMe: false
    };
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: text,
          time: '刚刚',
          unreadCount: selectedChatId === chatId ? 0 : chat.unreadCount + 1
        };
      }
      return chat;
    }));
  };

  const handleRecallMessage = (chatId: string, messageId: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: chat.messages.map(msg => 
            msg.id === messageId ? { ...msg, isRecalled: true } : msg
          ),
          lastMessage: chat.messages.find(m => m.id === messageId)?.isMe ? '你撤回了一条消息' : '对方撤回了一条消息'
        };
      }
      return chat;
    }));
  };

  const handleDeleteMessage = (chatId: string, messageId: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const remainingMessages = chat.messages.filter(m => m.id !== messageId);
        const lastMsg = remainingMessages.length > 0 ? remainingMessages[remainingMessages.length - 1] : null;
        return {
          ...chat,
          messages: remainingMessages,
          lastMessage: lastMsg ? (lastMsg.type === 'text' ? lastMsg.text || '' : `[${lastMsg.type}]`) : ''
        };
      }
      return chat;
    }));
  };

  const handleUpdateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    if (updates.remark || updates.name) {
      setChats(prev => prev.map(chat => chat.id === id ? { ...chat, name: updates.remark || updates.name || chat.name } : chat));
    }
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    setChats(prev => prev.filter(c => c.id !== id));
    setSelectedContactId(null);
    setActiveSubView('none');
    triggerHaptic('medium');
  };

  const handleActionOnMessage = (chatId: string, messageId: string, action: 'open-rp' | 'receive-transfer') => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: chat.messages.map(msg => {
            if (msg.id === messageId) {
              if (action === 'open-rp' && !msg.isOpened) {
                const amt = parseFloat(msg.amount || '0');
                setBalance(b => b + amt);
                return { ...msg, isOpened: true };
              }
              if (action === 'receive-transfer' && !msg.isReceived) {
                const amt = parseFloat(msg.amount || '0');
                setBalance(b => b + amt);
                return { ...msg, isReceived: true };
              }
            }
            return msg;
          })
        };
      }
      return chat;
    }));
  };

  const startChatWithContact = (contactId: string) => {
    const existingChat = chats.find(c => c.id === contactId);
    if (!existingChat) {
      const contact = contacts.find(c => c.id === contactId);
      if (contact) {
        const newChat: Chat = {
          id: contact.id,
          name: contact.remark || contact.name,
          avatar: contact.avatar,
          lastMessage: '',
          time: '刚刚',
          unreadCount: 0,
          messages: [],
          isAI: true
        };
        setChats([newChat, ...chats]);
      }
    }
    setSelectedChatId(contactId);
    setActiveSubView('none');
    triggerHaptic();
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const activeChat = chats.find(c => c.id === selectedChatId);
  const activeContact = contacts.find(c => c.id === selectedContactId);

  return (
    <div className="flex flex-col h-full w-full bg-[#EDEDED] overflow-hidden relative select-none touch-none animate-in fade-in duration-500">
      <div className="bg-[#EDEDED] h-[env(safe-area-inset-top)] w-full shrink-0" />

      {/* View Overlays */}
      {activeSubView === 'search' && <SearchOverlay chats={chats} onBack={() => setActiveSubView('none')} onSelectChat={setSelectedChatId} />}
      {activeSubView === 'moments' && (
        <Moments 
          myAvatar={myAvatar} 
          moments={moments} 
          cover={momentsCover}
          onUpdateMoments={setMoments}
          onBack={() => setActiveSubView('none')} 
          onPost={() => setActiveSubView('post-moment')}
          onUpdateCover={setMomentsCover}
        />
      )}
      {activeSubView === 'post-moment' && (
        <PostMoment 
          myAvatar={myAvatar}
          onBack={() => setActiveSubView('moments')} 
          onPublish={(m) => {
            setMoments([m, ...moments]);
            setActiveSubView('moments');
            triggerHaptic('medium');
          }}
        />
      )}
      {activeSubView === 'pay' && <Pay balance={balance} onBack={() => setActiveSubView('none')} onOpenWalletDetail={() => setActiveSubView('wallet-detail')} onOpenPaymentCode={() => setActiveSubView('payment-code')} />}
      {activeSubView === 'contact-detail' && activeContact && (
        <ContactDetail 
          contact={activeContact} 
          onBack={() => setActiveSubView('none')} 
          onOpenEdit={() => setActiveSubView('edit-remark-tags')} 
          onStartChat={startChatWithContact}
          onStartCall={() => setActiveSubView('voice-call')}
          onDelete={() => handleDeleteContact(activeContact.id)}
          onUpdatePrivacy={(updates) => handleUpdateContact(activeContact.id, updates)}
        />
      )}
      {activeSubView === 'edit-remark-tags' && activeContact && (
        <EditRemarkTags 
          contact={activeContact} 
          onBack={() => setActiveSubView('contact-detail')} 
          onSave={(remark, tags) => {
            handleUpdateContact(activeContact.id, { remark, tags });
            setActiveSubView('contact-detail');
            triggerHaptic('medium');
          }}
        />
      )}
      {activeSubView === 'voice-call' && activeChat && (
        <VoiceCallOverlay 
          chat={activeChat} 
          onBack={() => setActiveSubView('none')} 
        />
      )}
      {activeSubView === 'wallet-detail' && <WalletDetail balance={balance} cardsCount={bankCards.length} onBack={() => setActiveSubView('pay')} onOpenCards={() => setActiveSubView('bank-cards')} />}
      {activeSubView === 'bank-cards' && <BankCardsOverlay cards={bankCards} onBack={() => setActiveSubView('wallet-detail')} onOpenAdd={() => setActiveSubView('add-card')} />}
      {activeSubView === 'add-card' && <AddCardOverlay onBack={() => setActiveSubView('bank-cards')} onAdd={(c) => { setBankCards(p => [...p, c]); triggerHaptic(); setActiveSubView('bank-cards'); }} />}
      {activeSubView === 'transfer' && activeChat && <TransferOverlay recipient={activeChat} onBack={() => setActiveSubView('none')} onConfirm={(amount) => { triggerHaptic('medium'); handleSendMessage('', 'transfer', amount); setActiveSubView('none'); }} />}
      {activeSubView === 'payment-code' && <PaymentCodeOverlay onBack={() => setActiveSubView('pay')} onOpenReceipt={() => setActiveSubView('receipt-code')} />}
      {activeSubView === 'receipt-code' && <ReceiptCodeOverlay avatar={myAvatar} onBack={() => setActiveSubView('payment-code')} />}
      {activeSubView === 'profile-settings' && <ProfileSettings avatar={myAvatar} onUpdateAvatar={setMyAvatar} onBack={() => setActiveSubView('none')} />}
      {activeSubView === 'status-picker' && <StatusPicker onSelect={(s) => { setMyStatus(s); triggerHaptic(); setActiveSubView('none'); }} onBack={() => setActiveSubView('none')} />}
      {activeSubView === 'settings' && <Settings onBack={() => setActiveSubView('none')} onLogout={handleLogout} onOpenPrivacy={() => setActiveSubView('privacy-settings')} />}
      {activeSubView === 'privacy-settings' && (
        <PrivacySettings 
          contacts={contacts} 
          cover={momentsCover}
          onUpdateContact={handleUpdateContact} 
          onUpdateCover={setMomentsCover}
          onBack={() => setActiveSubView('settings')} 
        />
      )}
      {activeSubView === 'game' && <GameCenter onBack={() => setActiveSubView('none')} />}
      {activeSubView === 'channels' && <Channels onBack={() => setActiveSubView('none')} />}
      {activeSubView === 'scan' && <ScanView onBack={() => setActiveSubView('none')} />}
      {activeSubView === 'add-friend' && <AddFriendOverlay onBack={() => setActiveSubView('none')} onAdd={(c) => { setContacts([c, ...contacts]); triggerHaptic(); setActiveSubView('none'); }} />}

      {selectedChatId && activeChat && (
        <ChatWindow 
          chat={activeChat} 
          myAvatar={myAvatar}
          onBack={() => setSelectedChatId(null)} 
          onSendMessage={(t, ty, a, d) => {
             triggerHaptic();
             handleSendMessage(t, ty as MessageType, a, d);
          }}
          onRecallMessage={(msgId) => handleRecallMessage(activeChat.id, msgId)}
          onDeleteMessage={(msgId) => handleDeleteMessage(activeChat.id, msgId)}
          onReceiveMessage={handleReceiveMessage}
          onOpenRedPacket={(msgId) => handleActionOnMessage(activeChat.id, msgId, 'open-rp')}
          onReceiveTransfer={(msgId) => handleActionOnMessage(activeChat.id, msgId, 'receive-transfer')}
          onOpenTransfer={() => setActiveSubView('transfer')}
          onOpenCall={() => setActiveSubView('voice-call')}
        />
      )}

      {!selectedChatId && activeSubView === 'none' && (
        <>
          <header className="bg-[#EDEDED] px-5 py-4 flex justify-between items-center shrink-0">
            <h1 className="text-xl font-bold text-[#111] tracking-tight">
              {activeTab === TabType.CHATS && (connectionStatus === 'connected' ? '微信' : '微信(连接中...)')}
              {activeTab === TabType.CONTACTS && '通讯录'}
              {activeTab === TabType.DISCOVER && '发现'}
              {activeTab === TabType.ME && '我'}
            </h1>
            <div className="flex gap-5">
              <SearchIcon size={22} className="text-[#111] cursor-pointer" onClick={() => setActiveSubView('search')} />
              <PlusCircle size={22} className="text-[#111] cursor-pointer" onClick={() => setActiveSubView('add-friend')} />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto no-scrollbar touch-pan-y pb-24">
            {activeTab === TabType.CHATS && <ChatList chats={chats} onSelectChat={setSelectedChatId} />}
            {activeTab === TabType.CONTACTS && (
              <ContactList 
                contacts={contacts.filter(c => !c.isBlocked)} 
                onAddFriend={() => setActiveSubView('add-friend')} 
                onSelectContact={(id) => {
                  setSelectedContactId(id);
                  setActiveSubView('contact-detail');
                }}
              />
            )}
            {activeTab === TabType.DISCOVER && (
              <Discover 
                onOpenMoments={() => setActiveSubView('moments')} 
                onOpenChannels={() => setActiveSubView('channels')} 
                onOpenScan={() => setActiveSubView('scan')}
                onOpenGames={() => setActiveSubView('game')}
              />
            )}
            {activeTab === TabType.ME && (
              <Me userId={currentUser} avatar={myAvatar} status={myStatus} onOpenStatus={() => setActiveSubView('status-picker')} onOpenPay={() => setActiveSubView('pay')} onOpenProfile={() => setActiveSubView('profile-settings')} onOpenSettings={() => setActiveSubView('settings')} />
            )}
          </main>

          <nav className="fixed bottom-0 w-full bg-[#F7F7F7] border-t border-[#DDD] flex justify-around items-center pt-2 pb-[calc(10px+env(safe-area-inset-bottom))] shrink-0 z-50">
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
  <button onClick={onClick} className={`flex flex-col items-center gap-1 active:opacity-60 transition-all ${active ? 'text-[#07C160]' : 'text-[#333]'}`}>
    {React.cloneElement(icon as React.ReactElement<any>, { fill: active ? 'currentColor' : 'none', strokeWidth: active ? 2.5 : 2 })}
    <span className={`text-[10px] font-bold ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
  </button>
);

export default App;
