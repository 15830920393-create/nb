
import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Heart, MessageSquare, Smile, Ghost, ImageIcon, X, Download } from 'lucide-react';
import { Moment, Comment } from '../types';

interface MomentsProps {
  myAvatar: string;
  moments: Moment[];
  cover: string;
  onUpdateMoments: (moments: Moment[]) => void;
  onBack: () => void;
  onPost: () => void;
  onUpdateCover: (url: string) => void;
}

const EMOJIS = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '☺️', '🙂', '🤗', '🤩', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '🥱', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '🥴', '😠', '😡', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🥳', '🥺', '🤠', '🤡', '🤥', '🤫', '🤭', '🧐', '调研', '😈', '👿', '👹', '👺', '💀', '👻', '👽', '🤖', '💩'];

const STICKERS = [
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZhcW1icjB4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/3ornk6UHtg3W63vYpG/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZhcW1icjB4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/3o7TKMGV7XWfE8I4pG/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZhcW1icjB4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4ZXI0ZzV1Nzh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/l41lTfuxV5R8XkC7C/giphy.gif'
];

const Moments: React.FC<MomentsProps> = ({ myAvatar, moments, cover, onUpdateMoments, onBack, onPost, onUpdateCover }) => {
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<string | undefined>(undefined);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCoverMenu, setShowCoverMenu] = useState(false);
  const [commentTab, setCommentTab] = useState<'emoji' | 'sticker'>('emoji');
  
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const toggleLike = (id: string) => {
    onUpdateMoments(moments.map(m => {
      if (m.id === id) {
        return { 
          ...m, 
          isLiked: !m.isLiked, 
          likes: m.isLiked ? m.likes - 1 : m.likes + 1 
        };
      }
      return m;
    }));
  };

  const handleSendComment = (id: string, customText?: string) => {
    const textToSend = customText || commentText;
    if (!textToSend.trim()) return;
    
    onUpdateMoments(moments.map(m => {
      if (m.id === id) {
        const newComment: Comment = { author: '我', text: textToSend, to: replyTo };
        return { 
          ...m, 
          comments: [...m.comments, newComment] 
        };
      }
      return m;
    }));
    setCommentText('');
    setActiveCommentId(null);
    setReplyTo(undefined);
    setShowEmojiPicker(false);
  };

  const startReply = (momentId: string, author: string) => {
    if (author === '我') return;
    setActiveCommentId(momentId);
    setReplyTo(author);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateCover(reader.result as string);
        setShowCoverMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="absolute inset-0 z-[100] bg-white flex flex-col overflow-y-auto no-scrollbar pb-20">
      {/* 隐藏的输入框 */}
      <input type="file" accept="image/*" className="hidden" ref={galleryInputRef} onChange={handleFileChange} />
      <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={handleFileChange} />

      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-transparent text-white drop-shadow-md pt-[env(safe-area-inset-top)]">
        <ArrowLeft size={24} onClick={onBack} className="cursor-pointer active:opacity-50" />
        <Camera size={24} onClick={onPost} className="cursor-pointer active:opacity-50" />
      </div>

      <div className="relative h-72 -mt-[calc(60px+env(safe-area-inset-top))] cursor-pointer active:opacity-95 transition-opacity" onClick={() => setShowCoverMenu(true)}>
        <img src={cover} className="w-full h-full object-cover" alt="封面" />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
           <ImageIcon size={32} className="text-white/50" />
        </div>
        <div className="absolute -bottom-5 right-5 flex items-end gap-4 pointer-events-none">
          <span className="text-white font-bold text-lg mb-8 drop-shadow-md">微信用户</span>
          <img src={myAvatar} className="w-20 h-20 rounded-xl border-2 border-white object-cover shadow-xl bg-white" alt="我的头像" />
        </div>
      </div>

      <div className="mt-14 p-4 space-y-12">
        {moments.map(moment => (
          <div key={moment.id} className="flex gap-4 border-b border-gray-50 pb-8 last:border-0">
            <img src={moment.avatar} className="w-12 h-12 rounded-lg object-cover bg-gray-50 shadow-sm" />
            <div className="flex-1">
              <h4 className="text-[#576B95] font-bold text-[15px] mb-1">{moment.author}</h4>
              <p className="text-gray-900 text-[15px] mb-3 leading-relaxed whitespace-pre-wrap">{moment.content}</p>
              
              {moment.images.length > 0 && (
                <div className={`grid gap-1.5 mb-3 max-w-[280px] ${moment.images.length > 1 ? 'grid-cols-3' : 'grid-cols-1'}`}>
                  {moment.images.map((img, i) => (
                    <img key={i} src={img} className="w-full aspect-square object-cover rounded-sm bg-gray-100" />
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center text-[12px] text-gray-400 mt-4">
                <span>{moment.time}</span>
                <div className="flex gap-4 items-center">
                  <button 
                    onClick={() => toggleLike(moment.id)} 
                    className={`flex items-center gap-1.5 px-2 py-1 rounded active:bg-gray-100 transition-colors ${moment.isLiked ? 'text-red-500 font-bold' : 'text-[#576B95]'}`}
                  >
                    <Heart size={18} fill={moment.isLiked ? 'currentColor' : 'none'} />
                  </button>
                  <button 
                    onClick={() => setActiveCommentId(activeCommentId === moment.id ? null : moment.id)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded active:bg-gray-100 transition-colors text-[#576B95]"
                  >
                    <MessageSquare size={18} />
                  </button>
                </div>
              </div>

              {/* 评论区 */}
              {(moment.likes > 0 || moment.comments.length > 0) && (
                <div className="mt-3 bg-[#F7F7F7] rounded-sm p-3 text-[14px] relative before:content-[''] before:absolute before:-top-2 before:right-6 before:border-8 before:border-transparent before:border-b-[#F7F7F7]">
                  {moment.likes > 0 && (
                    <div className="flex items-start gap-2 text-[#576B95] font-medium mb-1">
                      <Heart size={14} className="mt-1" fill="currentColor" />
                      <span>{moment.isLiked ? '我, ' : ''}爱丽丝 等{moment.likes}人</span>
                    </div>
                  )}
                  {moment.likes > 0 && moment.comments.length > 0 && <div className="h-[1px] bg-gray-200 my-2 opacity-50" />}
                  <div className="space-y-1.5">
                    {moment.comments.map((c, i) => (
                      <div key={i} className="leading-snug cursor-pointer active:bg-gray-200/50 rounded p-0.5" onClick={() => startReply(moment.id, c.author)}>
                        <span className="text-[#576B95] font-bold">{c.author}</span>
                        {c.to && <span className="text-gray-600 mx-1">回复</span>}
                        {c.to && <span className="text-[#576B95] font-bold">{c.to}</span>}
                        <span className="text-gray-800">: </span>
                        {c.text.startsWith('http') ? (
                          <img src={c.text} className="inline-block w-20 h-20 rounded object-cover mt-1" alt="sticker" />
                        ) : (
                          <span className="text-gray-800">{c.text}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 实时评论输入框 */}
              {activeCommentId === moment.id && (
                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input 
                      autoFocus
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendComment(moment.id)}
                      placeholder={replyTo ? `回复 ${replyTo}` : "评论"}
                      className="flex-1 bg-white border border-gray-200 rounded px-3 py-1.5 text-sm outline-none shadow-inner"
                    />
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`text-gray-500 active:text-[#07C160] ${showEmojiPicker ? 'text-[#07C160]' : ''}`}>
                      <Smile size={24} />
                    </button>
                    <button 
                      onClick={() => handleSendComment(moment.id)}
                      className="bg-[#07C160] text-white px-3 py-1 rounded font-bold text-sm"
                    >
                      发表
                    </button>
                  </div>
                  {showEmojiPicker && (
                    <div className="flex flex-col bg-gray-50 border rounded animate-in fade-in zoom-in duration-150 overflow-hidden h-48">
                      <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
                        {commentTab === 'emoji' ? (
                          <div className="grid grid-cols-8 gap-2">
                            {EMOJIS.slice(0, 40).map(e => (
                              <button key={e} onClick={() => setCommentText(prev => prev + e)} className="text-xl active:scale-125 transition-transform">{e}</button>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-4 gap-2">
                            {STICKERS.map((s, i) => (
                              <button 
                                key={i} 
                                onClick={() => handleSendComment(moment.id, s)} 
                                className="w-full aspect-square bg-white rounded flex items-center justify-center p-1 active:scale-95 transition-transform shadow-sm overflow-hidden"
                              >
                                <img src={s} className="w-full h-full object-contain" alt="sticker" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4 p-2 px-4 border-t border-gray-100 bg-white">
                        <button 
                          onClick={() => setCommentTab('emoji')} 
                          className={`text-xs font-bold ${commentTab === 'emoji' ? 'text-[#07C160]' : 'text-gray-400'}`}
                        >
                          表情
                        </button>
                        <button 
                          onClick={() => setCommentTab('sticker')} 
                          className={`text-xs font-bold flex items-center gap-1 ${commentTab === 'sticker' ? 'text-[#07C160]' : 'text-gray-400'}`}
                        >
                          <Ghost size={12} /> 表情包
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 封面操作菜单 */}
      {showCoverMenu && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end bg-black/60 transition-opacity">
          <div className="absolute inset-0" onClick={() => setShowCoverMenu(false)} />
          <div className="bg-[#F7F7F7] rounded-t-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 relative z-10">
            <div className="p-4 bg-white border-b border-gray-100 flex flex-col items-center">
               <span className="text-xs text-gray-400 font-medium mb-1">更換相冊封面</span>
            </div>
            <div className="flex flex-col bg-white">
              <button 
                onClick={() => cameraInputRef.current?.click()}
                className="w-full py-4 text-base font-medium border-b border-gray-100 active:bg-gray-50 flex items-center justify-center gap-3"
              >
                <Camera size={20} className="text-gray-400" />
                拍照
              </button>
              <button 
                onClick={() => galleryInputRef.current?.click()}
                className="w-full py-4 text-base font-medium active:bg-gray-50 flex items-center justify-center gap-3"
              >
                <ImageIcon size={20} className="text-gray-400" />
                从手机相册选择
              </button>
            </div>
            <div className="h-2 bg-[#F7F7F7]" />
            <button 
              onClick={() => setShowCoverMenu(false)}
              className="w-full py-4 text-base font-medium bg-white active:bg-gray-50 text-gray-800"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Moments;
