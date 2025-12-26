
import React from 'react';
import { ArrowLeft, Plus, MoreVertical } from 'lucide-react';
import { BankCard } from '../types';

interface BankCardsOverlayProps {
  cards: BankCard[];
  onBack: () => void;
  onOpenAdd: () => void;
}

const BankCardsOverlay: React.FC<BankCardsOverlayProps> = ({ cards, onBack, onOpenAdd }) => {
  return (
    <div className="absolute inset-0 z-[120] bg-[#EDEDED] flex flex-col">
      <header className="bg-[#EDEDED] p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ArrowLeft size={24} onClick={onBack} className="cursor-pointer" />
          <h1 className="text-lg font-semibold">Bank Cards</h1>
        </div>
        <Plus size={24} onClick={onOpenAdd} className="cursor-pointer" />
      </header>

      <div className="p-4 space-y-4 overflow-y-auto">
        {cards.map(card => (
          <div 
            key={card.id} 
            className="rounded-xl p-4 text-white shadow-lg relative overflow-hidden h-32 flex flex-col justify-between"
            style={{ backgroundColor: card.color }}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  {card.bankName[0]}
                </div>
                <div>
                  <h3 className="font-bold">{card.bankName}</h3>
                  <p className="text-[10px] opacity-70">{card.type} Card</p>
                </div>
              </div>
              <MoreVertical size={18} className="opacity-60" />
            </div>
            <p className="text-xl tracking-widest mt-auto">{card.cardNumber}</p>
          </div>
        ))}
        
        <div 
          onClick={onOpenAdd}
          className="bg-white rounded-xl p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 text-gray-400 cursor-pointer active:bg-gray-50"
        >
          <Plus size={32} />
          <span className="mt-2 font-medium">Add Bank Card</span>
        </div>
      </div>
    </div>
  );
};

export default BankCardsOverlay;
