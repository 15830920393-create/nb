
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Zap, ImageIcon } from 'lucide-react';

const ScanView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [linePos, setLinePos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLinePos(prev => (prev > 100 ? 0 : prev + 2));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-[150] bg-black flex flex-col text-white">
      <header className="p-4 flex items-center justify-between">
        <ArrowLeft size={24} onClick={onBack} className="cursor-pointer" />
        <span className="font-medium">Scan</span>
        <Zap size={24} />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <div className="relative w-64 h-64 border-2 border-white/30 rounded-lg overflow-hidden">
          {/* Scan Line */}
          <div 
            className="absolute left-0 right-0 h-0.5 bg-[#07C160] shadow-[0_0_10px_#07C160] transition-all duration-300" 
            style={{ top: `${linePos}%` }}
          />
          {/* Corners */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#07C160]" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#07C160]" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#07C160]" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#07C160]" />
        </div>
        <p className="mt-10 text-sm opacity-70">Align QR code within frame to scan</p>
      </div>

      <footer className="p-10 flex justify-around items-center bg-black/50">
        <div className="flex flex-col items-center gap-1 opacity-100">
           <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"><Zap size={20} /></div>
           <span className="text-[10px]">QR Code</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-40">
           <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"><Zap size={20} /></div>
           <span className="text-[10px]">Translate</span>
        </div>
        <div className="flex flex-col items-center gap-1" onClick={onBack}>
           <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"><ImageIcon size={20} /></div>
           <span className="text-[10px]">Album</span>
        </div>
      </footer>
    </div>
  );
};

export default ScanView;
