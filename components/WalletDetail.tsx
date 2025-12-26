
import React from 'react';
import { ArrowLeft, CreditCard, ShieldCheck, History, MoreVertical } from 'lucide-react';

interface WalletDetailProps {
  balance: number;
  cardsCount: number;
  onBack: () => void;
  onOpenCards: () => void;
}

const WalletDetail: React.FC<WalletDetailProps> = ({ balance, cardsCount, onBack, onOpenCards }) => {
  return (
    <div className="absolute inset-0 z-[110] bg-[#EDEDED] flex flex-col">
      <header className="bg-[#EDEDED] p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ArrowLeft size={24} onClick={onBack} className="cursor-pointer" />
          <h1 className="text-lg font-semibold">Wallet</h1>
        </div>
        <MoreVertical size={24} />
      </header>

      <div className="p-4 space-y-4 overflow-y-auto">
        <div className="bg-white rounded-xl p-6 flex flex-col items-center gap-2 shadow-sm">
          <div className="w-12 h-12 bg-[#07C160] rounded-full flex items-center justify-center text-white">
            <History size={24} />
          </div>
          <span className="text-sm text-gray-500">Balance</span>
          <h2 className="text-3xl font-bold">¥{balance.toFixed(2)}</h2>
        </div>

        <div className="bg-white rounded-xl overflow-hidden divide-y divide-gray-50">
          <div onClick={onOpenCards} className="flex items-center justify-between p-4 active:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <CreditCard className="text-orange-400" />
              <span className="font-medium">Bank Cards</span>
            </div>
            <span className="text-sm text-gray-400">{cardsCount} cards</span>
          </div>
          <div className="flex items-center justify-between p-4 active:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-500" />
              <span className="font-medium">Identity Verification</span>
            </div>
            <span className="text-sm text-green-500">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDetail;
