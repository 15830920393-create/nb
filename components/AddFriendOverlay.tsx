
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, X, QrCode, UserPlus, Smartphone, Users, Radio, Loader2 } from 'lucide-react';
import { Contact } from '../types';

interface AddFriendOverlayProps {
  onBack: () => void;
  onAdd: (contact: Contact) => void;
}

const AddFriendOverlay: React.FC<AddFriendOverlayProps> = ({ onBack, onAdd }) => {
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<Contact | null>(null);
  
  // 模拟搜索效果
  useEffect(() => {
    if (search.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
        setSearchResult({
          id: search,
          name: `用户_${search.slice(0, 4)}`,
          avatar: `https://picsum.photos/seed/${search}/200`,
          status: '这个家伙很懒，什么都没有留下。',
          remark: search
        });
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setSearchResult(null);
      setIsSearching(false);
    }
  }, [search]);

  const handleAdd = () => {
    if (searchResult) {
      onAdd(searchResult);
    }
  };

  return (
    <div className="absolute inset-0 z-[200] bg-[#EDEDED] flex flex-col animate-in slide-in-from-right duration-300">
      <header className="p-4 bg-[#EDEDED] flex items-center gap-4 pt-[env(safe-area-inset-top)]">
        <ArrowLeft size={24} onClick={onBack} className="cursor-pointer active:opacity-50" />
        <h1 className="text-lg font-bold">添加朋友</h1>
      </header>

      <div className="flex flex-col">
        {/* 搜索栏 */}
        <div className="bg-white px-4 py-2 border-y border-gray-100 flex items-center gap-3">
          <Search size={20} className="text-[#07C160]" />
          <input 
            autoFocus
            type="text" 
            placeholder="微信号/手机号" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-[16px] outline-none py-1"
          />
          {search && (
            <div onClick={() => setSearch('')} className="bg-gray-200 rounded-full p-0.5 cursor-pointer">
              <X size={14} className="text-white" />
            </div>
          )}
        </div>

        {/* 我的微信号 */}
        {!search && (
          <div className="py-4 flex flex-col items-center gap-2">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              我的微信号: wechat_user_888 <QrCode size={12} />
            </p>
            
            {/* 快速入口 */}
            <div className="w-full mt-4 bg-white divide-y divide-gray-50">
               <QuickEntry icon={<Radio className="text-orange-500" />} title="雷达加朋友" subTitle="添加身边的朋友" />
               <QuickEntry icon={<Users className="text-[#07C160]" />} title="面对面建群" subTitle="与身边的朋友进入同一个群聊" />
               <QuickEntry icon={<QrCode className="text-blue-500" />} title="扫一扫" subTitle="扫描二维码名片" />
               <QuickEntry icon={<Smartphone className="text-blue-600" />} title="手机联系人" subTitle="添加通讯录中的朋友" />
               <QuickEntry icon={<UserPlus className="text-blue-500" />} title="公众号" subTitle="获取更多资讯和服务" />
            </div>
          </div>
        )}

        {/* 搜索结果 */}
        {search && (
          <div className="mt-4">
            {isSearching ? (
              <div className="bg-white p-4 flex items-center justify-center gap-2 text-gray-400">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">正在搜索: {search}</span>
              </div>
            ) : searchResult ? (
              <div className="bg-white p-4 flex items-center justify-between animate-in fade-in duration-300">
                 <div className="flex items-center gap-4">
                   <img src={searchResult.avatar} className="w-14 h-14 rounded-lg object-cover shadow-sm" alt="avatar" />
                   <div>
                     <p className="font-bold text-[17px]">{searchResult.name}</p>
                     <p className="text-xs text-gray-400 mt-0.5">微信号: {searchResult.id}</p>
                   </div>
                 </div>
                 <button 
                  onClick={handleAdd}
                  className="bg-[#07C160] text-white px-5 py-1.5 rounded-md text-sm font-bold active:bg-[#06ae56] shadow-sm"
                 >
                   添加
                 </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

const QuickEntry = ({ icon, title, subTitle }: { icon: React.ReactNode, title: string, subTitle: string }) => (
  <div className="flex items-center gap-4 p-4 active:bg-gray-100 cursor-pointer transition-colors">
    <div className="shrink-0">{icon}</div>
    <div className="flex flex-col">
      <span className="text-[15px] font-medium text-gray-900">{title}</span>
      <span className="text-[11px] text-gray-400">{subTitle}</span>
    </div>
  </div>
);

export default AddFriendOverlay;
