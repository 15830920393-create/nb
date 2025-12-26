
import React from 'react';
import { ArrowLeft, ChevronRight, ShieldCheck, EyeOff, UserX } from 'lucide-react';
import { Contact } from '../types';

interface PrivacySettingsProps {
  contacts: Contact[];
  cover: string;
  onUpdateContact: (id: string, updates: Partial<Contact>) => void;
  onUpdateCover: (url: string) => void;
  onBack: () => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ contacts, onUpdateContact, onBack }) => {
  const blockedContacts = contacts.filter(c => c.isBlocked);
  const hiddenMomentsContacts = contacts.filter(c => c.hideMyMoments);

  return (
    <div className="absolute inset-0 z-[150] bg-[#EDEDED] flex flex-col overflow-y-auto no-scrollbar pb-10">
      <header className="bg-[#EDEDED] p-4 flex items-center gap-4 border-b border-gray-200 sticky top-0 z-10 pt-[env(safe-area-inset-top)]">
        <ArrowLeft size={24} onClick={onBack} className="cursor-pointer" />
        <h1 className="text-lg font-semibold">隐私</h1>
      </header>

      <div className="mt-2 space-y-2">
        <div className="bg-white divide-y divide-gray-100">
          <div className="flex items-center justify-between p-4 active:bg-gray-100 cursor-pointer">
            <div className="flex items-center gap-3">
              <UserX size={20} className="text-gray-600" />
              <span className="text-sm font-medium">通讯录黑名单</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">{blockedContacts.length} 人</span>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
          </div>
          
          {blockedContacts.length > 0 && (
            <div className="bg-gray-50 px-4 py-2 space-y-2">
              {blockedContacts.map(c => (
                <div key={c.id} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                  <div className="flex items-center gap-2">
                    <img src={c.avatar} className="w-8 h-8 rounded-full" />
                    <span className="text-xs font-medium">{c.name}</span>
                  </div>
                  <button 
                    onClick={() => onUpdateContact(c.id, { isBlocked: false })}
                    className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded"
                  >
                    解除拉黑
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white divide-y divide-gray-100">
          <div className="flex items-center justify-between p-4 active:bg-gray-100 cursor-pointer">
            <div className="flex items-center gap-3">
              <EyeOff size={20} className="text-gray-600" />
              <span className="text-sm font-medium">不让他(她)看我</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">{hiddenMomentsContacts.length} 人</span>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 active:bg-gray-100 cursor-pointer">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-gray-600" />
              <span className="text-sm font-medium">允许陌生人查看十条朋友圈</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#07C160]"></div>
            </label>
          </div>
        </div>

        <div className="px-6 py-4">
          <p className="text-[10px] text-gray-400 leading-relaxed">
            设置朋友圈权限可以帮助你更好地管理个人社交空间。加入黑名单后，对方将无法给你发送消息，也无法查看你的朋友圈更新。
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
