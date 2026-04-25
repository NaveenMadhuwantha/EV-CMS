import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, X, Activity, MessageSquare, Globe, Zap, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';
import { listenNotifications, markAsRead, clearAllNotifications } from '../../firestore/notificationDb';

const ICON_MAP = {
  system: Activity,
  action: Zap,
  warning: MessageSquare,
  info: Clock,
  success: CheckCircle2,
  default: Bell
};

const Topbar = ({ title }) => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  useEffect(() => {
    if (!user || !role) return;
    const unsubscribe = listenNotifications(user.uid, role, (data) => {
      setNotifications(data);
    });
    return () => unsubscribe();
  }, [user, role]);

  const handleGithubIssue = () => {
    window.open('https://github.com/NaveenMadhuwantha/EV-CMS/issues/new', '_blank');
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="sticky top-0 z-50 h-[80px] bg-[#050c14]/80 backdrop-blur-2xl border-b border-white/5 flex items-center px-12 gap-8 font-inter shadow-sm">
      <div className="font-manrope font-extrabold text-[24px] flex-1 text-white tracking-tighter uppercase leading-none">{title}</div>
      
      <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3 w-[320px] focus-within:border-[#00d2b4]/40 transition-all group shadow-inner">
        <Search className="w-4.5 h-4.5 text-[#4E7A96] group-focus-within:text-[#00d2b4]" />
        <input 
          type="text" 
          placeholder="Search System..." 
          className="bg-transparent border-none outline-none text-[13px] text-white w-full placeholder:text-[#4E7A96] placeholder:uppercase placeholder:tracking-widest placeholder:text-[9px] font-bold" 
        />
      </div>

      <div className="flex items-center gap-4 relative">
        <button 
          onClick={handleGithubIssue}
          title="Report System Issue"
          className="w-12 h-12 flex items-center justify-center bg-white/[0.03] border border-white/5 rounded-2xl text-[#4E7A96] hover:text-white hover:border-[#00d2b4]/30 transition-all shadow-sm group"
        >
          <Globe className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
        </button>

        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className={`w-12 h-12 flex items-center justify-center bg-white/[0.03] border border-white/5 rounded-2xl text-[#4E7A96] hover:text-white hover:border-[#00d2b4]/30 relative transition-all shadow-sm group ${showNotifications ? 'bg-white/10 border-[#00d2b4]/40' : ''}`}
        >
          <Bell className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
          {unreadCount > 0 && (
            <div className="absolute top-3 right-3 w-4 h-4 bg-[#00d2b4] text-[#050c14] text-[9px] font-black flex items-center justify-center rounded-full border-2 border-[#050c14] shadow-[0_0_8px_#00d2b4]">
              {unreadCount}
            </div>
          )}
        </button>

        {showNotifications && (
          <div className="absolute top-16 right-0 w-[420px] bg-[#0a2038] border border-white/10 rounded-[32px] shadow-2xl p-6 animate-fade-in z-[100] backdrop-blur-3xl">
            <div className="flex justify-between items-center mb-6 px-2">
              <h4 className="text-[11px] font-black uppercase tracking-[4px] text-white">Recent Activity</h4>
              <button onClick={() => setShowNotifications(false)} className="text-[#4E7A96] hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-3 max-h-[440px] overflow-y-auto custom-scrollbar pr-2 mb-6">
               {notifications.length === 0 ? (
                 <div className="py-20 text-center opacity-30">
                    <Bell className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">No updates yet</p>
                 </div>
               ) : notifications.map((n) => {
                 const Icon = ICON_MAP[n.type] || ICON_MAP.default;
                 return (
                   <div 
                    key={n.id} 
                    onClick={() => { n.status === 'unread' && markAsRead(n.id); if(n.link) navigate(n.link); setShowNotifications(false); }}
                    className={`p-5 border-2 border-dashed transition-all group/n cursor-pointer relative overflow-hidden rounded-[24px] ${n.status === 'unread' ? 'bg-[#00d2b4]/5 border-[#00d2b4]/30' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                   >
                      <div className="flex gap-5 relative z-10">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.status === 'unread' ? 'text-[#00d2b4] bg-[#00d2b4]/10' : 'text-[#4E7A96] bg-white/5'}`}>
                            <Icon className="w-5 h-5" />
                         </div>
                         <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-start mb-1">
                               <div className={`text-[13px] font-extrabold uppercase tracking-tight truncate ${n.status === 'unread' ? 'text-white' : 'text-[#8AAFC8]'}`}>{n.title}</div>
                               <div className="text-[9px] font-bold text-[#4E7A96] whitespace-nowrap ml-2">{formatTime(n.createdAt)}</div>
                            </div>
                            <div className={`text-[11px] font-medium leading-relaxed mb-2 line-clamp-2 ${n.status === 'unread' ? 'text-[#8AAFC8]' : 'text-[#4E7A96] opacity-60'}`}>{n.desc}</div>
                         </div>
                      </div>
                   </div>
                 );
               })}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { navigate('/notifications'); setShowNotifications(false); }}
                className="py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[3px] text-[#4E7A96] hover:text-white hover:bg-white/10 transition-all border border-white/5"
              >
                View History
              </button>
              <button 
                onClick={() => clearAllNotifications(user.uid, role)}
                className="py-4 bg-[#00d2b4]/10 rounded-2xl text-[10px] font-black uppercase tracking-[3px] text-[#00d2b4] hover:bg-[#00d2b4] hover:text-[#050c14] transition-all border border-[#00d2b4]/20"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        <button 
          onClick={() => navigate('/settings')}
          className="w-12 h-12 flex items-center justify-center bg-white/[0.03] border border-white/5 rounded-2xl text-[#4E7A96] hover:text-white hover:border-[#00d2b4]/30 transition-all shadow-sm group"
        >
          <Settings className="w-4.5 h-4.5 group-hover:rotate-45 transition-transform" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
