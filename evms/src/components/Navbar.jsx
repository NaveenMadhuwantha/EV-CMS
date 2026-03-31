import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../firebase/auth';
import { Zap, LayoutDashboard, Fuel, Map as MapIcon, BarChart3, User, LogOut, Power } from 'lucide-react';

const Navbar = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const activeLink = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#050F1C]/60 backdrop-blur-3xl border-b border-white/5 lg:px-12 px-6 py-5 selection:bg-blue-500/30 font-inter shadow-sm">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        
        {/* Brand System */}
        <Link to="/dashboard" className="flex items-center gap-4 group">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#00D4AA] to-blue-500 shadow-xl group-hover:scale-110 transition-transform duration-500">
            <Zap className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div className="hidden sm:block font-manrope">
            <div className="text-xl font-extrabold text-white tracking-tight leading-none uppercase">VoltWay</div>
            <div className="text-[10px] text-[#4E7A96] font-bold uppercase tracking-widest mt-1.5 opacity-60">Charging System</div>
          </div>
        </Link>

        {/* Global Navigation Stations */}
        <div className="hidden md:flex items-center gap-12 font-manrope">
          {[
            { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            { label: 'Stations', path: '/stations', icon: Fuel },
            { label: 'Map', path: '/map', icon: MapIcon },
            { label: 'Analytics', path: '/analytics', icon: BarChart3 }
          ].map((link) => (
            <Link 
              key={link.label}
              to={link.path} 
              className={`text-[12px] font-extrabold uppercase tracking-widest transition-all hover:text-white relative group flex items-center gap-2.5
                ${activeLink(link.path) ? 'text-white' : 'text-[#4E7A96]'}
              `}
            >
              <link.icon className={`w-4 h-4 ${activeLink(link.path) ? 'text-[#00D4AA]' : 'text-[#3a5a7a] group-hover:text-white'} transition-all`} strokeWidth={2.5} />
              {link.label}
              <span className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00D4AA] shadow-[0_0_8px_#00D4AA] transition-all duration-300
                ${activeLink(link.path) ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-40 group-hover:scale-100'}
              `}></span>
            </Link>
          ))}
        </div>

        {/* Identity & Session Control */}
        <div className="relative font-inter">
          <div 
            className="flex items-center gap-4 pl-5 pr-2 py-2 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all cursor-pointer group shadow-sm hover:bg-white/[0.05]"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="text-right hidden sm:block font-manrope">
              <div className="text-[13px] font-extrabold text-white tracking-tight leading-none group-hover:text-[#00D4AA] transition-colors uppercase">
                {profile?.fullName || profile?.businessName || user.email.split('@')[0]}
              </div>
              <div className="text-[9px] text-[#4E7A96] font-bold uppercase tracking-widest mt-1.5 opacity-60">
                ROLE: {localStorage.getItem('user_role')?.toUpperCase() || 'USER'}
              </div>
            </div>
            <div className="w-11 h-11 rounded-[1.25rem] bg-slate-900 border border-white/10 flex items-center justify-center text-white font-extrabold overflow-hidden group-hover:border-[#00D4AA]/40 transition-all shadow-inner ring-4 ring-transparent group-hover:ring-[#00D4AA]/5">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <span className="text-lg font-extrabold font-manrope text-white">{(profile?.fullName || user.email)[0].toUpperCase()}</span>
              )}
            </div>
          </div>

          {/* Identity Dropdown */}
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
              <div className="absolute right-0 mt-5 w-64 rounded-3xl bg-[#0a1628]/95 border border-white/10 shadow-2xl p-3 z-50 animate-fade-up backdrop-blur-3xl overflow-hidden font-manrope">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/[0.05] transition-all text-[#8AAFC8] hover:text-white group"
                  onClick={() => setShowDropdown(false)}
                >
                  <User className="w-5 h-5 text-[#4E7A96] group-hover:text-[#00D4AA] transition-colors" strokeWidth={2.5} />
                  <span className="text-[12px] font-extrabold uppercase tracking-widest">My Profile</span>
                </Link>
                <div className="h-px bg-white/5 my-2 mx-3" />
                <button 
                  onClick={() => { setShowDropdown(false); setShowLogoutConfirm(true); }}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-red-500/10 transition-all text-red-400 hover:text-red-300 group text-left"
                >
                  <LogOut className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
                  <span className="text-[12px] font-extrabold uppercase tracking-widest">Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-[#050F1C]/95 backdrop-blur-2xl animate-fade-in font-inter">
          <div className="bg-[#0a1628]/80 border-2 border-dashed border-white/10 rounded-[3rem] p-12 max-w-sm w-full shadow-2xl animate-fade-up">
            <div className="w-20 h-20 rounded-[2.5rem] bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-10 shadow-inner group relative">
               <Power className="w-10 h-10 group-hover:animate-pulse transition-all" strokeWidth={2.5} />
               <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full -z-10 animate-pulse"></div>
            </div>
            <h3 className="font-manrope text-3xl font-extrabold text-white text-center mb-4 tracking-tighter uppercase leading-none">Confirm Logout?</h3>
            <p className="text-center text-[#8AAFC8] font-medium text-[15px] mb-12 leading-relaxed px-2 opacity-80">
              Are you sure you want to end your current session? You will need to log in again to access the dashboard.
            </p>
            <div className="flex flex-col gap-4 font-manrope">
              <button 
                onClick={handleLogout}
                className="w-full py-5 rounded-2xl bg-red-500 text-white font-extrabold text-[12px] uppercase tracking-widest shadow-xl shadow-red-500/10 hover:brightness-110 active:scale-95 transition-all"
              >
                Yes, Logout
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-[#4E7A96] font-extrabold text-[12px] uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
