import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Zap, LayoutDashboard, BarChart3, Map as MapIcon, 
  Fuel, Calendar, Users, Receipt, PieChart, 
  Search, Bell, Settings, Menu, ChevronRight, User
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const active = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label, badge }) => (
    <Link to={to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
      active(to) ? 'bg-[#00d2b4]/10 text-[#00d2b4] font-medium' : 'text-[#7a9bbf] hover:bg-[#00d2b4]/5 hover:text-white'
    }`}>
      <Icon className={`w-4 h-4 ${active(to) ? 'text-[#00d2b4]' : 'group-hover:text-white'}`} />
      <span className="text-[14px]">{label}</span>
      {badge && <span className="ml-auto bg-[#00d2b4] text-[#050c14] text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
      {active(to) && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#00d2b4] rounded-r shadow-[0_0_8px_#00d2b4]" />}
    </Link>
  );

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-[#0a1628] border-r border-[#00d2b4]/10 flex flex-col z-[100]">
      <div className="p-7 border-b border-[#00d2b4]/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00d2b4] to-[#0094ff] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,210,180,0.3)]">
            <Zap className="w-6 h-6 text-[#050c14] fill-current" />
          </div>
          <div>
            <div className="font-syne font-extrabold text-[18px] tracking-tight text-white leading-none">VoltWay</div>
            <div className="text-[9px] text-[#7a9bbf] uppercase tracking-[1.2px] mt-1 font-bold whitespace-nowrap">Charging Management</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto space-y-6">
        <div>
          <div className="text-[10px] font-bold text-[#3a5a7a] uppercase tracking-[1.8px] px-3 mb-2">Overview</div>
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/admin/analytics" icon={BarChart3} label="Analytics" />
        </div>

        <div>
          <div className="text-[10px] font-bold text-[#3a5a7a] uppercase tracking-[1.8px] px-3 mb-2">Charging</div>
          <NavItem to="/admin/map" icon={MapIcon} label="Station Map" />
          <NavItem to="/admin/stations" icon={Fuel} label="Stations" />
          <NavItem to="/admin/booking" icon={Calendar} label="Book Slot" badge="New" />
        </div>

        <div>
          <div className="text-[10px] font-bold text-[#3a5a7a] uppercase tracking-[1.8px] px-3 mb-2">Management</div>
          <NavItem to="/admin/users" icon={Users} label="Users" />
          <NavItem to="/admin/transactions" icon={Receipt} label="Transactions" />
          <NavItem to="/admin/commission" icon={PieChart} label="Commission" badge="0" />
        </div>
      </nav>

      <div className="p-3 border-t border-[#00d2b4]/10">
        <div className="flex items-center gap-3 p-3 bg-[#0f2040] rounded-xl border border-white/5 group hover:border-[#00d2b4]/20 transition-all cursor-pointer">
          <div className="w-9 h-9 bg-gradient-to-br from-[#0094ff] to-[#00d2b4] rounded-lg flex items-center justify-center font-syne font-bold text-white">SA</div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-white truncate">System Admin</div>
            <div className="text-[11px] text-[#00d2b4] uppercase tracking-wide">Administrator</div>
          </div>
          <Menu className="w-4 h-4 text-[#3a5a7a]" />
        </div>
      </div>
    </aside>
  );
};

const Topbar = ({ title }) => (
  <header className="sticky top-0 z-50 h-[64px] bg-[#050c14]/85 backdrop-blur-xl border-b border-[#00d2b4]/10 flex items-center px-8 gap-4">
    <div className="font-syne font-bold text-[20px] flex-1 text-white">{title}</div>
    <div className="flex items-center gap-3 bg-[#0a1628] border border-[#00d2b4]/10 rounded-lg px-3.5 py-2 w-[240px] focus-within:border-[#00d2b4] focus-within:ring-2 focus-within:ring-[#00d2b4]/10 transition-all">
      <Search className="w-4 h-4 text-[#3a5a7a]" />
      <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-[13px] text-white w-full placeholder:text-[#3a5a7a]" />
    </div>
    <button className="w-9 h-9 flex items-center justify-center bg-[#0a1628] border border-[#00d2b4]/10 rounded-lg text-[#7a9bbf] hover:text-white relative transition-all">
      <Bell className="w-4 h-4" />
      <div className="absolute top-2 right-2 w-2 h-2 bg-[#00d2b4]/40 rounded-full border-2 border-[#050c14]" />
    </button>
    <button className="w-9 h-9 flex items-center justify-center bg-[#0a1628] border border-[#00d2b4]/10 rounded-lg text-[#7a9bbf] hover:text-white transition-all">
      <Settings className="w-4 h-4" />
    </button>
  </header>
);

const AdminLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-[#050c14] text-[#e2eaf8]">
      <div className="fixed inset-0 pointer-events-none opacity-60 overflow-hidden">
        <div className="absolute -top-[100px] -right-[100px] w-[600px] h-[400px] bg-[#00d2b4]/5 blur-[80px]" />
        <div className="absolute bottom-0 left-[200px] w-[400px] h-[400px] bg-[#0094ff]/3 blur-[80px]" />
      </div>
      
      <Sidebar />
      <main className="ml-[260px] min-h-screen relative z-10">
        <Topbar title={title} />
        <div className="p-8 animate-fade-up">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
