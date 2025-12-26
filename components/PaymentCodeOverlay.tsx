
import React from 'react';
import { ArrowLeft, MoreVertical, CreditCard, ShieldCheck, QrCode } from 'lucide-react';

const PaymentCodeOverlay: React.FC<{ onBack: () => void, onOpenReceipt: () => void }> = ({ onBack, onOpenReceipt }) => {
  return (
    <div className="absolute inset-0 z-[200] bg-[#07C160] flex flex-col text-white">
      <header className="p-4 flex items-center justify-between">
        <ArrowLeft size={24} onClick={onBack} className="cursor-pointer" />
        <h1 className="text-lg font-semibold">Payment Code</h1>
        <MoreVertical size={24} />
      </header>

      <div className="m-4 flex-1 bg-white rounded-xl flex flex-col overflow-hidden text-gray-900 shadow-xl">
        <div className="p-4 bg-[#F7F7F7] flex items-center gap-2 text-green-600 text-sm font-medium">
          <CreditCard size={18} />
          Payment Code
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
           {/* Barcode simulation */}
           <div className="w-full h-16 bg-gray-100 flex flex-col items-center justify-center border border-gray-200">
              <div className="flex gap-1 w-full px-4">
                 {[1,3,1,2,1,4,1,2,3,1,2,1,1,3,2,1].map((w, i) => (
                   <div key={i} className={`h-10 bg-black`} style={{ flex: w }}></div>
                 ))}
              </div>
              <span className="text-[10px] text-gray-400 mt-1">8888 1234 5678 9012</span>
           </div>

           {/* QR Code simulation */}
           <div className="w-48 h-48 border-8 border-white shadow-sm flex items-center justify-center bg-gray-50 relative">
             <QrCode size={160} className="text-gray-900" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                   <div className="w-6 h-6 bg-green-500 rounded" />
                </div>
             </div>
           </div>
           
           <p className="text-xs text-gray-400">Automatic payment enabled</p>
        </div>

        <footer className="p-4 border-t flex items-center justify-between active:bg-gray-50 cursor-pointer">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#07C160] rounded-full flex items-center justify-center text-white"><ShieldCheck size={18} /></div>
              <span className="text-sm">Balance</span>
           </div>
           <ArrowLeft className="rotate-180 text-gray-300" size={18} />
        </footer>
      </div>

      <div className="p-10 flex justify-center">
        <button onClick={onOpenReceipt} className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100">
           <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><QrCode size={24} /></div>
           <span className="text-xs">Receipt Code</span>
        </button>
      </div>
    </div>
  );
};

export default PaymentCodeOverlay;
