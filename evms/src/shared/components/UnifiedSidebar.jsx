import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { logoutUser } from '../../firebase/auth';
import {
  Zap, LayoutDashboard, BarChart3, Map as MapIcon,
  Fuel, Calendar, Users, Receipt, PieChart,
  LogOut, User, Menu, ChevronRight, Bell, Settings, Globe
} from 'lucide-react';

const SIDEBAR_CONFIG = {
  admin: {
    brandLabel: 'System Lead',
    dashboardPath: '/admin/dashboard',
    sections: [
      {
        titleKey: 'ops',
        items: [
          { labelKey: 'dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { labelKey: 'analytics', path: '/admin/analytics', icon: BarChart3 }
        ]
      },
      {
        titleKey: 'net',
        items: [
          { labelKey: 'stations', path: '/admin/stations', icon: Fuel },
          { labelKey: 'bookings', path: '/admin/booking', icon: Calendar, badge: 'Live' }
        ]
      },
      {
        titleKey: 'mgmt',
        items: [
          { labelKey: 'users', path: '/admin/users', icon: Users },
          { labelKey: 'providers', path: '/admin/providers', icon: Zap },
          { labelKey: 'transactions', path: '/admin/transactions', icon: Receipt },
          { labelKey: 'revenue', path: '/admin/commission', icon: PieChart, badge: 'Tax' }
        ]
      }
    ]
  },
  provider: {
    brandLabel: 'Provider Hub',
    dashboardPath: '/provider/dashboard',
    sections: [
      {
        titleKey: 'ops',
        items: [
          { labelKey: 'dashboard', path: '/provider/dashboard', icon: LayoutDashboard },
          { labelKey: 'analytics', path: '/provider/analytics', icon: BarChart3 }
        ]
      },
      {
        titleKey: 'net',
        items: [
          { labelKey: 'stations', path: '/provider/stations', icon: Fuel },
          { labelKey: 'bookings', path: '/provider/booking', icon: Calendar, badge: 'Live' }
        ]
      },
      {
        titleKey: 'Finance',
        items: [
          { labelKey: 'transactions', path: '/provider/transactions', icon: Receipt },
          { labelKey: 'earnings', path: '/provider/earnings', icon: PieChart, badge: 'Yield' }
        ]
      }
    ]
  },
  owner: {
    brandLabel: 'User Portal',
    dashboardPath: '/owner/dashboard',
    sections: [
      {
        titleKey: 'ops',
        items: [
          { labelKey: 'dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
          { labelKey: 'stations', path: '/owner/map', icon: MapIcon },
          { labelKey: 'bookings', path: '/owner/booking', icon: Calendar, badge: 'Active' }
        ]
      }
    ]
  }
};

const NavItem = ({ to, icon: Icon, label, badge, active }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group relative font-inter mb-1 ${
    active ? 'bg-[#00d2b4]/10 text-[#00d2b4] font-extrabold shadow-sm shadow-[#00d2b4]/5' : 'text-[#4E7A96] hover:bg-[#00d2b4]/5 hover:text-white'
  }`}>
    <Icon className={`w-4.5 h-4.5 transition-colors ${active ? 'text-[#00d2b4]' : 'group-hover:text-white'}`} strokeWidth={2.5} />
    <span className={`text-[12px] uppercase tracking-widest leading-none ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{label}</span>
    {badge && <span className="ml-auto bg-[#00d2b4] text-[#050c14] text-[9px] font-black px-2 py-0.5 rounded-lg uppercase shadow-sm">{badge}</span>}
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00d2b4] rounded-r-full shadow-[0_0_12px_#00d2b4]" />}
  </Link>
);

const UnifiedSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, profile } = useAuth();
  const { t } = useSettings();
  
  const currentRole = role?.toLowerCase() || 'owner';
  let config = { ... (SIDEBAR_CONFIG[currentRole] || SIDEBAR_CONFIG.owner) };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#0a2038]/50 backdrop-blur-3xl border-r border-white/5 flex flex-col z-[100] font-inter">
      <div className="p-8 border-b border-white/5">
        <Link to={config.dashboardPath} className="flex items-center gap-4 group">
          <div className="w-11 h-11 bg-gradient-to-br from-[#00d2b4] to-[#0094ff] rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-500">
            <Zap className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div>
            <div className="font-manrope font-extrabold text-[20px] tracking-tighter text-white leading-none uppercase">VoltWay</div>
            <div className="text-[10px] text-[#4E7A96] uppercase tracking-[3px] mt-2 font-bold whitespace-nowrap opacity-60">
              {config.brandLabel}
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto space-y-8 custom-scrollbar">
        {config.sections.map((section, idx) => (
          <div key={idx}>
            <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-[4px] px-4 mb-5 opacity-40">{t(section.titleKey || section.title)}</div>
            {section.items.map((item, i) => (
              <NavItem 
                key={i}
                to={item.path}
                icon={item.icon}
                label={t(item.labelKey || item.label)}
                badge={item.badge}
                active={location.pathname === item.path}
              />
            ))}
          </div>
        ))}

        <div>
          <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-[4px] px-4 mb-5 opacity-40">{t('sys')}</div>
          <NavItem 
            to="/profile" 
            icon={User} 
            label={t('profile')} 
            active={location.pathname === '/profile' && !location.hash}
          />
          <NavItem 
            to="/notifications" 
            icon={Bell} 
            label={t('notifications')} 
            badge="New"
            active={location.pathname === '/notifications'}
          />
          <a 
            href="https://github.com/NaveenMadhuwantha/EV-CMS/issues/new" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[#4E7A96] hover:bg-white/5 hover:text-white transition-all font-inter group mb-1"
          >
            <Globe className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
            <span className="text-[12px] uppercase tracking-widest opacity-70 group-hover:opacity-100">{t('reportBug')}</span>
          </a>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-inter group mt-4"
          >
            <LogOut className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
            <span className="text-[12px] uppercase tracking-widest font-bold">{t('logout')}</span>
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-3xl border border-white/5 group hover:border-[#00d2b4]/20 transition-all cursor-pointer shadow-sm relative overflow-hidden">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0094ff] to-[#00d2b4] rounded-xl flex items-center justify-center font-manrope font-extrabold text-[#050c14] shadow-lg shadow-[#000]/30 transform group-hover:rotate-12 transition-transform uppercase shrink-0">
            {profile?.fullName?.charAt(0) || profile?.businessName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0 font-inter">
            <div className="text-[13px] font-extrabold text-white truncate font-manrope">
              {profile?.fullName || profile?.businessName || 'User'}
            </div>
            <div className="text-[9px] text-[#4E7A96] font-bold uppercase tracking-widest mt-1 opacity-60">
              {currentRole}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#4E7A96] group-hover:text-white transition-all transform group-hover:translate-x-1" />
          
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#00d2b4] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>
    </aside>
  );
};

export default UnifiedSidebar;
