
import React, { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Chat } from '../types';

interface TransferOverlayProps {
  recipient: Chat;
  onBack: () => void;
  onConfirm: (amount: string) => void;
}

const TransferOverlay: React.FC<TransferOverlayProps> = ({ recipient, onBack, onConfirm }) => {
  const [amount, setAmount] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');

  const handleConfirm = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setShowPin(true);
  };

  const handlePinClick = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 6) {
        setTimeout(() => {
          onConfirm(amount);
        }, 500);
      }
    }
  };

  return (
    <div className="absolute inset-0 z-[250] bg-white flex flex-col">
      <header className="p-4 flex items-center gap-4">
        <ArrowLeft size={24} onClick={onBack} className="cursor-pointer" />
        <h1 className="text-lg font-semibold">Transfer</h1>
      </header>

      <div className="flex-1 p-6 flex flex-col items-center">
        <img src={recipient.avatar} className="w-16 h-16 rounded-lg mb-4" />
        <h2 className="text-lg font-medium mb-10">Transfer to {recipient.name}</h2>
        
        <div className="w-full">
          <p className="text-sm text-gray-500 mb-2">Transfer Amount</p>
          <div className="flex items-end border-b-2 border-gray-100 py-2 gap-2">
            <span className="text-4xl font-medium">¥</span>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 text-5xl font-medium outline-none bg-transparent"
              autoFocus
            />
          </div>
        </div>

        <button 
          onClick={handleConfirm}
          disabled={!amount}
          className={`w-full py-3 rounded-lg font-bold text-white mt-auto mb-6 ${amount ? 'bg-[#07C160]' : 'bg-gray-300'}`}
        >
          Transfer
        </button>
      </div>

      {showPin && (
        <div className="absolute inset-0 z-[300] bg-black/50 flex flex-col justify-end">
           <div className="bg-white rounded-t-2xl p-6 animate-in slide-in-from-bottom duration-300">
             <div className="flex justify-between items-center mb-6">
                <X onClick={() => { setShowPin(false); setPin(''); }} className="cursor-pointer" />
                <h3 className="font-bold">Enter Payment Password</h3>
                <div className="w-6" />
             </div>
             
             <div className="flex justify-center gap-2 mb-10">
               {[0,1,2,3,4,5].map(i => (
                 <div key={i} className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center text-xl font-bold">
                   {pin[i] ? '●' : ''}
                 </div>
               ))}
             </div>

             <div className="grid grid-cols-3 gap-px bg-gray-200">
                {['1','2','3','4','5','6','7','8','9','','0','del'].map((key, i) => (
                  <button 
                    key={i} 
                    onClick={() => key === 'del' ? setPin(p => p.slice(0, -1)) : key && handlePinClick(key)}
                    className="h-14 bg-white active:bg-gray-100 text-xl font-medium"
                  >
                    {key === 'del' ? '←' : key}
                  </button>
                ))}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TransferOverlay;
