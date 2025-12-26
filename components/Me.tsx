
import React from 'react';
import { ChevronRight, CreditCard, Box, Smile, Settings, Image as ImageIcon } from 'lucide-react';

interface MeProps {
  userId: string | null;
  avatar: string;
  status: string | null;
  onOpenStatus: () => void;
  onOpenPay: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
}

const Me: React.FC<MeProps> = ({ userId, avatar, status, onOpenStatus, onOpenPay, onOpenProfile, onOpenSettings }) => {
  return (
    <div className="bg-[#EDEDED] space-y-2 min-h-full pb-10">
      <div 
        onClick={onOpenProfile}
        className="bg-white p-6 pt-10 flex items-start gap-4 active:bg-gray-100 cursor-pointer transition-colors"
      >
        <img src={avatar} alt="me" className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
        <div className="flex-1 mt-1">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{userId || "微信用户"}</h2>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            微信号: {userId ? `${userId}` : '未设置'}
            <ChevronRight size={14} />
          </p>
          <div 
            onClick={(e) => { e.stopPropagation(); onOpenStatus(); }}
            className={`mt-3 inline-flex items-center gap-1 border border-gray-200 px-3 py-1 rounded-full text-[10px] ${status ? 'bg-green-50 text-[#07C160] border-green-200' : 'text-gray-500'}`}
          >
             {status ? status : '+ 状态'}
          </div>
        </div>
        <div className="flex items-center h-16">
          <ChevronRight size={20} className="text-gray-400" />
        </div>
      </div>

      <div className="bg-white">
        <div onClick={onOpenPay} className="flex items-center justify-between p-4 active:bg-gray-100 cursor-pointer transition-colors">
          <div className="flex items-center gap-4">
            <CreditCard size={24} className="text-[#07C160]" />
            <span className="text-sm font-medium">服务</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">资产</span>
            <ChevronRight size={20} className="text-gray-300" />
          </div>
        </div>
      </div>

      <div className="bg-white divide-y divide-gray-100">
        <MeItem icon={<Box size={24} className="text-orange-500" />} label="收藏" />
        <MeItem icon={<ImageIcon size={24} className="text-blue-600" />} label="朋友圈" />
        <MeItem icon={<CreditCard size={24} className="text-blue-400" />} label="卡包" />
        <MeItem icon={<Smile size={24} className="text-orange-400" />} label="表情" />
      </div>

      <div className="bg-white">
        <div onClick={onOpenSettings} className="flex items-center justify-between p-4 active:bg-gray-100 cursor-pointer transition-colors">
          <div className="flex items-center gap-4">
            <Settings size={24} className="text-blue-500" />
            <span className="text-sm font-medium">设置</span>
          </div>
          <ChevronRight size={20} className="text-gray-300" />
        </div>
      </div>
    </div>
  );
};

const MeItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex items-center justify-between p-4 active:bg-gray-100 cursor-pointer transition-colors">
    <div className="flex items-center gap-4">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <ChevronRight size={20} className="text-gray-300" />
  </div>
);

export default Me;
