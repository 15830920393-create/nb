
import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Loader2 } from 'lucide-react';

const SettingsGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white divide-y divide-gray-100 mb-2">{children}</div>
);

const SettingsItem: React.FC<{ label: string, onClick?: () => void }> = ({ label, onClick }) => (
  <div onClick={onClick} className="flex items-center justify-between p-4 active:bg-gray-100 cursor-pointer">
    <span className="text-sm font-medium">{label}</span>
    <ChevronRight size={18} className="text-gray-300" />
  </div>
);

interface SettingsProps {
  onBack: () => void;
  onLogout: () => void;
  onOpenPrivacy: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack, onLogout, onOpenPrivacy }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setIsProcessing(true);
    // Simulate some cleanup work
    setTimeout(() => {
      onLogout();
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-[100] bg-[#EDEDED] flex flex-col overflow-y-auto no-scrollbar pb-10">
      <header className="bg-[#EDEDED] p-4 flex items-center gap-4 border-b border-gray-200 sticky top-0 z-10 pt-[env(safe-area-inset-top)]">
        <ArrowLeft size={24} onClick={onBack} className="cursor-pointer" />
        <h1 className="text-lg font-semibold">设置</h1>
      </header>

      <div className="mt-2 space-y-0">
        <SettingsGroup>
          <SettingsItem label="账号与安全" />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsItem label="新消息通知" />
          <SettingsItem label="隐私" onClick={onOpenPrivacy} />
          <SettingsItem label="通用" />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsItem label="帮助与反馈" />
          <SettingsItem label="关于微信" />
        </SettingsGroup>

        <div 
          onClick={handleLogoutClick}
          className="bg-white p-4 text-center text-[#111] font-medium active:bg-gray-100 cursor-pointer mb-2"
        >
          切换账号
        </div>
        <div 
          onClick={handleLogoutClick}
          className="bg-white p-4 text-center font-medium active:bg-gray-100 cursor-pointer text-[#111]"
        >
          退出登录
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="absolute inset-0 z-[110] bg-black/50 flex items-center justify-center p-6 transition-opacity">
          <div className="bg-white w-full rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">确认退出登录？</h3>
              <p className="text-sm text-gray-500">退出登录后，你将无法接收新消息通知。你可以随时再次登录。</p>
            </div>
            
            <div className="flex border-t border-gray-100">
              <button 
                disabled={isProcessing}
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-4 text-sm font-medium border-r border-gray-100 active:bg-gray-50 disabled:opacity-50"
              >
                取消
              </button>
              <button 
                onClick={confirmLogout}
                disabled={isProcessing}
                className="flex-1 py-4 text-sm font-bold text-[#E15545] active:bg-gray-50 flex items-center justify-center gap-2"
              >
                {isProcessing && <Loader2 size={16} className="animate-spin" />}
                退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
