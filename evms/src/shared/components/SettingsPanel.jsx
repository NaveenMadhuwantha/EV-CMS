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
      className="absolute top-full right-0 mt-4 w-[360px] bg-white border border-[#E2E8F0] rounded-[32px] shadow-2xl z-[100] overflow-hidden animate-fade-up backdrop-blur-3xl font-inter"
    >
      {/* Header */}
      <div className="p-8 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-blue-600 p-0.5 shadow-sm">
            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center font-manrope font-black text-[#0F172A] text-lg overflow-hidden relative">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt="P" className="w-full h-full object-cover" />
              ) : (
                profile?.fullName?.charAt(0) || profile?.businessName?.charAt(0) || 'U'
              )}
            </div>
          </div>
          <div>
            <h3 className="font-manrope font-black text-[#0F172A] text-[17px] leading-none mb-1.5 uppercase tracking-tighter">
               {profile?.fullName || profile?.businessName || t('settings')}
            </h3>
            <p className="text-[#94A3B8] text-[10px] font-black uppercase tracking-[2px]">
               {role || 'Member'} Access
            </p>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar space-y-6">
        {menuItems.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[3px] px-4 mb-3">
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
                  (item.path || item.onClick) ? 'hover:bg-[#F8FAFC] cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8] group-hover:text-[#3B82F6] group-hover:bg-blue-50 transition-all border border-black/5 shadow-sm">
                  <item.icon className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-black text-[#0F172A] group-hover:text-[#3B82F6] transition-colors font-manrope uppercase tracking-tight">
                      {item.label}
                    </span>
                    {item.type === 'toggle' && (
                      <div className={`w-10 h-5 rounded-full relative transition-colors border ${item.active ? 'bg-[#3B82F6] border-[#3B82F6]' : 'bg-[#E2E8F0] border-[#E2E8F0]'}`}>
                        <div className={`absolute top-1 w-2.5 h-2.5 rounded-full bg-white transition-all shadow-sm ${item.active ? 'right-1' : 'left-1'}`} />
                      </div>
                    )}
                  </div>
                  {item.desc && (
                    <p className="text-[11px] text-[#64748B] font-medium mt-0.5 truncate">
                      {item.desc}
                    </p>
                  )}
                </div>
                {item.type === 'dropdown' && (
                  <ChevronRight className={`w-4 h-4 text-[#94A3B8] transition-transform ${isLangDropdownOpen ? 'rotate-90' : ''}`} />
                )}
                {item.path && (
                  <ChevronRight className="w-4 h-4 text-[#E2E8F0] group-hover:text-[#3B82F6] transition-colors" />
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
                    className={`w-full text-left px-6 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${
                      language === key ? 'bg-blue-50 text-[#3B82F6] border border-blue-100 shadow-sm' : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
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
      <div className="p-6 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-5 rounded-3xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition-all group border border-red-100 shadow-sm"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[12px] font-black uppercase tracking-[3px]">{t('signOut')}</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
