
import React, { useState } from 'react';
import { ArrowLeft, X, Search as SearchIcon } from 'lucide-react';
import { Chat } from '../types';

interface SearchOverlayProps {
  chats: Chat[];
  onBack: () => void;
  onSelectChat: (id: string) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ chats, onBack, onSelectChat }) => {
  const [query, setQuery] = useState('');

  const filteredChats = chats.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.lastMessage.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="absolute inset-0 z-[200] bg-[#EDEDED] flex flex-col">
      <div className="bg-[#EDEDED] p-2 flex items-center gap-2">
        <ArrowLeft size={24} className="text-gray-600 cursor-pointer" onClick={onBack} />
        <div className="flex-1 bg-white rounded flex items-center px-3 py-1.5">
          <SearchIcon size={18} className="text-gray-400 mr-2" />
          <input 
            autoFocus
            type="text" 
            placeholder="Search" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm outline-none bg-transparent"
          />
          {query && <X size={16} className="text-gray-400 cursor-pointer" onClick={() => setQuery('')} />}
        </div>
        <span className="text-[#07C160] text-sm font-medium ml-1 cursor-pointer" onClick={onBack}>Cancel</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
        {!query ? (
          <div className="text-center mt-10">
            <h3 className="text-sm text-gray-500 mb-6">Search for:</h3>
            <div className="grid grid-cols-3 gap-y-4 text-[#576B95] text-xs font-medium">
              <span>Moments</span>
              <span>Articles</span>
              <span>Official Accounts</span>
              <span>Mini Programs</span>
              <span>Music</span>
              <span>Stickers</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-[10px] text-gray-400 uppercase font-bold">Contacts and Chats</h4>
            {filteredChats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => onSelectChat(chat.id)}
                className="flex items-center gap-3 p-3 bg-white rounded-md active:bg-gray-100"
              >
                <img src={chat.avatar} className="w-10 h-10 rounded-md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{chat.name}</p>
                  <p className="text-xs text-gray-400 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
            {filteredChats.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm">No results found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
