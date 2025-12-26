
import React from 'react';
import { ArrowLeft, X } from 'lucide-react';

const STATUS_OPTIONS = [
  { icon: '💼', label: 'Working' },
  { icon: '🏖️', label: 'Vacation' },
  { icon: '🎮', label: 'Gaming' },
  { icon: '🎵', label: 'Music' },
  { icon: '🏃', label: 'Sports' },
  { icon: '☕', label: 'Coffee' },
  { icon: '💤', label: 'Sleep' },
  { icon: '📚', label: 'Study' },
];

const StatusPicker: React.FC<{ onSelect: (s: string) => void, onBack: () => void }> = ({ onSelect, onBack }) => {
  return (
    <div className="absolute inset-0 z-[200] bg-white flex flex-col">
      <header className="p-4 flex items-center justify-between border-b">
        <ArrowLeft size={24} onClick={onBack} className="cursor-pointer" />
        <h1 className="text-lg font-semibold">My Status</h1>
        <div className="w-6" />
      </header>

      <div className="p-6 grid grid-cols-4 gap-6">
        {STATUS_OPTIONS.map((opt) => (
          <div 
            key={opt.label} 
            onClick={() => onSelect(`${opt.icon} ${opt.label}`)}
            className="flex flex-col items-center gap-2 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-100">
              {opt.icon}
            </div>
            <span className="text-[10px] text-gray-500">{opt.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto p-10 flex flex-col items-center gap-4 text-gray-400 italic text-sm">
        <p>"Life is what happens while you're making other plans."</p>
        <button onClick={() => onSelect('')} className="text-[#576B95] not-italic font-medium">Clear Status</button>
      </div>
    </div>
  );
};

export default StatusPicker;
