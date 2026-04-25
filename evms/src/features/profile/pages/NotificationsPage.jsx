import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';
import { Bell, Activity, Zap, MessageSquare, Clock, CheckCircle2, Trash2 } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import { listenNotifications, markAsRead, clearAllNotifications, markAllAsRead } from '../../../firestore/notificationDb';

const ICON_MAP = {
  system: Activity,
  action: Zap,
  warning: MessageSquare,
  info: Clock,
  success: CheckCircle2,
  default: Bell
};

const COLOR_MAP = {
  system: 'text-emerald-400 bg-emerald-500/10',
  action: 'text-blue-400 bg-blue-500/10',
  warning: 'text-amber-500 bg-amber-500/10',
  info: 'text-[#00d2b4] bg-[#00d2b4]/10',
  success: 'text-purple-400 bg-purple-500/10',
  default: 'text-[#4E7A96] bg-white/5'
};

const NotificationsPage = () => {
  const { user, role } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !role) return;

    const unsubscribe = listenNotifications(user.uid, role, (data) => {
      setNotifications(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, role]);

  const handleMarkAllRead = async () => {
    await markAllAsRead(user.uid, role);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <DashboardLayout title="Notifications">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-up font-inter pb-20">
        
        <div className="flex flex-wrap justify-between items-end gap-6 mb-10 px-2">
           <div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Recent Activity</h2>
              <p className="text-[#8AAFC8] font-bold opacity-60 uppercase tracking-[4px] text-[10px]">Updates about your account and stations</p>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={handleMarkAllRead}
                className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#4E7A96] hover:text-[#00d2b4] hover:border-[#00d2b4]/30 hover:bg-[#00d2b4]/5 transition-all flex items-center gap-3"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark All as Read
              </button>
              <button 
                onClick={() => clearAllNotifications(user.uid, role)}
                className="px-6 py-3 rounded-2xl bg-red-500/5 border border-red-500/10 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center gap-3"
              >
                <Trash2 className="w-4 h-4" />
                Clear All History
              </button>
           </div>
        </div>

        <div className="space-y-4">
           {loading ? (
             <div className="py-20 text-center">
                <div className="w-12 h-12 border-4 border-[#00d2b4]/20 border-t-[#00d2b4] rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-[11px] font-black uppercase tracking-widest text-[#4E7A96] animate-pulse">Loading updates...</p>
             </div>
           ) : notifications.length === 0 ? (
             <div className="py-32 text-center bg-[#0a1628]/20 border-2 border-dashed border-white/5 rounded-[40px]">
                <Bell className="w-16 h-16 mx-auto mb-8 text-[#4E7A96] opacity-20" />
                <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2">No Alerts Found</h3>
                <p className="text-[#4E7A96] text-[12px] font-medium uppercase tracking-widest">Your notification feed is currently clear.</p>
             </div>
           ) : notifications.map((n) => {
             const Icon = ICON_MAP[n.type] || ICON_MAP.default;
             const colorClass = COLOR_MAP[n.type] || COLOR_MAP.default;
             
             return (
               <div 
                key={n.id} 
                onClick={() => { n.status === 'unread' && markAsRead(n.id); n.link && navigate(n.link); }}
                className={`p-10 border-2 border-dashed transition-all group cursor-pointer relative overflow-hidden rounded-[40px] ${n.status === 'unread' ? 'bg-[#00d2b4]/5 border-[#00d2b4]/30' : 'bg-[#0a1628]/40 border-white/5 hover:border-white/10'}`}
               >
                  <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-white/[0.01] to-transparent pointer-events-none"></div>
                  
                  <div className="flex gap-10 items-start relative z-10">
                     <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center shrink-0 shadow-2xl transition-transform group-hover:scale-105 duration-500 ${colorClass}`}>
                        <Icon className="w-10 h-10" strokeWidth={1.5} />
                     </div>
                     
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <h4 className={`text-2xl font-black uppercase tracking-tight transition-colors ${n.status === 'unread' ? 'text-white' : 'text-[#8AAFC8]'}`}>{n.title}</h4>
                                 {n.status === 'unread' && <div className="w-2.5 h-2.5 rounded-full bg-[#00d2b4] shadow-[0_0_12px_#00d2b4]" />}
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-[3px] text-[#4E7A96] opacity-60">ID: {n.id.substring(0, 8)}</span>
                           </div>
                           <span className="text-[11px] font-black uppercase tracking-widest text-[#4E7A96] bg-white/5 px-4 py-2 rounded-xl border border-white/5">{formatTime(n.createdAt)}</span>
                        </div>
                        <p className={`text-[16px] leading-relaxed font-medium mb-6 max-w-2xl ${n.status === 'unread' ? 'text-[#e2eaf8]' : 'text-[#8AAFC8] opacity-70'}`}>{n.desc}</p>
                        
                        <div className="flex items-center gap-6">
                           <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-black uppercase tracking-[2px] ${n.status === 'unread' ? 'text-[#00d2b4]' : 'text-[#4E7A96]'}`}>
                                 {n.status === 'unread' ? 'Delivery: Active' : 'Status: Archived'}
                              </span>
                           </div>
                           {n.link && (
                              <button className="text-[10px] font-black uppercase tracking-widest text-white hover:text-[#00d2b4] transition-colors flex items-center gap-2">
                                 View Details <Zap className="w-3 h-3" />
                              </button>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
             );
           })}
        </div>

        {!loading && notifications.length > 0 && (
          <div className="py-20 text-center">
             <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8 text-[#4E7A96] border border-white/5">
                <Bell className="w-10 h-10 opacity-10" />
             </div>
             <p className="text-[11px] font-black uppercase tracking-[5px] text-[#4E7A96] opacity-30">No more notifications</p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
