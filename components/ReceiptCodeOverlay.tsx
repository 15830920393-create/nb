
import React from 'react';
import { ArrowLeft, MoreVertical, Wallet, Settings } from 'lucide-react';

const ReceiptCodeOverlay: React.FC<{ avatar: string, onBack: () => void }> = ({ avatar, onBack }) => {
  return (
    <div className="absolute inset-0 z-[210] bg-[#EDEDED] flex flex-col">
      <header className="p-4 bg-white flex items-center justify-between border-b">
        <ArrowLeft size={24} onClick={onBack} className="cursor-pointer" />
        <h1 className="text-lg font-semibold">二维码收钱</h1>
        <MoreVertical size={24} />
      </header>

      <div className="m-6 bg-[#07C160] rounded-xl flex-1 flex flex-col text-white shadow-xl max-h-[500px]">
        <div className="p-4 border-b border-white/20 flex items-center justify-between">
           <span className="text-sm font-medium">收钱</span>
           <Settings size={18} />
        </div>

        <div className="flex-1 bg-white m-4 rounded-lg flex flex-col items-center justify-center text-gray-900 p-8 gap-6">
           <p className="text-sm font-medium text-gray-500">扫一扫，向我付钱</p>
           
           <div className="w-48 h-48 border-4 border-white shadow-sm flex items-center justify-center bg-gray-50 relative">
             <div className="w-full h-full p-2">
                <div className="grid grid-cols-10 grid-rows-10 w-full h-full gap-1">
                   {Array.from({length: 100}).map((_, i) => (
                     <div key={i} className={`rounded-sm ${Math.random() > 0.6 ? 'bg-green-600' : 'bg-transparent'}`} />
                   ))}
                </div>
             </div>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md overflow-hidden">
                   <img src={avatar} className="w-full h-full object-cover" />
                </div>
             </div>
           </div>

           <button className="text-[#576B95] text-sm font-medium">设置金额</button>
        </div>

        <div className="p-4 border-t border-white/20 flex items-center justify-center gap-2 text-sm">
           <Wallet size={16} />
           已开启收钱提醒，钱款直接进入余额
        </div>
      </div>
      
      <div className="p-6 text-center text-gray-400 text-xs italic">
        "本地持久化层保障支付安全"
      </div>
    </div>
  );
};

export default ReceiptCodeOverlay;
