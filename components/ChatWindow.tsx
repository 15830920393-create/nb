
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MoreHorizontal, Mic, Smile, PlusCircle, Send, ImageIcon, Camera, Video, MapPin, Wallet, Phone, X, ArrowRightLeft, ShieldCheck, Ghost, Volume2, Check, CheckCheck, Trash2, RotateCcw, Copy, Bold, Italic, Strikethrough } from 'lucide-react';
import { Chat, Message } from '../types';
import { getGeminiResponse, generateTTS } from '../services/geminiService';

interface ChatWindowProps {
  chat: Chat;
  myAvatar: string;
  onBack: () => void;
  onSendMessage: (text: string, type?: string, amount?: string, duration?: number) => void;
  onRecallMessage: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReceiveMessage: (chatId: string, text: string) => void;
  onOpenRedPacket: (msgId: string) => void;
  onReceiveTransfer: (msgId: string) => void;
  onOpenTransfer: () => void;
  onOpenCall: () => void;
}

const EMOJIS = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '☺️', '🙂', '🤗', '🤩', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '🥱', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '🥴', '😠', '😡', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🥳', '🥺', '🤠', '🤡', '🤥', '🤫', '🤭', '🧐', '调研', '😈', '👿', '👹', '👺', '💀', '👻', '👽', '🤖', '💩'];

const STICKERS = [
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZhcW1icjB4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/3ornk6UHtg3W63vYpG/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZhcW1icjB4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/3o7TKMGV7XWfE8I4pG/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZhcW1icjB4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/l41lTfuxV5R8XkC7C/giphy.gif'
];

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

const RECALL_TIMEOUT = 120000; // 2 minutes

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, myAvatar, onBack, onSendMessage, onRecallMessage, onDeleteMessage, onReceiveMessage, onOpenRedPacket, onReceiveTransfer, onOpenTransfer, onOpenCall }) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [emojiTab, setEmojiTab] = useState<'emoji' | 'sticker'>('emoji');
  const [showPlus, setShowPlus] = useState(false);
  const [activeRP, setActiveRP] = useState<Message | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ messageId: string, x: number, y: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recordInterval = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const longPressTimer = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chat.messages, isTyping]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return audioContextRef.current;
  };

  const applyFormatting = (prefix: string, suffix: string) => {
    if (!inputRef.current) return;
    const { selectionStart, selectionEnd } = inputRef.current;
    const start = selectionStart || 0;
    const end = selectionEnd || 0;
    const text = inputText;
    const selected = text.substring(start, end);
    const newText = text.substring(0, start) + prefix + selected + suffix + text.substring(end);
    setInputText(newText);
    
    setTimeout(() => {
      inputRef.current?.focus();
      const newCursor = start + prefix.length + selected.length + suffix.length;
      inputRef.current?.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const userText = inputText.trim();
    onSendMessage(userText);
    setInputText('');
    setShowEmoji(false);
    setShowPlus(false);

    if (chat.isAI) {
      const delay = 1000 + Math.random() * 2000;
      setTimeout(async () => {
        setIsTyping(true);
        const history = chat.messages
          .filter(m => m.type === 'text' && !m.isRecalled)
          .slice(-10)
          .map(m => ({
            role: (m.isMe ? 'user' : 'model') as 'user' | 'model',
            parts: [{ text: m.text || '' }]
          }));
        
        try {
          const aiResponse = await getGeminiResponse(userText, history, chat.name);
          setIsTyping(false);
          onReceiveMessage(chat.id, aiResponse);
        } catch (e) {
          setIsTyping(false);
          onReceiveMessage(chat.id, "信号不稳定，刚才没看清，再说一遍？");
        }
      }, delay);
    }
  };

  const handleSendSticker = (url: string) => {
    onSendMessage(url, 'image');
    setShowEmoji(false);
  };

  const startRecording = () => {
    if ('vibrate' in navigator) navigator.vibrate(20);
    setIsRecording(true);
    setRecordDuration(0);
    recordInterval.current = setInterval(() => {
      setRecordDuration(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = (shouldSend: boolean) => {
    clearInterval(recordInterval.current);
    if (shouldSend && recordDuration > 0) {
      onSendMessage('', 'voice', undefined, recordDuration);
    }
    setIsRecording(false);
    setRecordDuration(0);
  };

  const playVoice = async (msg: Message) => {
    if (playingVoiceId || msg.isRecalled) return;
    
    setPlayingVoiceId(msg.id);
    const ctx = getAudioContext();
    const voiceText = msg.text || "喂，收到我的语音了吗？";
    const base64Audio = await generateTTS(voiceText, msg.isMe ? 'Kore' : 'Zephyr');
    
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
        source.onended = () => setPlayingVoiceId(null);
        source.start();
      } catch (e) {
        console.error("Playback failed", e);
        setPlayingVoiceId(null);
      }
    } else {
      setTimeout(() => setPlayingVoiceId(null), (msg.duration || 1) * 1000);
    }
  };

  const handleMessageLongPress = (e: React.MouseEvent | React.TouchEvent, msg: Message) => {
    if (msg.isRecalled) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    longPressTimer.current = setTimeout(() => {
      if ('vibrate' in navigator) navigator.vibrate(40);
      setContextMenu({
        messageId: msg.id,
        x: Math.min(window.innerWidth - 130, Math.max(20, clientX - 60)),
        y: Math.min(window.innerHeight - 180, clientY - 100)
      });
    }, 600);
  };

  const clearLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleCopy = async (msg: Message) => {
    if (msg.text && msg.type === 'text') {
      try {
        await navigator.clipboard.writeText(msg.text);
        setToast('已复制');
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
    setContextMenu(null);
  };

  const handleRecall = (msgId: string) => {
    onRecallMessage(msgId);
    setContextMenu(null);
  };

  const handleDelete = (msgId: string) => {
    onDeleteMessage(msgId);
    setContextMenu(null);
  };

  const handleReEdit = (text: string) => {
    setInputText(text);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*[^*]+\*|_[^_]+_|~[^~]+~)/g);
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <strong key={i}>{part.slice(1, -1)}</strong>;
      }
      if (part.startsWith('_') && part.endsWith('_')) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('~') && part.endsWith('~')) {
        return <del key={i}>{part.slice(1, -1)}</del>;
      }
      return part;
    });
  };

  const activeContextMsg = contextMenu ? chat.messages.find(m => m.id === contextMenu.messageId) : null;

  return (
    <div className="flex flex-col h-screen w-full bg-[#EDEDED] absolute inset-0 z-[100] touch-none animate-in slide-in-from-right duration-300">
      {isRecording && (
        <div className="absolute inset-0 z-[400] bg-black/40 flex items-center justify-center p-10 pointer-events-none backdrop-blur-[2px]">
           <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center gap-4 text-white shadow-2xl">
              <div className="flex gap-1.5 h-16 items-center">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1 bg-[#07C160] rounded-full animate-bounce" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.05}s` }} />
                ))}
              </div>
              <p className="text-xl font-bold font-mono">{recordDuration}s</p>
              <p className="text-xs opacity-70">手指上滑，取消发送</p>
           </div>
        </div>
      )}

      {toast && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium animate-in fade-in zoom-in duration-200">
          {toast}
        </div>
      )}

      {activeRP && (
        <div className="absolute inset-0 z-[300] bg-black/60 flex items-center justify-center p-10 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-[#E15545] w-full max-w-[280px] aspect-[4/5] rounded-2xl overflow-hidden relative flex flex-col items-center p-8 text-white shadow-2xl animate-in zoom-in-95 duration-200">
              <button onClick={() => setActiveRP(null)} className="absolute top-4 left-4 p-2 active:bg-white/10 rounded-full"><X size={20} /></button>
              <img src={chat.avatar} className="w-16 h-16 rounded-xl border-2 border-[#FBD49D] mb-4 object-cover shadow-lg" />
              <h3 className="text-lg font-bold">{chat.name}</h3>
              <p className="text-[#FBD49D] text-sm mb-auto mt-4 font-medium italic">恭喜发财，大吉大利</p>
              <button 
                onClick={() => { onOpenRedPacket(activeRP.id); setActiveRP(null); }} 
                className="w-24 h-24 bg-[#FBD49D] rounded-full flex items-center justify-center text-[#E15545] text-4xl font-bold shadow-xl active:scale-90 transition-transform mb-4 border-4 border-[#E15545]"
              >
                開
              </button>
           </div>
        </div>
      )}

      {contextMenu && activeContextMsg && (
        <div className="absolute inset-0 z-[500] bg-black/5" onClick={() => setContextMenu(null)}>
          <div 
            className="absolute bg-[#333]/95 backdrop-blur-xl text-white rounded-xl flex flex-col min-w-[130px] shadow-2xl animate-in fade-in zoom-in duration-100 overflow-hidden border border-white/10"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            {activeContextMsg.type === 'text' && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleCopy(activeContextMsg); }}
                className="flex items-center gap-3 px-4 py-3 active:bg-white/10 text-sm border-b border-white/5 transition-colors"
              >
                <Copy size={16} className="opacity-70" /> 复制
              </button>
            )}
            {activeContextMsg.isMe && 
             (Date.now() - activeContextMsg.timestamp < RECALL_TIMEOUT) && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleRecall(contextMenu.messageId); }}
                className="flex items-center gap-3 px-4 py-3 active:bg-white/10 text-sm border-b border-white/5 transition-colors"
              >
                <RotateCcw size={16} className="opacity-70" /> 撤回
              </button>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); handleDelete(contextMenu.messageId); }}
              className="flex items-center gap-3 px-4 py-3 active:bg-red-500/20 text-red-400 text-sm transition-colors"
            >
              <Trash2 size={16} className="text-red-400 opacity-70" /> 删除
            </button>
          </div>
        </div>
      )}

      <header className="bg-[#EDEDED] px-4 py-3 flex justify-between items-center shrink-0 border-b border-[#DDD] pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-2">
          <ArrowLeft size={24} className="text-[#333] cursor-pointer active:opacity-50" onClick={onBack} />
          <div>
            <h1 className="text-base font-bold text-[#111] truncate max-w-[160px]">{chat.name}</h1>
            {isTyping ? (
              <p className="text-[10px] text-[#07C160] font-bold animate-pulse">对方正在输入...</p>
            ) : (
              <div className="flex items-center gap-1 text-[9px] text-gray-400 font-medium">
                <ShieldCheck size={10} className="text-[#07C160]" />
                <span>端到端加密连接已建立</span>
              </div>
            )}
          </div>
        </div>
        <MoreHorizontal size={24} className="text-[#333] cursor-pointer active:opacity-50" />
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar touch-pan-y overscroll-contain bg-[#EDEDED]" onClick={() => { setShowEmoji(false); setShowPlus(false); setContextMenu(null); }}>
        {chat.messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col items-center w-full`}>
            {msg.isRecalled ? (
              <div className="my-2 py-1 px-4 text-center">
                <span className="text-[11px] text-gray-400 bg-gray-200/50 px-2 py-0.5 rounded-full inline-block">
                  {msg.isMe ? '你撤回了一条消息' : '对方撤回了一条消息'}
                  {msg.isMe && msg.type === 'text' && (
                    <button onClick={() => handleReEdit(msg.text || '')} className="text-[#576B95] ml-2 active:opacity-50 font-bold">重新编辑</button>
                  )}
                </span>
              </div>
            ) : (
              <div 
                onMouseDown={(e) => handleMessageLongPress(e, msg)}
                onMouseUp={clearLongPress}
                onMouseLeave={clearLongPress}
                onTouchStart={(e) => handleMessageLongPress(e, msg)}
                onTouchEnd={clearLongPress}
                className={`flex w-full ${msg.isMe ? 'justify-end' : 'justify-start'} items-start gap-2 mb-2 group animate-in slide-in-from-bottom-2 duration-300`}
              >
                {!msg.isMe && <img src={chat.avatar} className="w-10 h-10 rounded-lg shrink-0 object-cover shadow-sm bg-white" />}
                
                <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                  {msg.type === 'text' && (
                    <div className={`px-3 py-2.5 rounded-lg text-[15px] font-medium break-words shadow-sm relative transition-all active:brightness-90 ${msg.isMe ? 'bg-[#07C160] text-white rounded-tr-none' : 'bg-white text-[#111] rounded-tl-none'}`}>
                      {renderFormattedText(msg.text || '')}
                    </div>
                  )}

                  {msg.type === 'voice' && (
                    <div onClick={() => playVoice(msg)} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg shadow-sm cursor-pointer active:opacity-80 transition-all ${msg.isMe ? 'bg-[#07C160] rounded-tr-none flex-row-reverse text-white' : 'bg-white rounded-tl-none'}`} style={{ width: `${Math.min(220, 80 + (msg.duration || 1) * 15)}px` }}>
                      <Volume2 size={18} className={playingVoiceId === msg.id ? 'animate-pulse' : ''} />
                      <span className={`text-xs font-bold ${msg.isMe ? 'text-white' : 'text-gray-500'}`}>{msg.duration}"</span>
                    </div>
                  )}

                  {msg.type === 'image' && (
                    <div className="max-w-[200px] rounded-lg overflow-hidden shadow-md active:scale-95 transition-transform">
                      <img src={msg.text} alt="sticker" className="w-full h-auto object-cover bg-white" />
                    </div>
                  )}

                  {msg.type === 'red-packet' && (
                    <div onClick={() => !msg.isOpened && setActiveRP(msg)} className={`w-56 rounded-lg overflow-hidden flex flex-col cursor-pointer active:scale-[0.98] transition-transform shadow-md ${msg.isOpened ? 'opacity-70 bg-[#FA9D3B]/80' : 'bg-[#FA9D3B]'}`}>
                      <div className="flex-1 p-3.5 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-red-500 text-xl font-bold ${msg.isOpened ? 'bg-gray-200' : 'bg-[#FCD8A2]'}`}>🧧</div>
                        <div className="text-white">
                          <p className="text-[14px] font-bold leading-tight">{msg.isOpened ? '红包已被领完' : '恭喜发财，大吉大利'}</p>
                          <p className="text-[11px] opacity-90 mt-1">{msg.isOpened ? `已查看详情` : '微信红包'}</p>
                        </div>
                      </div>
                      <div className="bg-white px-3 py-1.5 text-[10px] text-gray-400 font-medium">微信支付</div>
                    </div>
                  )}

                  {msg.type === 'transfer' && (
                    <div onClick={() => !msg.isMe && !msg.isReceived && onReceiveTransfer(msg.id)} className={`w-56 rounded-lg overflow-hidden flex flex-col cursor-pointer active:scale-[0.98] transition-transform shadow-md ${msg.isReceived ? 'opacity-70 bg-orange-400/80' : 'bg-orange-400'}`}>
                      <div className="flex-1 p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-orange-400"><ArrowRightLeft size={20} strokeWidth={3} /></div>
                        <div className="text-white">
                          <p className="text-[16px] font-black">¥{msg.amount}</p>
                          <p className="text-[11px] opacity-90 font-medium">{msg.isReceived ? '已确认收款' : (msg.isMe ? '等待对方确认' : '点击确认收钱')}</p>
                        </div>
                      </div>
                      <div className="bg-white px-3 py-1.5 text-[10px] text-gray-400 font-medium">微信转账</div>
                    </div>
                  )}

                  {msg.isMe && msg.status && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {msg.status === 'sent' && <Check size={10} />}
                      {msg.status === 'read' && <CheckCheck size={10} className="text-[#07C160]" />}
                      <span>{msg.status === 'read' ? '已读' : '已送达'}</span>
                    </div>
                  )}
                </div>

                {msg.isMe && <img src={myAvatar} className="w-10 h-10 rounded-lg shrink-0 object-cover shadow-sm bg-white" />}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-[#F7F7F7] border-t border-[#DDD] p-2 flex flex-col gap-2 pb-[calc(8px+env(safe-area-inset-bottom))]">
        {inputText.length > 0 && (
          <div className="flex items-center gap-4 px-3 py-1 bg-[#EDEDED] rounded-t-lg border-b border-[#DDD] animate-in slide-in-from-bottom-2">
            <button onClick={() => applyFormatting('*', '*')} className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-600"><Bold size={18} /></button>
            <button onClick={() => applyFormatting('_', '_')} className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-600"><Italic size={18} /></button>
            <button onClick={() => applyFormatting('~', '~')} className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-600"><Strikethrough size={18} /></button>
          </div>
        )}
        <div className="flex items-center gap-2 px-1">
          <Mic 
            size={28} 
            className={`cursor-pointer active:scale-90 transition-all ${isRecording ? 'text-[#07C160]' : 'text-[#333]'}`} 
            onMouseDown={startRecording}
            onMouseUp={() => stopRecording(true)}
            onTouchStart={startRecording}
            onTouchEnd={() => stopRecording(true)}
          />
          <input 
            ref={inputRef}
            type="text" 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
            onFocus={() => { setShowEmoji(false); setShowPlus(false); }}
            className="flex-1 bg-white border border-[#DDD] rounded-md px-3 py-2 text-[15px] outline-none caret-[#07C160]" 
            placeholder="发消息..." 
          />
          <Smile 
            size={28} 
            className={`cursor-pointer active:scale-90 transition-all ${showEmoji ? 'text-[#07C160]' : 'text-[#333]'}`} 
            onClick={() => { setShowEmoji(!showEmoji); setShowPlus(false); }} 
          />
          {inputText.trim() ? (
            <button onClick={handleSend} className="bg-[#07C160] text-white px-4 py-2 rounded-md font-bold active:bg-[#06ae56] transition-colors shadow-sm">发送</button>
          ) : (
            <PlusCircle 
              size={28} 
              className={`cursor-pointer active:scale-90 transition-all ${showPlus ? 'text-[#07C160]' : 'text-[#333]'}`} 
              onClick={() => { setShowPlus(!showPlus); setShowEmoji(false); }} 
            />
          )}
        </div>

        {showEmoji && (
          <div className="h-72 flex flex-col bg-[#F7F7F7] animate-in slide-in-from-bottom duration-300">
            <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
              {emojiTab === 'emoji' ? (
                <div className="grid grid-cols-8 gap-y-4 place-items-center">
                  {EMOJIS.map(e => (
                    <button key={e} onClick={() => setInputText(prev => prev + e)} className="text-2xl active:scale-125 transition-transform">{e}</button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {STICKERS.map((s, i) => (
                    <button key={i} onClick={() => handleSendSticker(s)} className="w-full aspect-square bg-white rounded-lg flex items-center justify-center p-1 active:scale-95 transition-transform shadow-sm overflow-hidden border border-gray-100">
                      <img src={s} className="w-full h-full object-contain" alt="sticker" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex bg-white p-2 gap-4 items-center px-4 border-t border-[#DDD]">
              <button onClick={() => setEmojiTab('emoji')} className={`text-sm font-bold px-4 py-1.5 rounded-md transition-colors ${emojiTab === 'emoji' ? 'bg-[#F0F0F0] text-[#07C160]' : 'text-gray-400'}`}>经典</button>
              <button onClick={() => setEmojiTab('sticker')} className={`text-sm font-bold px-4 py-1.5 rounded-md transition-colors flex items-center gap-1 ${emojiTab === 'sticker' ? 'bg-[#F0F0F0] text-[#07C160]' : 'text-gray-400'}`}><Ghost size={16} /> 表情包</button>
            </div>
          </div>
        )}

        {showPlus && (
          <div className="grid grid-cols-4 gap-4 p-5 h-72 bg-[#F7F7F7] animate-in slide-in-from-bottom duration-300">
             <PlusItem icon={<ImageIcon className="text-[#333]" />} label="相册" />
             <PlusItem icon={<Camera className="text-[#333]" />} label="拍摄" />
             <PlusItem icon={<Video className="text-[#333]" />} label="视频通话" />
             <PlusItem icon={<MapPin className="text-[#333]" />} label="位置" />
             <PlusItem icon={<Wallet className="text-orange-500" />} label="红包" onClick={() => onSendMessage('', 'red-packet', (Math.random() * 5 + 1).toFixed(2))} />
             <PlusItem icon={<ArrowRightLeft className="text-orange-500" />} label="转账" onClick={onOpenTransfer} />
             <PlusItem icon={<Phone className="text-[#333]" />} label="语音通话" onClick={onOpenCall} />
             <PlusItem icon={<Smile className="text-[#333]" />} label="我的收藏" />
          </div>
        )}
      </div>
    </div>
  );
};

const PlusItem = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) => (
  <div className="flex flex-col items-center gap-2 group" onClick={onClick}>
    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm active:bg-gray-200 cursor-pointer transition-colors group-active:scale-95">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 26 })}
    </div>
    <span className="text-[11px] text-[#666] font-medium">{label}</span>
  </div>
);

export default ChatWindow;
