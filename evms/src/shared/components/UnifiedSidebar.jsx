import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { logoutUser } from '../../firebase/auth';
import {
  Zap, LayoutDashboard, BarChart3, Map as MapIcon,
  Fuel, Calendar, Users, Receipt, PieChart,
  LogOut, User, Menu, ChevronRight
} from 'lucide-react';

const SIDEBAR_CONFIG = {
  admin: {
    brandLabel: 'System Lead',
    dashboardPath: '/admin/dashboard',
    sections: [
      {
        title: 'operations',
        items: [
          { label: 'dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'analytics', path: '/admin/analytics', icon: BarChart3 }
        ]
      },
      {
        title: 'network',
        items: [
          { label: 'stationMap', path: '/admin/map', icon: MapIcon },
          { label: 'stations', path: '/admin/stations', icon: Fuel },
          { label: 'bookings', path: '/admin/booking', icon: Calendar, badge: 'Live' }
        ]
      },
      {
        title: 'management',
        items: [
          { label: 'users', path: '/admin/users', icon: Users },
          { label: 'providers', path: '/admin/providers', icon: Users },
          { label: 'ledger', path: '/admin/transactions', icon: Receipt },
          { label: 'revenue', path: '/admin/commission', icon: PieChart }
        ]
      }
    ]
  },
  provider: {
    brandLabel: 'Provider Hub',
    dashboardPath: '/provider/dashboard',
    sections: [
      {
        title: 'operations',
        items: [
          { label: 'dashboard', path: '/provider/dashboard', icon: LayoutDashboard },
          { label: 'analytics', path: '/provider/analytics', icon: BarChart3 }
        ]
      },
      {
        title: 'network',
        items: [
          { label: 'yourStations', path: '/provider/stations', icon: Fuel },
          { label: 'bookings', path: '/provider/booking', icon: Calendar, badge: 'Live' }
        ]
      },
      {
        title: 'finance',
        items: [
          { label: 'ledger', path: '/provider/transactions', icon: Receipt },
          { label: 'earnings', path: '/provider/earnings', icon: PieChart, badge: 'Yield' }
        ]
      }
    ]
  },
  owner: {
    brandLabel: 'User Portal',
    dashboardPath: '/owner/dashboard',
    sections: [
      {
        title: 'operations',
        items: [
          { label: 'dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
          { label: 'stationMap', path: '/owner/map', icon: MapIcon },
          { label: 'myBookings', path: '/owner/booking', icon: Calendar, badge: 'Active' }
        ]
      }
    ]
  }
};

const NavItem = ({ to, icon: Icon, label, badge, active }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group relative font-inter mb-1 ${
    active ? 'bg-[#EFF6FF] text-[#2563EB] font-extrabold' : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
  }`}>
    <Icon className={`w-4.5 h-4.5 transition-colors ${active ? 'text-[#2563EB]' : 'group-hover:text-[#3B82F6]'}`} strokeWidth={2.5} />
    <span className={`text-[12px] uppercase tracking-widest leading-none font-bold ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>{label}</span>
    {badge && <span className={`ml-auto text-white text-[9px] font-black px-2 py-0.5 rounded-lg uppercase shadow-sm ${badge === 'Live' ? 'bg-[#10B981]' : badge === 'Active' ? 'bg-[#10B981]' : badge === 'Yield' ? 'bg-[#7C3AED]' : 'bg-[#3B82F6]'}`}>{badge}</span>}
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#3B82F6] rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
  </Link>
);

const UnifiedSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, profile } = useAuth();
  const { t } = useLanguage();
  
  const currentRole = role?.toLowerCase() || 'owner';
  let config = { ... (SIDEBAR_CONFIG[currentRole] || SIDEBAR_CONFIG.owner) };

  // HYBRID MODE: If user is owner but HAS provider capabilities enabled by admin
  if (currentRole === 'owner' && profile?.isProviderEnabled) {
     config.brandLabel = 'Hybrid Portal';
     const providerSections = SIDEBAR_CONFIG.provider.sections.filter(s => s.title !== 'Operations');
     config.sections = [...config.sections, ...providerSections.map(s => ({ ...s, title: `Host ${s.title}` }))];
  }

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside 
      className="fixed left-0 bottom-0 w-[280px] bg-[#FFFFFF] border-r border-[#E2E8F0] flex flex-col z-[100] font-inter shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
      style={{ top: 'var(--dev-bar-offset, 0px)' }}
    >
      <div className="p-8 border-b border-[#E2E8F0]">
        <Link to={config.dashboardPath} className="flex items-center gap-4 group">
          <div className="w-11 h-11 bg-[#3B82F6] rounded-2xl flex items-center justify-center shadow-md shadow-[#3B82F6]/20 group-hover:scale-105 transition-transform duration-500">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-manrope font-extrabold text-[20px] tracking-tighter text-[#0F172A] leading-none uppercase">VoltWay</div>
            <div className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest leading-tight mt-2">EV Management System</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto space-y-8 custom-scrollbar">
        {config.sections.map((section, idx) => (
          <div key={idx}>
            <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[4px] px-4 mb-5">{t(section.title)}</div>
            {section.items.map((item, i) => (
              <NavItem 
                key={i}
                to={item.path}
                icon={item.icon}
                label={t(item.label)}
                badge={item.badge}
                active={location.pathname === item.path}
              />
            ))}
          </div>
        ))}

        <div>
          <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[4px] px-4 mb-5">{t('system')}</div>
          <NavItem 
            to="/profile" 
            icon={User} 
            label={t('profile')} 
            active={location.pathname === '/profile'}
          />
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[#EF4444] hover:bg-[#FEF2F2] transition-all font-inter group mt-4 font-bold"
          >
            <LogOut className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
            <span className="text-[12px] uppercase tracking-widest">{t('logout')}</span>
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-[#E2E8F0] mt-auto">
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] group hover:border-[#3B82F6]/30 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl flex items-center justify-center font-manrope font-extrabold text-white shadow-md shadow-[#3B82F6]/20 transform group-hover:scale-105 transition-transform uppercase shrink-0 overflow-hidden">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="P" className="w-full h-full object-cover" />
            ) : (
              profile?.fullName?.charAt(0) || profile?.businessName?.charAt(0) || 'U'
            )}
          </div>
          <div className="flex-1 min-w-0 font-inter">
            <div className="text-[13px] font-extrabold text-[#0F172A] truncate font-manrope">
              {profile?.fullName || profile?.businessName || 'User'}
            </div>
            <div className="text-[9px] text-[#64748B] font-bold uppercase tracking-widest mt-1">
              {role || t('verifiedUser')}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#3B82F6] transition-all transform group-hover:translate-x-1" />
        </div>
      </div>
    </aside>
  );
};

export default UnifiedSidebar;
