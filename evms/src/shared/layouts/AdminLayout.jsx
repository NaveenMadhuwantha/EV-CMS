import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { logoutUser } from '../../firebase/auth';
import {
  Zap, LayoutDashboard, BarChart3, Map as MapIcon,
  Fuel, Calendar, Users, Receipt, PieChart,
  Search, Bell, Settings, Menu, LogOut, User
} from 'lucide-react';
import { useEffect } from 'react';

const Sidebar = () => {


  const location = useLocation();
  const navigate = useNavigate();
  const { role, profile } = useAuth();

  const active = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label, badge }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group relative font-inter mb-1 ${active(to) ? 'bg-[#00d2b4]/10 text-[#00d2b4] font-extrabold shadow-sm shadow-[#00d2b4]/5' : 'text-[#4E7A96] hover:bg-[#00d2b4]/5 hover:text-white'
      }`}>
      <Icon className={`w-4.5 h-4.5 transition-colors ${active(to) ? 'text-[#00d2b4]' : 'group-hover:text-white'}`} strokeWidth={2.5} />
      <span className={`text-[13px] uppercase tracking-widest ${active(to) ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{label}</span>
      {badge && <span className="ml-auto bg-[#00d2b4] text-[#050c14] text-[9px] font-black px-2 py-0.5 rounded-lg uppercase shadow-sm">{badge}</span>}
      {active(to) && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00d2b4] rounded-r-full shadow-[0_0_12px_#00d2b4]" />}
    </Link>
  );

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  // const isAdmin = role === 'admin' || role === 'all';
  // const isProvider = role === 'provider' || role === 'all';
  // const isOwner = role === 'owner' || role === 'all';

  const isAdmin = role === 'admin';
  const isProvider = role === 'provider';
  const isOwner = role === 'owner';

  const dashboardPath = isAdmin ? '/admin/dashboard' : isProvider ? '/provider/dashboard' : '/owner/dashboard';

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#0a2038]/50 backdrop-blur-3xl border-r border-white/5 flex flex-col z-[100] font-inter">
      <div className="p-8 border-b border-white/5">
        <Link to={dashboardPath} className="flex items-center gap-4 group">
          <div className="w-11 h-11 bg-gradient-to-br from-[#00d2b4] to-[#0094ff] rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-500">
            <Zap className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div>
            <div className="font-manrope font-extrabold text-[20px] tracking-tighter text-white leading-none uppercase">VoltWay</div>
            <div className="text-[10px] text-[#4E7A96] uppercase tracking-[3px] mt-2 font-bold whitespace-nowrap opacity-60">
              {isAdmin ? 'System Lead' : isProvider ? 'Station Station' : 'User Portal'}
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto space-y-8 custom-scrollbar">
        <div>
          <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-[4px] px-4 mb-5 opacity-40">Operations</div>
          <NavItem to={dashboardPath} icon={LayoutDashboard} label="Dashboard" />
          {(isAdmin || isProvider) && <NavItem to="/admin/analytics" icon={BarChart3} label="Analytics" />}
        </div>

        <div>
          <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-[4px] px-4 mb-5 opacity-40">Network</div>
          <NavItem to="/admin/map" icon={MapIcon} label="Station Map" />
          {(isAdmin || isProvider) && <NavItem to="/admin/stations" icon={Fuel} label="Your Stations" />}
          <NavItem to="/admin/booking" icon={Calendar} label="Bookings" badge="Live" />
        </div>

        {(isAdmin || isProvider) && (
          <div>
            <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-[4px] px-4 mb-5 opacity-40">Finance</div>
            {isAdmin && <NavItem to="/admin/users" icon={Users} label="User Registry" />}
            {isAdmin && <NavItem to="/admin/providers" icon={Users} label="Providers" />}
            <NavItem to="/admin/transactions" icon={Receipt} label="Ledger" />
            <NavItem to="/admin/commission" icon={PieChart} label="Revenue" badge={isProvider ? "Earn" : "Tax"} />
          </div>
        )}

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
        <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-3xl border border-white/5 group hover:border-[#00d2b4]/20 transition-all cursor-pointer shadow-sm">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0094ff] to-[#00d2b4] rounded-xl flex items-center justify-center font-manrope font-extrabold text-[#050c14] shadow-lg shadow-[#000]/30 transform group-hover:rotate-12 transition-transform uppercase">
            {profile?.fullName?.charAt(0) || profile?.businessName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0 font-inter">
            <div className="text-[13px] font-extrabold text-white truncate font-manrope">
              {profile?.fullName || profile?.businessName || 'User'}
            </div>
            <div className="text-[10px] text-[#4E7A96] font-bold uppercase tracking-widest mt-1 opacity-60">
              {role}
            </div>
          </div>
          <Menu className="w-4 h-4 text-[#4E7A96] group-hover:text-white transition-colors" />
        </div>
      </div>
    </aside>
  );
};

const Topbar = ({ title }) => (
  <header className="sticky top-0 z-50 h-[80px] bg-[#050c14]/80 backdrop-blur-2xl border-b border-white/5 flex items-center px-12 gap-8 font-inter shadow-sm">
    <div className="font-manrope font-extrabold text-[24px] flex-1 text-white tracking-tighter uppercase leading-none">{title}</div>
    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3 w-[320px] focus-within:border-[#00d2b4]/40 transition-all group shadow-inner">
      <Search className="w-4.5 h-4.5 text-[#4E7A96] group-focus-within:text-[#00d2b4]" />
      <input type="text" placeholder="Search Stations..." className="bg-transparent border-none outline-none text-[13px] text-white w-full placeholder:text-[#4E7A96] placeholder:uppercase placeholder:tracking-widest placeholder:text-[9px] font-bold" />
    </div>
    <div className="flex items-center gap-4">
      <button className="w-12 h-12 flex items-center justify-center bg-white/[0.03] border border-white/5 rounded-2xl text-[#4E7A96] hover:text-white hover:border-[#00d2b4]/30 relative transition-all shadow-sm">
        <Bell className="w-4.5 h-4.5" />
        <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#050c14] shadow-[0_0_8px_#10b981]" />
      </button>
      <button className="w-12 h-12 flex items-center justify-center bg-white/[0.03] border border-white/5 rounded-2xl text-[#4E7A96] hover:text-white hover:border-[#00d2b4]/30 transition-all shadow-sm">
        <Settings className="w-4.5 h-4.5" />
      </button>
    </div>
  </header>
);

const AdminLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-[#050c14] text-[#e2eaf8] font-inter selection:bg-[#00d2b4]/30 overflow-x-hidden">
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

export default AdminLayout;
