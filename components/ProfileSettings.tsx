
import React, { useState, useRef } from 'react';
import { ArrowLeft, MoreHorizontal, Camera, ImageIcon, Download, X } from 'lucide-react';

interface ProfileSettingsProps {
  avatar: string;
  onUpdateAvatar: (url: string) => void;
  onBack: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ avatar, onUpdateAvatar, onBack }) => {
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateAvatar(reader.result as string);
        setShowOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerGallery = () => {
    fileInputRef.current?.click();
  };

  const triggerCamera = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className="absolute inset-0 z-[150] bg-black flex flex-col overflow-hidden">
      {/* 隐藏的文件输入框 */}
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      <input 
        type="file" 
        accept="image/*" 
        capture="user" 
        className="hidden" 
        ref={cameraInputRef} 
        onChange={handleFileChange} 
      />

      <header className="p-4 flex items-center justify-between text-white z-10 absolute top-0 w-full bg-gradient-to-b from-black/50 to-transparent">
        <ArrowLeft size={24} onClick={onBack} className="cursor-pointer" />
        <h1 className="text-lg font-medium">个人头像</h1>
        <MoreHorizontal size={24} className="cursor-pointer" onClick={() => setShowOptions(true)} />
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <img 
          src={avatar} 
          alt="个人头像大图" 
          className="w-full aspect-square object-cover shadow-2xl transition-all duration-300" 
        />
      </div>

      {/* 微信风格操作菜单 */}
      {showOptions && (
        <div className="absolute inset-0 z-[200] flex flex-col justify-end bg-black/60 transition-opacity">
          <div 
            className="absolute inset-0" 
            onClick={() => setShowOptions(false)} 
          />
          <div className="bg-[#F7F7F7] rounded-t-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 relative z-10">
            <div className="flex flex-col bg-white">
              <button 
                onClick={triggerCamera}
                className="w-full py-4 text-base font-medium border-b border-gray-100 active:bg-gray-50 flex items-center justify-center gap-3"
              >
                <Camera size={20} className="text-gray-400" />
                拍照
              </button>
              <button 
                onClick={triggerGallery}
                className="w-full py-4 text-base font-medium border-b border-gray-100 active:bg-gray-50 flex items-center justify-center gap-3"
              >
                <ImageIcon size={20} className="text-gray-400" />
                从手机相册选择
              </button>
              <button 
                onClick={() => setShowOptions(false)}
                className="w-full py-4 text-base font-medium active:bg-gray-50 flex items-center justify-center gap-3"
              >
                <Download size={20} className="text-gray-400" />
                保存图片
              </button>
            </div>
            <div className="h-2 bg-[#F7F7F7]" />
            <button 
              onClick={() => setShowOptions(false)}
              className="w-full py-4 text-base font-medium bg-white active:bg-gray-50"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
