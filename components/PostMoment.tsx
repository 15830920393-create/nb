
import React, { useState } from 'react';
import { X, Camera, Plus, User, Smile } from 'lucide-react';
import { Moment } from '../types';

interface PostMomentProps {
  myAvatar: string;
  onBack: () => void;
  onPublish: (moment: Moment) => void;
}

const EMOJIS = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '☺️', '🙂', '🤗', '🤩'];

const PostMoment: React.FC<PostMomentProps> = ({ myAvatar, onBack, onPublish }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);

  const handlePublish = () => {
    if (!content.trim() && images.length === 0) return;
    
    const newMoment: Moment = {
      id: `m-${Date.now()}`,
      author: '微信用户',
      avatar: myAvatar,
      content: content.trim(),
      images: images,
      likes: 0,
      isLiked: false,
      comments: [],
      time: '刚刚'
    };
    
    onPublish(newMoment);
  };

  const addImage = () => {
    const randomImg = `https://picsum.photos/seed/${Math.random()}/600/600`;
    setImages([...images, randomImg]);
  };

  return (
    <div className="absolute inset-0 z-[200] bg-white flex flex-col pt-[env(safe-area-inset-top)]">
      <header className="px-4 py-3 flex justify-between items-center border-b border-gray-50">
        <button onClick={onBack} className="text-gray-800 font-medium">取消</button>
        <button 
          onClick={handlePublish}
          disabled={!content.trim() && images.length === 0}
          className={`bg-[#07C160] text-white px-5 py-1.5 rounded-md font-bold transition-opacity ${(!content.trim() && images.length === 0) ? 'opacity-40' : 'opacity-100'}`}
        >
          发表
        </button>
      </header>

      <div className="flex-1 p-5 overflow-y-auto no-scrollbar">
        <textarea 
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="这一刻的想法..."
          className="w-full h-32 text-lg outline-none resize-none placeholder-gray-300"
        />

        <div className="grid grid-cols-3 gap-2 mt-6">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square">
              <img src={img} className="w-full h-full object-cover rounded-sm" />
              <button 
                onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                className="absolute -top-2 -right-2 bg-black/50 text-white rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {images.length < 9 && (
            <button 
              onClick={addImage}
              className="aspect-square bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-gray-400 active:bg-gray-100"
            >
              <Plus size={32} />
            </button>
          )}
        </div>
      </div>

      <footer className="p-4 border-t border-gray-50 flex flex-col gap-4">
        {showEmoji && (
          <div className="grid grid-cols-8 gap-2 p-2 bg-gray-50 border rounded animate-in slide-in-from-bottom duration-200">
            {EMOJIS.map(e => (
              <button key={e} onClick={() => setContent(prev => prev + e)} className="text-2xl active:scale-125 transition-transform">{e}</button>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center text-gray-600">
          <div className="flex gap-6">
            <Smile size={24} onClick={() => setShowEmoji(!showEmoji)} className={`cursor-pointer ${showEmoji ? 'text-[#07C160]' : ''}`} />
            <Camera size={24} className="cursor-pointer" />
            <User size={24} className="cursor-pointer" />
          </div>
          <span className="text-xs text-gray-400">公开</span>
        </div>
      </footer>
    </div>
  );
};

export default PostMoment;
