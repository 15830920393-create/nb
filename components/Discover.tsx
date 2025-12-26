
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
          icon={<Camera className="text-orange-500" />} 
          label="朋友圈" 
          onClick={onOpenMoments} 
          right={<div className="flex items-center gap-2">
            <img src="https://picsum.photos/seed/moments/100" className="w-8 h-8 rounded-sm object-cover" />
            <div className="w-2 h-2 bg-red-500 rounded-full" />
          </div>} 
        />
      </div>

      <div className="bg-white">
        <DiscoverItem 
          icon={<Video className="text-orange-500" />} 
          label="视频号" 
          onClick={onOpenChannels} 
          right={<span className="text-xs text-gray-400">有新视频</span>}
        />
      </div>

      <div className="bg-white divide-y divide-gray-100">
        <DiscoverItem icon={<QrCode className="text-blue-600" />} label="扫一扫" onClick={onOpenScan} />
        <DiscoverItem icon={<Smartphone className="text-green-500" />} label="摇一摇" />
      </div>

      <div className="bg-white divide-y divide-gray-100">
        <DiscoverItem icon={<Search className="text-orange-500" />} label="看一看" />
        <DiscoverItem icon={<Search className="text-red-500" />} label="搜一搜" />
      </div>

      <div className="bg-white">
        <DiscoverItem icon={<Gamepad2 className="text-orange-400" />} label="游戏" onClick={onOpenGames} />
      </div>

      <div className="bg-white divide-y divide-gray-100">
        <DiscoverItem icon={<ShoppingCart className="text-yellow-500" />} label="视频号小店" />
        <DiscoverItem icon={<div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-white text-[10px] font-bold">小</div>} label="小程序" />
      </div>
    </div>
  );
};

const DiscoverItem = ({ icon, label, onClick, right }: { icon: React.ReactNode, label: string, onClick?: () => void, right?: React.ReactNode }) => (
  <div onClick={onClick} className="flex items-center justify-between p-4 active:bg-gray-100 cursor-pointer">
    <div className="flex items-center gap-4">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    {right}
  </div>
);

export default Discover;
