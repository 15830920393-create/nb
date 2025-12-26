
import React, { useState } from 'react';
import { ArrowLeft, MoreHorizontal, MessageCircle, Video, ChevronRight, Phone, AlertCircle, ShieldAlert } from 'lucide-react';
import { Contact } from '../types';

interface ContactDetailProps {
  contact: Contact;
  onBack: () => void;
  onOpenEdit: () => void;
  onStartChat: (chatId: string) => void;
  onStartCall: () => void;
  onDelete: () => void;
  onUpdatePrivacy: (updates: Partial<Contact>) => void;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ contact, onBack, onOpenEdit, onStartChat, onStartCall, onDelete, onUpdatePrivacy }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="absolute inset-0 z-[110] bg-[#EDEDED] flex flex-col overflow-y-auto no-scrollbar pb-20">
      <header className="sticky top-0 z-10 bg-white p-4 flex items-center justify-between border-b border-gray-50 pt-[env(safe-area-inset-top)]">
        <ArrowLeft size={24} onClick={onBack} className="cursor-pointer" />
        <MoreHorizontal size={24} className="cursor-pointer" onClick={() => setShowOptions(!showOptions)} />
      </header>

      {showOptions && (
        <div className="absolute top-14 right-4 z-50 bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100 w-48 animate-in fade-in slide-in-from-top-2 duration-200">
          <button 
            onClick={() => { onUpdatePrivacy({ isBlocked: !contact.isBlocked }); setShowOptions(false); }}
            className="w-full text-left px-4 py-3 text-sm active:bg-gray-50 flex items-center gap-2"
          >
            {contact.isBlocked ? '移出黑名单' : '加入黑名单'}
          </button>
          <button 
            onClick={() => { if(confirm('确定要删除该联系人吗？')) onDelete(); setShowOptions(false); }}
            className="w-full text-left px-4 py-3 text-sm text-[#E15545] active:bg-gray-50 flex items-center gap-2"
          >
            删除
          </button>
        </div>
      )}

      <div className="bg-white px-6 py-8 flex gap-5">
        <img src={contact.avatar} className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{contact.remark || contact.name}</h2>
            {contact.remark && <span className="text-sm text-gray-400 font-normal">昵称：{contact.name}</span>}
          </div>
          <p className="text-gray-400 text-sm mt-1">微信号：{contact.id}</p>
          <p className="text-gray-400 text-sm">地区：中国 上海</p>
        </div>
      </div>

      <div className="mt-2 bg-white divide-y divide-gray-50">
        <div onClick={onOpenEdit} className="flex items-center justify-between px-6 py-4 active:bg-gray-100 cursor-pointer">
          <span className="text-[15px]">设置备注和标签</span>
          <div className="flex items-center gap-1">
             {contact.tags && contact.tags.length > 0 && (
               <span className="text-xs text-blue-500 border border-blue-200 px-1 rounded">{contact.tags[0]}</span>
             )}
             <ChevronRight size={18} className="text-gray-300" />
          </div>
        </div>
      </div>

      <div className="mt-2 bg-white px-6 py-4 flex flex-col gap-1">
        <span className="text-[15px]">朋友圈权限</span>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-500">不让他看我</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={contact.hideMyMoments} 
              onChange={(e) => onUpdatePrivacy({ hideMyMoments: e.target.checked })} 
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#07C160]"></div>
          </label>
        </div>
      </div>

      <div className="mt-2 bg-white px-6 py-4 flex flex-col gap-1">
        <span className="text-[15px]">个性签名</span>
        <span className="text-gray-400 text-sm">{contact.status || '暂无签名'}</span>
      </div>

      <div className="mt-2 bg-white divide-y divide-gray-50">
        <button 
          onClick={() => onStartChat(contact.id)}
          className="w-full py-4 text-[#576B95] font-bold flex items-center justify-center gap-2 active:bg-gray-100"
        >
          <MessageCircle size={20} />
          发消息
        </button>
        <button 
          onClick={onStartCall}
          className="w-full py-4 text-[#576B95] font-bold flex items-center justify-center gap-2 active:bg-gray-100"
        >
          <Phone size={20} />
          语音通话
        </button>
        <button className="w-full py-4 text-[#576B95] font-bold flex items-center justify-center gap-2 active:bg-gray-100">
          <Video size={20} />
          视频通话
        </button>
      </div>

      {contact.isBlocked && (
        <div className="m-4 p-3 bg-red-50 rounded-lg flex items-center gap-2 text-red-600 text-xs border border-red-100">
          <ShieldAlert size={16} />
          <span>该用户目前在你的黑名单中，你将不会收到对方的消息。</span>
        </div>
      )}
    </div>
  );
};

export default ContactDetail;
