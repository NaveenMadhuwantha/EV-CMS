import React from 'react';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';
import { 
  Settings, Globe, Bell, Moon, Shield, 
  Languages, Eye, Volume2, Save, RotateCcw 
} from 'lucide-react';
import { useSettings } from '../../../shared/context/SettingsContext';

const SettingsPage = () => {
  const settings = useSettings();
  const { updateSetting, t, setSettings, resetSettings } = settings;

  const SettingToggle = ({ icon: Icon, label, desc, value, onChange }) => (
    <div className="flex items-center justify-between p-8 bg-[#0a1628]/40 border-2 border-dashed border-white/5 rounded-[40px] hover:border-[#00d2b4]/20 transition-all group shadow-sm font-inter">
      <div className="flex gap-8 items-center">
        <div className="w-16 h-16 rounded-[28px] bg-white/5 flex items-center justify-center text-[#4E7A96] group-hover:text-[#00d2b4] transition-colors shadow-inner">
          <Icon className="w-8 h-8" strokeWidth={1.5} />
        </div>
        <div>
          <h4 className="text-xl font-extrabold text-white uppercase tracking-tight mb-2">{label}</h4>
          <p className="text-[#8AAFC8] text-[13px] font-medium opacity-60 uppercase tracking-widest">{desc}</p>
        </div>
      </div>
      <button 
        onClick={onChange}
        className={`w-16 h-9 rounded-full relative transition-all duration-500 ${value ? 'bg-[#00d2b4]' : 'bg-white/10'}`}
      >
        <div className={`absolute top-1 w-7 h-7 rounded-full bg-white shadow-xl transition-all duration-500 ${value ? 'left-8' : 'left-1'}`} />
      </button>
    </div>
  );

  return (
    <DashboardLayout title={t('settings')}>
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-up pb-20">
        
        {/* Header Sector */}
        <div className="flex flex-wrap justify-between items-end gap-6 px-2">
           <div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">{t('preferences')}</h2>
              <p className="text-[#8AAFC8] font-bold opacity-60 uppercase tracking-[4px] text-[10px]">{t('customizeSettings')}</p>
           </div>
           <div className="flex gap-4">
              <button className="px-8 py-4 rounded-2xl bg-[#00d2b4] text-[#050c14] text-[12px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center gap-3 shadow-xl shadow-[#00d2b4]/20">
                <Save className="w-4 h-4" /> {t('saveChanges')}
              </button>
           </div>
        </div>

        {/* Localization Sector */}
        <div className="space-y-6">
           <div className="flex items-center gap-4 px-2 mb-8">
              <Languages className="w-5 h-5 text-[#00d2b4]" />
              <h3 className="text-[11px] font-black uppercase tracking-[5px] text-white">{t('languageSelection')}</h3>
           </div>
           
           <div className="p-10 bg-[#0a2038]/40 border-2 border-dashed border-white/5 rounded-[48px] font-inter">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { id: 'en', l: 'English', desc: 'System Default', flag: '🇺🇸' },
                   { id: 'si', l: 'සිංහල', desc: 'දේශීය භාෂාව', flag: '🇱🇰' },
                   { id: 'ta', l: 'தமிழ்', desc: 'ප්‍රාදේශීය භාෂාව', flag: '🇮🇳' }
                 ].map(lang => (
                   <button 
                    key={lang.id}
                    onClick={() => updateSetting('language', lang.id)}
                    className={`p-8 rounded-[32px] border-2 transition-all text-left relative overflow-hidden group ${settings.language === lang.id ? 'bg-[#00d2b4]/5 border-[#00d2b4]/30' : 'bg-white/5 border-transparent hover:border-white/10'}`}
                   >
                      <div className="text-3xl mb-4">{lang.flag}</div>
                      <div className={`text-lg font-black uppercase tracking-tight mb-1 ${settings.language === lang.id ? 'text-white' : 'text-[#8AAFC8]'}`}>{lang.l}</div>
                      <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-widest opacity-60">{lang.desc}</div>
                      {settings.language === lang.id && (
                        <div className="absolute top-4 right-4 w-2 h-2 bg-[#00d2b4] rounded-full shadow-[0_0_8px_#00d2b4]" />
                      )}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Global Toggles */}
        <div className="space-y-6">
           <div className="flex items-center gap-4 px-2 mb-8">
              <Shield className="w-5 h-5 text-[#00d2b4]" />
              <h3 className="text-[11px] font-black uppercase tracking-[5px] text-white">{t('systemSettings')}</h3>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              <SettingToggle 
                icon={Bell} 
                label={t('notifications')} 
                desc="Receive alerts for system updates" 
                value={settings.notificationsEnabled}
                onChange={() => updateSetting('notificationsEnabled', !settings.notificationsEnabled)}
              />
              <SettingToggle 
                icon={Moon} 
                label={t('darkMode')} 
                desc="Toggle dark and light system themes" 
                value={settings.darkMode}
                onChange={() => updateSetting('darkMode', !settings.darkMode)}
              />
              <SettingToggle 
                icon={Globe} 
                label={t('publicProfile')} 
                desc="Allow others to see your station info" 
                value={settings.publicProfile}
                onChange={() => updateSetting('publicProfile', !settings.publicProfile)}
              />
              <SettingToggle 
                icon={Volume2} 
                label={t('soundEffects')} 
                desc="Enable sounds for system actions" 
                value={settings.soundEffects}
                onChange={() => updateSetting('soundEffects', !settings.soundEffects)}
              />
           </div>
        </div>

        {/* Reset Sector */}
        <div className="pt-10 border-t border-white/5 flex justify-center">
           <button 
             onClick={resetSettings}
             className="flex items-center gap-4 px-10 py-5 rounded-2xl bg-white/5 text-[#4E7A96] hover:text-white transition-all text-[11px] font-black uppercase tracking-[4px] border border-white/5 hover:border-white/10 shadow-sm"
           >
             <RotateCcw className="w-4 h-4" /> {t('resetDefault')}
           </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
