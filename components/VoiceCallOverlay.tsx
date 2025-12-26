
import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, PhoneOff, User, MoreHorizontal } from 'lucide-react';
import { Chat } from '../types';
import { generateTTS } from '../services/geminiService';

interface VoiceCallOverlayProps {
  chat: Chat;
  onBack: () => void;
}

// Helper functions for audio decoding (locally defined to avoid duplication issues if needed)
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const VoiceCallOverlay: React.FC<VoiceCallOverlayProps> = ({ chat, onBack }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [status, setStatus] = useState('正在呼叫...');
  const [seconds, setSeconds] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return audioContextRef.current;
  };

  const playGreeting = async () => {
    const ctx = getAudioContext();
    const greeting = `喂，${chat.name} 正在通话中，请问有什么可以帮到您的吗？`;
    const base64Audio = await generateTTS(greeting, 'Zephyr');
    
    if (base64Audio) {
      try {
        const audioBuffer = await decodeAudioData(
          decodeBase64(base64Audio),
          ctx,
          24000,
          1
        );
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      } catch (e) {
        console.error("Call greeting failed", e);
      }
    }
  };

  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      setStatus('通话中');
      playGreeting();
    }, 3000);

    return () => {
      clearTimeout(connectTimer);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    let interval: any;
    if (isConnected) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 z-[500] bg-[#1a1a1a] flex flex-col items-center p-12 text-white animate-in fade-in duration-300">
      <header className="w-full flex justify-end">
        <MoreHorizontal size={24} className="opacity-60" />
      </header>

      <div className="mt-12 flex flex-col items-center">
        <div className="relative">
           <img src={chat.avatar} className="w-24 h-24 rounded-2xl object-cover shadow-2xl mb-6" />
           {!isConnected && (
             <div className="absolute inset-0 bg-[#07C160]/20 rounded-2xl animate-ping" />
           )}
        </div>
        <h2 className="text-2xl font-bold mb-2">{chat.name}</h2>
        <p className="text-sm opacity-60 font-medium">
          {isConnected ? formatTime(seconds) : status}
        </p>
      </div>

      <div className="mt-auto w-full grid grid-cols-3 gap-8 pb-20">
        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-white text-gray-900' : 'bg-white/10'}`}
          >
            {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
          </button>
          <span className="text-xs opacity-60">静音</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={onBack}
            className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center active:scale-90 transition-transform"
          >
            <PhoneOff size={28} />
          </button>
          <span className="text-xs opacity-60">挂断</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isSpeaker ? 'bg-white text-gray-900' : 'bg-white/10'}`}
          >
            <Volume2 size={28} className={isSpeaker ? 'fill-current' : ''} />
          </button>
          <span className="text-xs opacity-60">扬声器</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceCallOverlay;
