
import React from 'react';
import { UserPlus, UserCheck, Tag, Info } from 'lucide-react';
import { Contact } from '../types';

interface ContactListProps {
  contacts: Contact[];
  onAddFriend: () => void;
  onSelectContact: (id: string) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onAddFriend, onSelectContact }) => {
  return (
    <div className="bg-[#EDEDED]">
      <div className="bg-white space-y-0 mb-2">
        <div onClick={onAddFriend} className="flex items-center gap-3 p-3 border-b border-gray-50 active:bg-gray-100 cursor-pointer transition-colors">
          <div className="w-10 h-10 bg-orange-400 rounded-md flex items-center justify-center text-white">
            <UserPlus size={24} />
          </div>
          <span className="text-[15px] font-medium">新的朋友</span>
        </div>
        <div className="flex items-center gap-3 p-3 border-b border-gray-50 active:bg-gray-100 cursor-pointer transition-colors">
          <div className="w-10 h-10 bg-[#07C160] rounded-md flex items-center justify-center text-white">
            <UserCheck size={24} />
          </div>
          <span className="text-[15px] font-medium">仅聊天的朋友</span>
        </div>
        <div className="flex items-center gap-3 p-3 border-b border-gray-50 active:bg-gray-100 cursor-pointer transition-colors">
          <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center text-white">
            <Tag size={24} />
          </div>
          <span className="text-[15px] font-medium">标签</span>
        </div>
        <div className="flex items-center gap-3 p-3 active:bg-gray-100 cursor-pointer transition-colors">
          <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center text-white">
            <Info size={24} />
          </div>
          <span className="text-[15px] font-medium">公众号</span>
        </div>
      </div>

      <div className="bg-white">
        <div className="px-4 py-1.5 bg-[#EDEDED] text-[10px] text-gray-400 font-bold uppercase tracking-wider">星标朋友</div>
        {contacts.map((contact) => (
          <div 
            key={contact.id} 
            onClick={() => onSelectContact(contact.id)}
            className="flex items-center gap-3 p-3 border-b border-gray-100 active:bg-gray-100 cursor-pointer transition-colors"
          >
            <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-md object-cover bg-gray-50 shadow-sm" />
            <div className="min-w-0">
              <h4 className="text-[16px] font-medium text-gray-900">{contact.remark || contact.name}</h4>
              {contact.status && <p className="text-[11px] text-gray-400 truncate mt-0.5">{contact.status}</p>}
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-4 text-center text-xs text-gray-300 font-medium">
        {contacts.length} 位联系人
      </div>
    </div>
  );
};

export default ContactList;
