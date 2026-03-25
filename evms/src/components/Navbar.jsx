import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import { Zap, LayoutDashboard, Fuel, Network, BarChart3, User, LogOut, Power, AlertTriangle } from 'lucide-react';

const Navbar = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const activeLink = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#050F1C]/40 backdrop-blur-2xl border-b border-white/5 lg:px-12 px-6 py-5 selection:bg-blue-500/20">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        
        {/* Brand System */}
        <Link to="/dashboard" className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#00D4AA] to-blue-500 shadow-2xl group-hover:scale-110 transition-transform duration-500">
            <Zap className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div className="hidden sm:block">
            <div className="font-syne text-xl font-black text-white tracking-tight leading-none">VoltWay</div>
            <div className="text-[9px] text-[#4E7A96] font-black uppercase tracking-[3px] mt-1 opacity-60">National Grid</div>
          </div>
        </Link>

        {/* Global Navigation Nodes */}
        <div className="hidden md:flex items-center gap-10">
          {[
            { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            { label: 'Stations', path: '/stations', icon: Fuel },
            { label: 'Network', path: '/network', icon: Network },
            { label: 'Analytics', path: '/analytics', icon: BarChart3 }
          ].map((link) => (
            <Link 
              key={link.label}
              to={link.path} 
              className={`text-[10px] font-black uppercase tracking-[3px] transition-all hover:text-white relative group flex items-center gap-2
                ${activeLink(link.path) ? 'text-white' : 'text-[#4E7A96]'}
              `}
            >
              <link.icon className={`w-3.5 h-3.5 ${activeLink(link.path) ? 'text-blue-400' : 'text-[#4E7A96] group-hover:text-white'}`} />
              {link.label}
              <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 transition-all duration-300
                ${activeLink(link.path) ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-40 group-hover:scale-100'}
              `}></span>
            </Link>
          ))}
        </div>

        {/* Identity & Session Control */}
        <div className="relative">
          <div 
            className="flex items-center gap-4 pl-4 pr-1.5 py-1.5 rounded-2xl glass-panel border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="text-right hidden sm:block">
              <div className="text-[11px] font-black text-white uppercase tracking-tight leading-none group-hover:text-blue-400 transition-colors">
                {profile?.fullName || profile?.businessName || user.email.split('@')[0]}
              </div>
              <div className="text-[8px] text-[#4E7A96] font-black uppercase tracking-[2px] mt-1">
                Node {localStorage.getItem('user_role')?.toUpperCase() || 'MEMBER'}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-white font-black overflow-hidden group-hover:border-blue-500/50 transition-all">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Node" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm">{(profile?.fullName || user.email)[0].toUpperCase()}</span>
              )}
            </div>
          </div>

          {/* Identity Dropdown Logic */}
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
              <div className="absolute right-0 mt-4 w-64 rounded-[32px] glass-panel bg-[#061221] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-3 z-50 animate-fade-down overflow-hidden">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/5 transition-colors text-[#8AAFC8] hover:text-white group"
                  onClick={() => setShowDropdown(false)}
                >
                  <User className="w-5 h-5 text-[#4E7A96] group-hover:text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-[3px]">System Profile</span>
                </Link>
                <div className="h-px bg-white/5 my-2 mx-3" />
                <button 
                  onClick={() => { setShowDropdown(false); setShowLogoutConfirm(true); }}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-rose-500/10 transition-colors text-rose-400 group"
                >
                  <LogOut className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                  <span className="text-[10px] font-black uppercase tracking-[3px]">Purge Session</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Logic Purge Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#050F1C]/90 backdrop-blur-xl animate-fade-in">
          <div className="glass-panel border-white/5 rounded-[48px] p-10 max-w-sm w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-scale-up border-2 border-dashed border-white/10">
            <div className="w-20 h-20 rounded-[32px] bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-10 shadow-2xl">
               <Power className="w-10 h-10" />
            </div>
            <h3 className="font-syne text-2xl font-black text-white text-center mb-4 uppercase tracking-tighter">Exit Node?</h3>
            <p className="text-center text-[#4E7A96] font-medium text-sm mb-12 leading-relaxed">
              Terminating your connection will disconnect all active grid telemetry modules. Confirm session purge?
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleLogout}
                className="w-full py-5 rounded-2xl bg-rose-500 text-white font-black text-[10px] uppercase tracking-[4px] shadow-2xl hover:bg-rose-600 active:scale-95 transition-all"
              >
                Confirm Purge
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-[#4E7A96] font-black text-[10px] uppercase tracking-[4px] hover:text-white transition-all"
              >
                Abort Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
