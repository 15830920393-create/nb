import React from 'react';
import { ArrowLeft, CreditCard, Smartphone, Zap, Gift, ShieldCheck, Heart, LayoutGrid, Wallet as WalletIcon, QrCode } from 'lucide-react';

interface PayProps {
  balance: number;
  onBack: () => void;
  onOpenWalletDetail: () => void;
  onOpenPaymentCode: () => void;
}

const Pay: React.FC<PayProps> = ({ balance, onBack, onOpenWalletDetail, onOpenPaymentCode }) => {
  return (
    <div className="absolute inset-0 z-[100] bg-[#EDEDED] flex flex-col overflow-y-auto no-scrollbar">
      <header className="bg-[#EDEDED] p-4 flex items-center gap-4 border-b border-gray-200">
        <ArrowLeft size={24} onClick={onBack} className="cursor-pointer" />
        <h1 className="text-lg font-semibold">Services</h1>
      </header>

      {/* Wallet Banner */}
      <div className="m-3 p-6 bg-[#07C160] rounded-xl text-white flex flex-col gap-6 shadow-sm">
        <div className="flex justify-around items-center">
          <div onClick={onOpenPaymentCode} className="flex flex-col items-center gap-2 cursor-pointer active:opacity-70">
            <QrCode size={32} />
            <span className="text-sm font-medium">Money</span>
          </div>
          
          <div className="h-12 w-[1px] bg-white/20"></div>
          
          <div onClick={onOpenWalletDetail} className="flex flex-col items-center gap-1 cursor-pointer active:opacity-70">
            <WalletIcon size={32} />
            <span className="text-sm font-medium">Wallet</span>
            <span className="text-[11px] opacity-80">¥{balance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mx-3 mb-3 bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 text-[10px] text-gray-400 font-bold uppercase border-b border-gray-50">Financial Services</div>
        <div className="grid grid-cols-3">
          <PayItem icon={<LayoutGrid className="text-blue-500" />} label="Wealth" />
          <PayItem icon={<ShieldCheck className="text-blue-600" />} label="Insurance" />
          <PayItem icon={<Gift className="text-red-400" />} label="Credit Card" />
        </div>
      </div>

      <div className="mx-3 bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 text-[10px] text-gray-400 font-bold uppercase border-b border-gray-50">Daily Services</div>
        <div className="grid grid-cols-3">
          <PayItem icon={<Smartphone className="text-green-500" />} label="Mobile Top-up" />
          <PayItem icon={<Zap className="text-yellow-500" />} label="Utilities" />
          <PayItem icon={<Heart className="text-red-500" />} label="Charity" />
          <PayItem icon={<LayoutGrid className="text-orange-500" />} label="Food" />
          <PayItem icon={<LayoutGrid className="text-blue-400" />} label="Travel" />
          <PayItem icon={<LayoutGrid className="text-purple-500" />} label="Movies" />
        </div>
      </div>
    </div>
  );
};

const PayItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex flex-col items-center justify-center py-6 border-r border-b border-gray-50 active:bg-gray-50 cursor-pointer">
    {/* Fix: Added <any> to React.ReactElement to resolve property access error for size on icons */}
    {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
    <span className="text-xs text-gray-700 mt-2">{label}</span>
  </div>
);

export default Pay;