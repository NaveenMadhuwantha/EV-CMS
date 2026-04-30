import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { logoutUser } from '../../firebase/auth';
import { Zap, LayoutDashboard, Map as MapIcon, Calendar, Search, Bell, Settings, Menu, LogOut, User } from 'lucide-react';
import Topbar from '../components/Topbar';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const active = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label, badge }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group relative font-inter mb-1 ${active(to) ? 'bg-[#00d2b4]/10 text-[#00d2b4] font-extrabold shadow-sm shadow-[#00d2b4]/5' : 'text-[#4E7A96] hover:bg-[#00d2b4]/5 hover:text-white'}`}>
      <Icon className={`w-4.5 h-4.5 transition-colors ${active(to) ? 'text-[#00d2b4]' : 'group-hover:text-white'}`} strokeWidth={2.5} />
      <span className={`text-[13px] uppercase tracking-widest ${active(to) ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{label}</span>
      {badge && <span className="ml-auto bg-[#00d2b4] text-[#0F172A] text-[9px] font-black px-2 py-0.5 rounded-lg uppercase shadow-sm">{badge}</span>}
      {active(to) && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00d2b4] rounded-r-full shadow-[0_0_12px_#00d2b4]" />}
    </Link>
  );

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (err) { }
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#1E293B]/50 backdrop-blur-3xl border-r border-white/5 flex flex-col z-[100] font-inter">
      <div className="p-8 border-b border-white/5">
        <Link to="/owner/dashboard" className="flex items-center gap-4 group">
          <div className="w-11 h-11 bg-gradient-to-br from-[#00d2b4] to-[#0094ff] rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-500">
            <Zap className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div>
            <div className="font-manrope font-extrabold text-[20px] tracking-tighter text-white leading-none uppercase">VoltWay</div>
            <div className="text-[10px] text-[#4E7A96] font-bold uppercase tracking-widest leading-tight opacity-70 mt-2">EV Management System</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto space-y-8 custom-scrollbar">
        <div>
          <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-[4px] px-4 mb-5 opacity-40">Operations</div>
          <NavItem to="/owner/dashboard" icon={LayoutDashboard} label="Overview" />
          <NavItem to="/owner/map" icon={MapIcon} label="Station Map" />
          <NavItem to="/owner/booking" icon={Calendar} label="Bookings" badge="Active" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-[4px] px-4 mb-5 opacity-40">System</div>
          <NavItem to="/profile" icon={User} label="Profile" />
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-inter group mt-4">
            <LogOut className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
            <span className="text-[13px] uppercase tracking-widest font-bold">Log out</span>
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-white/5 mt-auto">
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-3xl border border-white/5 group hover:border-[#00d2b4]/20 transition-all cursor-pointer shadow-sm"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-[#0094ff] to-[#00d2b4] rounded-xl flex items-center justify-center font-manrope font-extrabold text-[#0F172A] shadow-lg shadow-[#000]/30 transform group-hover:rotate-12 transition-transform uppercase">
            {profile?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0 font-inter">
            <div className="text-[13px] font-extrabold text-white truncate font-manrope">
              {profile?.fullName || 'User'}
            </div>
            <div className="text-[10px] text-[#4E7A96] font-bold uppercase tracking-widest mt-1 opacity-60">
              User
            </div>
          </div>
          <Menu className="w-4 h-4 text-[#4E7A96] group-hover:text-white transition-colors" />
        </div>
      </div>
    </aside>
  );
};



const OwnerLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#e2eaf8] font-inter selection:bg-[#00d2b4]/30 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-40 overflow-hidden z-0">
        <div className="absolute -top-[100px] -right-[100px] w-[600px] h-[500px] bg-[#00d2b4]/5 blur-[140px]" />
        <div className="absolute bottom-0 left-[300px] w-[500px] h-[500px] bg-[#0094ff]/3 blur-[140px]" />
      </div>

      <Sidebar />
      <main className="ml-[280px] min-h-screen relative z-10 flex flex-col">
        <Topbar title={title} />
        <div className="p-12 animate-fade-up flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default OwnerLayout;
