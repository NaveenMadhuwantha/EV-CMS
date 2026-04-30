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
    <header 
      className="sticky z-50 h-[80px] bg-[#FFFFFF]/90 backdrop-blur-2xl border-b border-[#E2E8F0] flex items-center px-12 gap-8 font-inter shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
      style={{ top: 'var(--dev-bar-offset, 0px)' }}
    >
      <div className="font-manrope font-extrabold text-[24px] flex-1 text-[#0F172A] tracking-tighter uppercase leading-none">{t(title?.toLowerCase()) || title}</div>
      <div className="flex items-center gap-4 bg-[#FDF8EE] border border-[#E2E8F0] rounded-2xl px-5 py-3 w-[320px] focus-within:border-[#3B82F6] transition-all group shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <Search className="w-4.5 h-4.5 text-[#94A3B8] group-focus-within:text-[#3B82F6]" />
        <input 
          type="text" 
          placeholder={t('search')}
          className="bg-transparent border-none outline-none text-[13px] text-[#475569] w-full placeholder:text-[#94A3B8] placeholder:uppercase placeholder:tracking-widest placeholder:text-[9px] font-bold" 
        />
      </div>
      <div className="flex items-center gap-4 relative">
        <button 
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className={`w-12 h-12 flex items-center justify-center bg-[#FFFFFF] border rounded-2xl transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] group ${
            isNotificationsOpen ? 'border-[#3B82F6] text-[#3B82F6] bg-[#F1F5F9]' : 'border-[#E2E8F0] text-[#94A3B8] hover:text-[#3B82F6] hover:border-[#3B82F6]/30'
          }`}
        >
          <Bell className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
          {unreadCount > 0 && (
            <div className="absolute top-2.5 right-2.5 min-w-[18px] h-[18px] px-1 bg-[#F59E0B] rounded-full border-2 border-[#FFFFFF] shadow-[0_0_8px_#F59E0B]/40 flex items-center justify-center text-[9px] font-black text-white">
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
          className={`w-12 h-12 flex items-center justify-center bg-[#FFFFFF] border rounded-2xl transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] group ${
            isSettingsOpen ? 'border-[#3B82F6] text-[#3B82F6] bg-[#F1F5F9]' : 'border-[#E2E8F0] text-[#94A3B8] hover:text-[#3B82F6] hover:border-[#3B82F6]/30'
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
