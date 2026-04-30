import React, { useEffect, useState, useRef } from 'react';
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationDb } from '../../firestore/notificationDb';
import { useAuth } from '../../features/auth/context/AuthContext';

const NotificationPanel = ({ isOpen, onClose }) => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = notificationDb.stream(user.uid, role, (data) => {
      setNotifications(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, role]);

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

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const seconds = Math.floor((new Date() - timestamp.toDate()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-rose-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleMarkAllRead = async () => {
    await notificationDb.markAllAsRead(notifications);
  };

  const handleNotificationClick = async (notif) => {
    // 1. Mark as read
    if (!notif.isRead) {
      await notificationDb.markAsRead(notif.id);
    }
    
    // 2. Close panel
    onClose();

    // 3. Navigate if actionUrl exists
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={panelRef}
      className="absolute top-full right-0 mt-4 w-[400px] bg-white border border-[#E2E8F0] rounded-[32px] shadow-2xl z-[100] overflow-hidden animate-fade-up backdrop-blur-3xl"
    >
      <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#3B82F6] border border-blue-100">
            <Bell className="w-4 h-4" />
          </div>
          <h3 className="font-manrope font-black text-[#0F172A] text-[15px] uppercase tracking-tighter">Notifications</h3>
        </div>
        <button 
          onClick={handleMarkAllRead}
          className="text-[10px] font-black text-[#3B82F6] uppercase tracking-widest hover:brightness-125 transition-all flex items-center gap-2"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Mark all read
        </button>
      </div>

      <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-[#00d2b4]/20 border-t-[#00d2b4] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#4E7A96] text-[12px] font-bold uppercase tracking-widest">Sychronizing...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Bell className="w-6 h-6 text-[#94A3B8] opacity-30" />
            </div>
            <p className="text-[#0F172A] font-black text-[14px] uppercase tracking-tighter">All caught up!</p>
            <p className="text-[#64748B] text-[11px] mt-2 font-medium">No new alerts found.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-6 hover:bg-[#F8FAFC] transition-all cursor-pointer relative group ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
              >
                {!notif.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#3B82F6]" />
                )}
                <div className="flex gap-4">
                  <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    notif.type === 'success' ? 'bg-emerald-500/10' :
                    notif.type === 'warning' ? 'bg-amber-500/10' :
                    notif.type === 'error' ? 'bg-rose-500/10' : 'bg-blue-500/10'
                  }`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className={`text-[14px] font-black truncate pr-4 uppercase tracking-tight ${!notif.isRead ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-[#94A3B8] font-bold whitespace-nowrap pt-0.5">
                        {getTimeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p className={`text-[12px] leading-relaxed line-clamp-2 font-medium ${!notif.isRead ? 'text-[#475569]' : 'text-[#94A3B8]'}`}>
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] text-center">
        <button className="text-[10px] font-black text-[#94A3B8] hover:text-[#3B82F6] transition-colors uppercase tracking-[2px]">
          View all activity →
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
