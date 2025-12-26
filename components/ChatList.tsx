
import React from 'react';
import { Chat } from '../types';

interface ChatListProps {
  chats: Chat[];
  onSelectChat: (id: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat }) => {
  return (
    <div className="bg-white">
      {chats.map((chat) => (
        <div 
          key={chat.id} 
          onClick={() => onSelectChat(chat.id)}
          className="flex items-center gap-3 p-4 border-b border-gray-100 active:bg-gray-100 cursor-pointer transition-colors"
        >
          <div className="relative shrink-0">
            <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-md object-cover" />
            {chat.unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                {chat.unreadCount}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
              <span className="text-xs text-gray-400">{chat.time}</span>
            </div>
            <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
