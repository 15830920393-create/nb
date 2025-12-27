
import React from 'react';
import { Camera, QrCode, Search, Gamepad2, ShoppingCart, Smartphone, Video } from 'lucide-react';

interface DiscoverProps {
  onOpenMoments: () => void;
  onOpenChannels: () => void;
  onOpenScan: () => void;
  onOpenGames: () => void;
}

const Discover: React.FC<DiscoverProps> = ({ onOpenMoments, onOpenChannels, onOpenScan, onOpenGames }) => {
  return (
    <div className="bg-[#EDEDED] space-y-2 pb-10">
      <div className="bg-white">
        <DiscoverItem 
          icon={<Camera className="text-[#FA9D3B]" />} 
          label="朋友圈" 
          onClick={onOpenMoments} 
          right={<div className="flex items-center gap-2">
            <img src="https://picsum.photos/seed/moments/100" className="w-8 h-8 rounded-sm object-cover" />
            <div className="w-2.5 h-2.5 bg-[#FA5151] rounded-full" />
          </div>} 
        />
      </div>

      <div className="bg-white">
        <DiscoverItem 
          icon={<Video className="text-[#FA9D3B]" />} 
          label="视频号" 
          onClick={onOpenChannels} 
          right={<span className="text-xs text-gray-400">有新视频</span>}
        />
      </div>

      <div className="bg-white divide-y divide-gray-100">
        <DiscoverItem icon={<QrCode className="text-[#576B95]" />} label="扫一扫" onClick={onOpenScan} />
        <DiscoverItem icon={<Smartphone className="text-[#07C160]" />} label="摇一摇" />
      </div>

      <div className="bg-white divide-y divide-gray-100">
        <DiscoverItem icon={<Search className="text-[#FA9D3B]" />} label="看一看" />
        <DiscoverItem icon={<Search className="text-[#FA5151]" />} label="搜一搜" />
      </div>

      <div className="bg-white">
        <DiscoverItem icon={<Gamepad2 className="text-[#FA9D3B]" />} label="游戏" onClick={onOpenGames} />
      </div>

      <div className="bg-white divide-y divide-gray-100">
        <DiscoverItem icon={<ShoppingCart className="text-[#FFC300]" />} label="视频号小店" />
        <DiscoverItem icon={<div className="w-6 h-6 bg-[#2B7AFA] rounded-full flex items-center justify-center text-white text-[10px] font-bold">小</div>} label="小程序" />
      </div>
    </div>
  );
};

const DiscoverItem = ({ icon, label, onClick, right }: { icon: React.ReactNode, label: string, onClick?: () => void, right?: React.ReactNode }) => (
  <div onClick={onClick} className="flex items-center justify-between p-4 active:bg-gray-100 cursor-pointer transition-colors">
    <div className="flex items-center gap-4">
      {icon}
      <span className="text-[15px] font-medium text-[#191919]">{label}</span>
    </div>
    <div className="flex items-center gap-1">
      {right}
      <div className="w-1.5 h-1.5 border-t-2 border-r-2 border-gray-300 rotate-45 ml-1"></div>
    </div>
  </div>
);

export default Discover;
