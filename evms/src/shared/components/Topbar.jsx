import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Settings } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import SettingsPanel from './SettingsPanel';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { notificationDb } from '../../firestore/notificationDb';

const Topbar = ({ title, onOpenHelp }) => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { t } = useLanguage();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = notificationDb.streamUnreadCount(user.uid, role, (count) => {
      setUnreadCount(count);
    });
    return () => unsubscribe();
  }, [user, role]);

  return (
    <header className="sticky top-0 z-50 h-[80px] bg-[#050c14]/80 backdrop-blur-2xl border-b border-white/5 flex items-center px-12 gap-8 font-inter shadow-sm">
      <div className="font-manrope font-extrabold text-[24px] flex-1 text-white tracking-tighter uppercase leading-none">{t(title?.toLowerCase()) || title}</div>
      <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3 w-[320px] focus-within:border-[#00d2b4]/40 transition-all group shadow-inner">
        <Search className="w-4.5 h-4.5 text-[#4E7A96] group-focus-within:text-[#00d2b4]" />
        <input 
          type="text" 
          placeholder={t('search')}
          className="bg-transparent border-none outline-none text-[13px] text-white w-full placeholder:text-[#4E7A96] placeholder:uppercase placeholder:tracking-widest placeholder:text-[9px] font-bold" 
        />
      </div>
      <div className="flex items-center gap-4 relative">
        <button 
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className={`w-12 h-12 flex items-center justify-center bg-white/[0.03] border rounded-2xl transition-all shadow-sm group ${
            isNotificationsOpen ? 'border-[#00d2b4]/50 text-white bg-[#00d2b4]/5' : 'border-white/5 text-[#4E7A96] hover:text-white hover:border-[#00d2b4]/30'
          }`}
        >
          <Bell className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
          {unreadCount > 0 && (
            <div className="absolute top-2.5 right-2.5 min-w-[18px] h-[18px] px-1 bg-[#00d2b4] rounded-full border-2 border-[#050c14] shadow-[0_0_8px_#00d2b4]/40 flex items-center justify-center text-[9px] font-black text-[#050f1c]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </button>
        
        <NotificationPanel 
          isOpen={isNotificationsOpen} 
          onClose={() => setIsNotificationsOpen(false)} 
        />

        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`w-12 h-12 flex items-center justify-center bg-white/[0.03] border rounded-2xl transition-all shadow-sm group ${
            isSettingsOpen ? 'border-[#00d2b4]/50 text-white bg-[#00d2b4]/5' : 'border-white/5 text-[#4E7A96] hover:text-white hover:border-[#00d2b4]/30'
          }`}
        >
          <Settings className="w-4.5 h-4.5 group-hover:rotate-45 transition-transform" />
        </button>

        <SettingsPanel 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          onOpenHelp={onOpenHelp}
        />
      </div>
    </header>
  );
};

export default Topbar;
