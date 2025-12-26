
import React, { useState } from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { BankCard } from '../types';

interface AddCardOverlayProps {
  onBack: () => void;
  onAdd: (card: BankCard) => void;
}

const COLORS = ['#C8161D', '#B11212', '#004098', '#108848', '#FF6600'];

const AddCardOverlay: React.FC<AddCardOverlayProps> = ({ onBack, onAdd }) => {
  const [bankName, setBankName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const handleConfirm = () => {
    if (!bankName || !cardNumber) return;
    const newCard: BankCard = {
      id: Date.now().toString(),
      bankName,
      cardNumber: `**** ${cardNumber.slice(-4)}`,
      type: 'Debit',
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
    onAdd(newCard);
  };

  return (
    <div className="absolute inset-0 z-[130] bg-white flex flex-col">
      <header className="p-4 flex items-center gap-4 border-b">
        <ArrowLeft size={24} onClick={onBack} className="cursor-pointer" />
        <h1 className="text-lg font-semibold">Add Card</h1>
      </header>

      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
            <CreditCard size={32} />
          </div>
          <p className="text-xs text-gray-400 mt-2">Secure Link your card</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Bank Name</label>
            <input 
              type="text" 
              placeholder="e.g. ICBC"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#07C160]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Card Number</label>
            <input 
              type="number" 
              placeholder="Enter card number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#07C160]"
            />
          </div>
        </div>

        <button 
          onClick={handleConfirm}
          disabled={!bankName || !cardNumber}
          className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-colors mt-10 ${(!bankName || !cardNumber) ? 'bg-gray-300' : 'bg-[#07C160]'}`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default AddCardOverlay;
