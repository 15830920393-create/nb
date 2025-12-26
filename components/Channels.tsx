
import React from 'react';
import { ArrowLeft, User, MessageCircle, Share2, Heart } from 'lucide-react';

const Channels: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="absolute inset-0 z-[100] bg-black flex flex-col">
      <header className="p-4 flex items-center justify-between text-white z-10 absolute top-0 w-full bg-gradient-to-b from-black/50 to-transparent">
        <ArrowLeft size={24} onClick={onBack} className="cursor-pointer" />
        <div className="flex gap-4 font-medium">
          <span className="opacity-70">Following</span>
          <span className="border-b-2 border-white pb-1">Hot</span>
        </div>
        <User size={24} />
      </header>

      <div className="flex-1 relative">
        <img src="https://picsum.photos/seed/travel/600/1000" className="w-full h-full object-cover" />
        
        {/* Interaction Bar */}
        <div className="absolute bottom-10 right-4 flex flex-col gap-6 text-white items-center">
          <div className="flex flex-col items-center gap-1">
            <Heart size={28} fill="currentColor" />
            <span className="text-xs">1.2w</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <MessageCircle size={28} fill="currentColor" />
            <span className="text-xs">452</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Share2 size={28} fill="currentColor" />
            <span className="text-xs">89</span>
          </div>
        </div>

        {/* Info Bar */}
        <div className="absolute bottom-10 left-4 text-white max-w-[70%]">
          <h4 className="font-bold flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-blue-500 rounded-full" />
            @GlobalTraveler
          </h4>
          <p className="text-sm line-clamp-2">Exploring the hidden gems of the world! #adventure #travel #vlog</p>
        </div>
      </div>
    </div>
  );
};

export default Channels;
