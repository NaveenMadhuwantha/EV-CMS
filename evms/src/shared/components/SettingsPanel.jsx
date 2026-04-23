import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { logoutUser } from '../../firebase/auth';
import { 
  User, Shield, Bell, LogOut, 
  ChevronRight, Settings as SettingsIcon, Globe,
  Headphones, LifeBuoy
} from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  'English (US)',
  'Sinhala (SL)',
  'Tamil (SL)',
  'French (FR)',
  'German (DE)'
];

const SettingsPanel = ({ isOpen, onClose, onOpenHelp }) => {
  const { profile, role } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = React.useState(false);

  const langMap = {
    en: 'English (US)',
    si: 'Sinhala (SL)',
    ta: 'Tamil (SL)'
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    {
      title: t('accountSettings'),
      items: [
        { label: t('myProfile'), icon: User, path: '/profile', desc: 'Personal info and preferences' },
        { label: t('security'), icon: Shield, path: '/profile', desc: 'Password and authentication' },
      ]
    },
    {
      title: t('preferences'),
      items: [
        { 
          label: t('notifications'), 
          icon: Bell, 
          type: 'toggle', 
          active: notificationsEnabled,
          onClick: () => setNotificationsEnabled(!notificationsEnabled)
        },
        { 
          label: t('language'), 
          icon: Globe, 
          desc: langMap[language], 
          type: 'dropdown',
          onClick: () => setIsLangDropdownOpen(!isLangDropdownOpen)
        },
      ]
    },
    {
      title: t('support'),
      items: [
        { label: t('helpCenter'), icon: LifeBuoy, desc: 'FAQs and documentation', onClick: onOpenHelp },
        { label: t('contactSupport'), icon: Headphones, desc: 'Get technical assistance', onClick: () => window.location.href = 'mailto:support@voltway.com' },
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div 
      ref={panelRef}
      className="absolute top-full right-0 mt-4 w-[360px] bg-[#0a1628]/95 border border-white/10 rounded-[32px] shadow-2xl z-[100] overflow-hidden animate-fade-up backdrop-blur-3xl font-inter"
    >
      {/* Header */}
      <div className="p-8 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00d2b4] to-[#0094ff] p-0.5">
            <div className="w-full h-full rounded-[14px] bg-[#0a1628] flex items-center justify-center font-manrope font-black text-white text-lg">
              {profile?.fullName?.charAt(0) || profile?.businessName?.charAt(0) || 'U'}
            </div>
          </div>
          <div>
            <h3 className="font-manrope font-extrabold text-white text-[17px] leading-none mb-1">
              {profile?.fullName || profile?.businessName || t('settings')}
            </h3>
            <p className="text-[#4E7A96] text-[10px] font-black uppercase tracking-[2px] opacity-70">
              {role || 'Member'} Access
            </p>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar space-y-6">
        {menuItems.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="text-[10px] font-black text-[#4E7A96] uppercase tracking-[3px] px-4 mb-3 opacity-40">
              {section.title}
            </h4>
            {section.items.map((item, i) => (
              <div 
                key={i}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                    if (item.type !== 'toggle') onClose();
                  } else if (item.path) {
                    navigate(item.path);
                    onClose();
                  }
                }}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                  (item.path || item.onClick) ? 'hover:bg-white/[0.03] cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-[#4E7A96] group-hover:text-[#00d2b4] group-hover:bg-[#00d2b4]/5 transition-all">
                  <item.icon className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-extrabold text-white group-hover:text-[#00d2b4] transition-colors font-manrope">
                      {item.label}
                    </span>
                    {item.type === 'toggle' && (
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${item.active ? 'bg-[#00d2b4]' : 'bg-white/10'}`}>
                        <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${item.active ? 'right-1' : 'left-1'}`} />
                      </div>
                    )}
                  </div>
                  {item.desc && (
                    <p className="text-[11px] text-[#4E7A96] font-medium mt-0.5 opacity-60 truncate">
                      {item.desc}
                    </p>
                  )}
                </div>
                {item.type === 'dropdown' && (
                  <ChevronRight className={`w-4 h-4 text-[#4E7A96] transition-transform ${isLangDropdownOpen ? 'rotate-90' : ''}`} />
                )}
                {item.path && (
                  <ChevronRight className="w-4 h-4 text-[#1e2e42] group-hover:text-[#00d2b4] transition-colors" />
                )}
              </div>
            ))}
            {section.title === t('preferences') && isLangDropdownOpen && (
              <div className="mt-2 ml-14 space-y-2 animate-fade-in">
                {Object.entries(langMap).map(([key, label]) => (
                  <button 
                    key={key}
                    onClick={() => {
                      setLanguage(key);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all ${
                      language === key ? 'bg-[#00d2b4]/10 text-[#00d2b4]' : 'text-[#4E7A96] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer / Logout */}
      <div className="p-4 bg-white/[0.02] border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 text-red-400 transition-all group border border-red-500/5 hover:border-red-500/20"
        >
          <LogOut className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
          <span className="text-[12px] font-black uppercase tracking-[2px]">{t('signOut')}</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
