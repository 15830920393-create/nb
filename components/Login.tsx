
import React, { useState, useEffect } from 'react';
import { Smartphone, Lock, AlertCircle, X, UserPlus, Key, Globe, Loader2 } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (userId: string) => void;
}

type Language = 'zh' | 'en';
type LoginStep = 'start' | 'login' | 'register';

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<LoginStep>('start');
  const [lang, setLang] = useState<Language>('zh');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = {
    zh: {
      langBtn: '语言',
      login: '登录',
      register: '注册',
      wechat: '微信',
      accountPlaceholder: '微信号 / 手机号',
      pwdPlaceholder: '请输入密码',
      regAccount: '设置微信号',
      regPwd: '设置登录密码',
      regConfirm: '再次确认密码',
      regBtn: '注册并登录',
      errorEmpty: '请输入账号和密码',
      errorExists: '该账号已存在',
      errorMismatch: '两次输入的密码不一致',
      errorNoUser: '账号不存在',
      errorWrongPwd: '密码错误'
    },
    en: {
      langBtn: 'Language',
      login: 'Log In',
      register: 'Sign Up',
      wechat: 'WeChat',
      accountPlaceholder: 'WeChat ID / Mobile No.',
      pwdPlaceholder: 'Enter password',
      regAccount: 'Set WeChat ID',
      regPwd: 'Set Password',
      regConfirm: 'Confirm Password',
      regBtn: 'Sign Up',
      errorEmpty: 'Enter ID and password',
      errorExists: 'ID already exists',
      errorMismatch: 'Passwords do not match',
      errorNoUser: 'Account not found',
      errorWrongPwd: 'Incorrect password'
    }
  }[lang];

  useEffect(() => {
    const rememberedUser = localStorage.getItem('wechat_remembered_user');
    if (rememberedUser) {
      setUserId(rememberedUser);
    }
  }, []);

  const getCredentials = (): Record<string, string> => {
    const data = localStorage.getItem('wechat_credentials');
    return data ? JSON.parse(data) : {};
  };

  const handleLogin = () => {
    setError(null);
    const trimmedId = userId.trim();
    if (!trimmedId || !password) {
      setError(t.errorEmpty);
      return;
    }
    const creds = getCredentials();
    if (!creds[trimmedId]) {
      setError(t.errorNoUser);
      return;
    }
    if (creds[trimmedId] !== password) {
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
    const creds = getCredentials();
    if (creds[trimmedId]) {
      setError(t.errorExists);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      creds[trimmedId] = password;
      localStorage.setItem('wechat_credentials', JSON.stringify(creds));
      localStorage.setItem('wechat_remembered_user', trimmedId);
      onLoginSuccess(trimmedId);
    }, 800);
  };

  if (step === 'start') {
    return (
      <div className="relative h-screen w-full bg-black flex flex-col items-center overflow-hidden">
        <button 
          onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')}
          className="absolute top-10 right-6 z-20 text-white text-[15px] font-medium px-4 py-2 active:opacity-50"
        >
          {t.langBtn}
        </button>

        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="https://pic1.zhimg.com/v2-3b4fc7e3a1193a05a5587f9389aa091a_r.jpg" 
            className="w-full h-full object-cover bg-black"
            alt="WeChat Splash"
          />
        </div>

        <div className="mt-auto w-full px-6 pb-16 flex gap-6 z-10">
          <button 
            onClick={() => setStep('login')}
            className="flex-1 py-3 bg-[#07C160] text-white rounded-md font-medium text-[17px] active:opacity-80 transition-opacity"
          >
            {t.login}
          </button>
          <button 
            onClick={() => setStep('register')}
            className="flex-1 py-3 bg-white text-black rounded-md font-medium text-[17px] active:bg-gray-100 transition-colors"
          >
            {t.register}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white shadow-2xl overflow-hidden relative select-none animate-in fade-in duration-300">
      <header className="px-6 pt-10 flex items-center justify-between">
         <button onClick={() => setStep('start')} className="p-2 -ml-2 active:opacity-50">
           <X size={24} className="text-gray-400" />
         </button>
         <button onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')} className="text-xs text-[#576B95] font-medium flex items-center gap-1">
           <Globe size={12} /> {t.langBtn}
         </button>
      </header>

      <div className="flex-1 flex flex-col items-center pt-10 px-8">
        <div className="w-16 h-16 bg-[#07C160] rounded-xl flex items-center justify-center mb-10 shadow-lg">
           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/WeChat_logo.svg/2000px-WeChat_logo.svg.png" className="w-10 h-10 object-contain brightness-0 invert" alt="微信" />
        </div>

        <div className="w-full space-y-6">
          <h2 className="text-2xl font-bold mb-8">{step === 'login' ? t.login : t.register}</h2>
          
          <div className="space-y-4">
            <div className="border-b border-gray-100 flex items-center py-4 focus-within:border-[#07C160] transition-colors">
              <Smartphone size={18} className="text-gray-400 mr-4 shrink-0" />
              <input 
                type="text" 
                placeholder={t.accountPlaceholder} 
                value={userId} 
                onChange={e => setUserId(e.target.value)} 
                className="flex-1 text-base outline-none bg-transparent" 
              />
            </div>
            
            <div className="border-b border-gray-100 flex items-center py-4 focus-within:border-[#07C160] transition-colors">
              <Key size={18} className="text-gray-400 mr-4 shrink-0" />
              <input 
                type="password" 
                placeholder={t.pwdPlaceholder} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="flex-1 text-base outline-none bg-transparent" 
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
                  className="flex-1 text-base outline-none bg-transparent" 
                />
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm animate-pulse">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button 
            onClick={step === 'login' ? handleLogin : handleRegister}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${isSubmitting ? 'bg-gray-300' : 'bg-[#07C160]'}`}
          >
            {isSubmitting && <Loader2 size={20} className="animate-spin" />}
            {step === 'login' ? t.login : t.regBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
