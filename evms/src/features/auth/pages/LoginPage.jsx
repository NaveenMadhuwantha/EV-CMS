import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, User, Activity, BarChart3, Globe, Fuel, Car, Lock, ShieldCheck, ChevronRight, Menu, MapPin, BookOpen, LogOut } from 'lucide-react';
import DocumentationModal from '../../../shared/components/DocumentationModal';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { useLanguage } from '../../../shared/context/LanguageContext';
import { logoutUser } from '../../../firebase/auth';
import { streamGlobalStats } from '../../../firestore/statsDb';

const Login = () => {
  const navigate = useNavigate();
  const { user, profile, role } = useAuth();
  const { t } = useLanguage();
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, totalStations: 0, uptime: '100%' });

  useEffect(() => {
    const unsub = streamGlobalStats(setStats);
    return () => unsub();
  }, []);

  const handleRegisterClick = (roleLabel) => {
    if (roleLabel === 'EV Owner') {
      localStorage.setItem('user_role', 'owner');
      navigate('/register');
    } else if (roleLabel === 'Provider') {
      localStorage.setItem('user_role', 'provider');
      navigate('/provider/register');
    }
  };

  const handleDashboardRedirect = () => {
    if (role) {
      navigate(`/${role}/dashboard`);
    } else {
      navigate('/signin');
    }
  };

  return (
    <div className="min-h-screen bg-[#050F1C] text-[#EFF6FF] font-inter overflow-x-hidden selection:bg-[#00D4AA]/30">
      <DocumentationModal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} />

      {/* Navigation */}
      <nav 
        className="fixed left-0 right-0 z-50 bg-[#050F1C]/80 backdrop-blur-2xl border-b border-white/5"
        style={{ top: 'var(--dev-bar-offset, 0px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4AA] to-[#4FFFB0] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-5 h-5 text-white fill-white/20" />
            </div>
            <div>
              <span className="font-manrope text-xl font-black tracking-tight text-white uppercase block leading-none">VoltWay</span>
              <span className="text-[8px] text-[#4E7A96] font-bold uppercase tracking-[2px] mt-1 block opacity-70">EV Management System</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-widest text-[#8AAFC8]">
            <button onClick={() => navigate('/signin')} className="hover:text-white transition-colors">{t('login')}</button>
            <button onClick={() => setIsDocModalOpen(true)} className="hover:text-white transition-colors">{t('documentation')}</button>
            <button onClick={handleDashboardRedirect} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white font-black">
              {user ? t('dashboard') : t('signIn')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-48 pb-32 px-6 relative">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#00D4AA]/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 mb-10 group hover:border-[#00D4AA]/40 transition-all">
              <div className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#8AAFC8] group-hover:text-white transition-colors">{t('liveInSL') || 'LIVE IN SRI LANKA'}</span>
            </div>

            <h1 className="font-manrope text-7xl xl:text-8xl font-black text-white leading-[0.95] tracking-tight uppercase mb-10">
              {t('powering') || 'POWERING'} <br /> 
              <span className="text-[#00D4AA]">{t('sriLanka') || "SRI LANKA'S"}</span> <br /> 
              {t('future') || 'FUTURE.'}
            </h1>

            <p className="text-xl text-[#8AAFC8] font-medium leading-relaxed mb-12 max-w-lg opacity-80">
              {t('description') || 'The leading platform for electric vehicle management. Simple and reliable charging for everyone.'}
            </p>

            <div className="flex flex-wrap gap-6 mb-16">
              <button 
                onClick={() => handleRegisterClick('EV Owner')} 
                className="px-16 py-5 bg-gradient-to-r from-[#00D4AA] to-[#00B894] text-[#050F1C] rounded-full font-black uppercase tracking-[2px] hover:scale-105 hover:shadow-[0_0_40px_rgba(0,212,170,0.3)] active:scale-95 transition-all duration-300 text-[12px] flex items-center gap-4 group"
              >
                <Car className="w-6 h-6" strokeWidth={2.5} />
                {t('joinAsOwner') || 'Join as Owner'}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform opacity-50" />
              </button>
              <button 
                onClick={() => handleRegisterClick('Provider')} 
                className="px-16 py-5 bg-white/5 border-2 border-white/10 text-white rounded-full font-black uppercase tracking-[2px] hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all duration-300 text-[12px] flex items-center gap-4 group"
              >
                <Fuel className="w-6 h-6 text-[#00D4AA]" strokeWidth={2.5} />
                {t('becomeProvider') || 'Become Provider'}
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start w-full gap-10">
               <div className="font-manrope">
                  <p className="text-xl font-extrabold text-white uppercase tracking-tight">
                    {(stats?.totalUsers || 0).toLocaleString()} {t('verifiedUsers') || 'VERIFIED USERS'}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#4E7A96] font-inter opacity-60">Active Network Nodes</p>
               </div>
            </div>
          </div>

          <div className="relative animate-fade-in delay-200">
            <div className="aspect-square relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D4AA]/20 to-blue-500/10 rounded-[60px] transform rotate-3 scale-95 blur-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200" 
                alt="EV Charging"
                className="w-full h-full object-cover rounded-[60px] border border-white/10 shadow-2xl relative z-10 brightness-75 hover:brightness-100 transition-all duration-700"
              />
              
              {/* Floating Cards */}
              <div className="absolute top-[15%] -left-[10%] bg-[#0a1628]/95 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl flex items-center gap-4 group hover:border-[#00D4AA]/40 transition-all font-inter z-20">
                <div className="w-12 h-12 rounded-2xl bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA] shadow-inner">
                  <BarChart3 className="w-6 h-6" strokeWidth={2.5} />
                </div>
                 <div>
                   <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-widest mb-1 group-hover:text-[#00D4AA] transition-colors">{t('systemUptime')}</div>
                   <div className="text-2xl font-manrope font-extrabold text-white tracking-tight">{stats?.uptime || '100%'}</div>
                 </div>
              </div>

              <div className="absolute bottom-[20%] -right-[8%] bg-[#0a1628]/95 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl flex items-center gap-4 group hover:border-blue-500/40 transition-all font-inter z-20">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner">
                  <Zap className="w-6 h-6" strokeWidth={2.5} />
                </div>
                 <div>
                   <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-widest mb-1 group-hover:text-blue-400 transition-colors">{t('stationsCount')}</div>
                   <div className="text-2xl font-manrope font-extrabold text-white tracking-tight">{stats?.totalStations || 0}</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;