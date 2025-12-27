
import React, { useState, useEffect } from 'react';
import { Smartphone, Lock, AlertCircle, X, Key, Globe, Loader2 } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (userId: string) => void;
}

type LoginStep = 'start' | 'login' | 'register';

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<LoginStep>('start');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = {
    login: '登录',
    register: '注册',
    wechat: '微信',
    accountPlaceholder: '微信号',
    pwdPlaceholder: '请输入密码',
    regConfirm: '再次确认密码',
    regBtn: '注册并登录',
    errorEmpty: '请输入微信号和密码',
    errorExists: '微信号已被占用',
    errorMismatch: '两次输入的密码不一致',
    errorNoUser: '微信号不存在',
    errorWrongPwd: '密码错误',
    regSuccess: '注册成功'
  };

  useEffect(() => {
    const rememberedUser = localStorage.getItem('wechat_remembered_user');
    if (rememberedUser) setUserId(rememberedUser);
  }, []);

  const getRegistry = (): Record<string, any> => {
    const data = localStorage.getItem('wechat_global_registry');
    return data ? JSON.parse(data) : {};
  };

  const handleLogin = () => {
    setError(null);
    const trimmedId = userId.trim();
    if (!trimmedId || !password) {
      setError(t.errorEmpty);
      return;
    }
    const registry = getRegistry();
    if (!registry[trimmedId]) {
      setError(t.errorNoUser);
      return;
    }
    if (registry[trimmedId].password !== password) {
      setError(t.errorWrongPwd);
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      localStorage.setItem('wechat_remembered_user', trimmedId);
      onLoginSuccess(trimmedId);
    }, 500);
  };

  const handleRegister = () => {
    setError(null);
    const trimmedId = userId.trim();
    if (!trimmedId || !password || !confirmPassword) {
      setError(t.errorEmpty);
      return;
    }
    if (password !== confirmPassword) {
      setError(t.errorMismatch);
      return;
    }
    const registry = getRegistry();
    if (registry[trimmedId]) {
      setError(t.errorExists);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      // 1. 更新全局注册表
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${trimmedId}`;
      registry[trimmedId] = {
        id: trimmedId,
        password: password,
        name: trimmedId,
        avatar: avatar
      };
      localStorage.setItem('wechat_global_registry', JSON.stringify(registry));
      
      // 2. 初始化该用户的独立数据块
      const initialUserData = {
        chats: [
          {
            id: 'wechat_team',
            name: '微信团队',
            avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/WeChat_logo.svg/2000px-WeChat_logo.svg.png',
            lastMessage: '欢迎使用微信',
            time: '刚刚',
            unreadCount: 0,
            messages: [{ id: '1', senderId: 'wechat_team', type: 'text', text: '欢迎加入微信！', timestamp: Date.now(), isMe: false }]
          }
        ],
        moments: [],
        contacts: [],
        bankCards: [],
        balance: 100000, // 注册即送 100,000 元大红包
        myStatus: null,
        myAvatar: avatar,
        momentsCover: 'https://picsum.photos/seed/wechatcover/800/600'
      };
      localStorage.setItem(`wechat_user_data_${trimmedId}`, JSON.stringify(initialUserData));
      
      localStorage.setItem('wechat_remembered_user', trimmedId);
      onLoginSuccess(trimmedId);
    }, 800);
  };

  if (step === 'start') {
    return (
      <div className="relative h-screen w-full bg-black flex flex-col items-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="https://pic1.zhimg.com/v2-3b4fc7e3a1193a05a5587f9389aa091a_r.jpg" 
            className="w-full h-full object-cover bg-black opacity-80"
            alt="微信开屏"
          />
        </div>

        <div className="mt-auto w-full px-6 pb-16 flex gap-4 z-10">
          <button 
            onClick={() => setStep('login')} 
            className="flex-1 py-3 bg-[#07C160] text-white rounded-md font-medium text-[17px] active:opacity-80 transition-all shadow-lg"
          >
            {t.login}
          </button>
          <button 
            onClick={() => setStep('register')} 
            className="flex-1 py-3 bg-white text-[#191919] rounded-md font-medium text-[17px] active:bg-gray-100 transition-all shadow-lg"
          >
            {t.register}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white shadow-2xl overflow-hidden relative select-none animate-in fade-in duration-300">
      <header className="px-6 pt-[calc(10px+env(safe-area-inset-top))] flex items-center justify-between">
         <button onClick={() => setStep('start')} className="p-2 -ml-2 active:opacity-50 transition-opacity">
           <X size={24} className="text-gray-400" />
         </button>
         <div className="text-xs text-[#576B95] font-medium flex items-center gap-1 cursor-pointer">
           <Globe size={12} /> 简体中文
         </div>
      </header>

      <div className="flex-1 flex flex-col items-center pt-8 px-8">
        <div className="w-16 h-16 bg-[#07C160] rounded-xl flex items-center justify-center mb-8 shadow-md">
           <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/WeChat_logo.svg/2000px-WeChat_logo.svg.png" 
            className="w-10 h-10 object-contain brightness-0 invert" 
            alt="微信" 
           />
        </div>

        <div className="w-full space-y-6">
          <h2 className="text-2xl font-bold mb-4">{step === 'login' ? t.login : t.register}</h2>
          
          <div className="space-y-4">
            <div className="border-b border-gray-100 flex items-center py-4 focus-within:border-[#07C160] transition-colors">
              <Smartphone size={18} className="text-gray-400 mr-4 shrink-0" />
              <input 
                type="text" 
                placeholder={t.accountPlaceholder} 
                value={userId} 
                onChange={e => setUserId(e.target.value)} 
                className="flex-1 text-base outline-none bg-transparent caret-[#07C160]" 
              />
            </div>
            <div className="border-b border-gray-100 flex items-center py-4 focus-within:border-[#07C160] transition-colors">
              <Key size={18} className="text-gray-400 mr-4 shrink-0" />
              <input 
                type="password" 
                placeholder={t.pwdPlaceholder} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="flex-1 text-base outline-none bg-transparent caret-[#07C160]" 
              />
            </div>
            {step === 'register' && (
              <div className="border-b border-gray-100 flex items-center py-4 focus-within:border-[#07C160] transition-colors animate-in slide-in-from-top-2">
                <Lock size={18} className="text-gray-400 mr-4 shrink-0" />
                <input 
                  type="password" 
                  placeholder={t.regConfirm} 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  className="flex-1 text-base outline-none bg-transparent caret-[#07C160]" 
                />
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-[#FA5151] text-sm animate-pulse">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button 
            onClick={step === 'login' ? handleLogin : handleRegister}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${isSubmitting ? 'bg-gray-300' : 'bg-[#07C160]'}`}
          >
            {isSubmitting && <Loader2 size={20} className="animate-spin" />}
            {step === 'login' ? t.login : t.regBtn}
          </button>
        </div>
      </div>
      
      <div className="pb-10 px-8 text-center">
        <p className="text-[12px] text-gray-400">注册即表示您同意 <span className="text-[#576B95] font-medium cursor-pointer">《服务协议》</span> 和 <span className="text-[#576B95] font-medium cursor-pointer">《隐私保护指引》</span></p>
      </div>
    </div>
  );
};

export default Login;
