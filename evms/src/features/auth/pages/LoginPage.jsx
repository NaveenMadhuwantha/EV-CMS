import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, User, Activity, BarChart3, Globe, Fuel, Car, Lock, ShieldCheck, ChevronRight, Menu, MapPin, BookOpen, LogOut, LogIn } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-[#FDF8EE] text-[#0F172A] font-inter overflow-x-hidden selection:bg-[#3B82F6]/20 relative">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-0" style={{ backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      <div className="fixed top-0 left-0 right-0 h-[1000px] bg-gradient-to-b from-[#3B82F6]/10 via-[#3B82F6]/5 to-transparent pointer-events-none z-0"></div>
      
      <DocumentationModal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} />

      {/* Navigation */}
      <nav 
        className="fixed left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-[#E2E8F0] shadow-sm"
        style={{ top: 'var(--dev-bar-offset, 0px)' }}
      >
        <div className="max-w-[1600px] mx-auto px-10 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-[#3B82F6] to-blue-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-6 h-6 text-white fill-white/20" />
            </div>
            <div>
              <span className="font-manrope text-3xl font-black tracking-tighter text-[#0F172A] uppercase block leading-none">VoltWay</span>
              <span className="text-[10px] text-[#94A3B8] font-black uppercase tracking-[3px] mt-2 block">EV Management System</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-14 text-[16px] font-inter font-bold uppercase tracking-[2px] text-[#0F172A]">
            <button onClick={() => navigate('/signin')} className="hover:text-[#3B82F6] transition-all flex items-center gap-3 group/nav">
               <LogIn className="w-5 h-5 opacity-40 group-hover/nav:opacity-100 transition-opacity" />
               {t('login')}
            </button>
            <button onClick={() => setIsDocModalOpen(true)} className="hover:text-[#3B82F6] transition-all flex items-center gap-3 group/nav">
               <BookOpen className="w-5 h-5 opacity-40 group-hover/nav:opacity-100 transition-opacity" />
               {t('documentation')}
            </button>
            <button onClick={handleDashboardRedirect} className="px-14 py-5 bg-[#3B82F6] border-2 border-transparent rounded-2xl hover:bg-blue-700 transition-all text-white font-inter font-bold shadow-[0_15px_40px_rgba(59,130,246,0.35)] text-[16px]">
              {user ? t('dashboard') : t('signIn')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center pt-32 pb-20 px-6 relative z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#3B82F6]/15 blur-[180px] rounded-full pointer-events-none animate-pulse duration-[10s]"></div>
        <div className="absolute top-[20%] right-[-15%] w-[700px] h-[700px] bg-emerald-500/15 blur-[180px] rounded-full pointer-events-none animate-pulse duration-[12s]"></div>
        <div className="absolute bottom-[20%] left-[-5%] w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none animate-pulse duration-[9s]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[800px] h-[800px] bg-amber-500/10 blur-[180px] rounded-full pointer-events-none animate-pulse duration-[15s]"></div>

        <div className="max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="animate-fade-up relative z-10">
            <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full bg-white border border-[#E2E8F0] mb-10 group hover:border-[#3B82F6]/40 transition-all shadow-sm cursor-default">
              <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse"></div>
              <span className="text-[9px] font-black uppercase tracking-[4px] text-[#64748B] group-hover:text-[#0F172A] transition-colors">{t('liveInSL') || 'LIVE IN SRI LANKA'}</span>
            </div>

            <h1 className="font-manrope text-6xl xl:text-8xl font-black text-[#0F172A] leading-[0.9] tracking-tighter uppercase mb-10">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0F172A] to-[#64748B]">{t('powering') || 'POWERING'}</span> <br /> 
              <span className="text-[#3B82F6]">{t('sriLanka') || "SRI LANKA'S"}</span> <br /> 
              {t('future') || 'FUTURE.'}
            </h1>

            <p className="text-xl text-[#64748B] font-medium leading-relaxed mb-12 max-w-xl border-l-4 border-[#3B82F6]/20 pl-8">
              {t('description') || 'The leading platform for electric vehicle management. Simple and reliable charging for everyone.'}
            </p>

            <div className="flex flex-wrap gap-6 mb-16">
              <button 
                onClick={() => handleRegisterClick('EV Owner')} 
                className="px-16 py-5 bg-[#3B82F6] text-white rounded-2xl font-black uppercase tracking-[3px] hover:scale-105 hover:bg-blue-600 hover:shadow-[0_15px_40px_rgba(59,130,246,0.35)] active:scale-95 transition-all duration-500 text-[13px] flex items-center gap-5 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Car className="w-6 h-6" strokeWidth={2.5} />
                {t('joinAsOwner') || 'Join as Owner'}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform opacity-50" />
              </button>
              <button 
                onClick={() => handleRegisterClick('Provider')} 
                className="px-16 py-5 bg-white border-2 border-[#E2E8F0] text-[#0F172A] rounded-2xl font-black uppercase tracking-[3px] hover:bg-emerald-50 hover:border-emerald-500/40 hover:text-emerald-700 active:scale-95 transition-all duration-500 text-[13px] flex items-center gap-5 group shadow-sm"
              >
                <Fuel className="w-6 h-6 text-emerald-500 group-hover:text-emerald-600 transition-colors" strokeWidth={2.5} />
                {t('becomeProvider') || 'Become Provider'}
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start w-full gap-12 mt-6">
               <div className="font-manrope relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-[#3B82F6] rounded-full"></div>
                  <p className="text-3xl font-black text-[#0F172A] uppercase tracking-tighter">
                    {(stats?.totalUsers || 0).toLocaleString()} <span className="text-[#3B82F6]">{t('verifiedUsers') || 'VERIFIED USERS'}</span>
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[4px] text-[#94A3B8] font-inter mt-1">Infrastructure Network Nodes</p>
               </div>
            </div>
          </div>

          <div className="relative animate-fade-in delay-200 z-10">
            <div className="aspect-square relative group/image">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/20 to-emerald-500/10 rounded-[64px] transform rotate-3 scale-95 blur-2xl opacity-50"></div>
              <img 
                src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200" 
                alt="EV Charging"
                className="w-full h-full object-cover rounded-[64px] border-4 border-white shadow-2xl relative z-10 brightness-[1.02] group-hover/image:scale-[1.01] transition-all duration-1000"
              />
              
              {/* Floating Cards */}
              <div className="absolute top-[12%] -left-[10%] bg-white/95 backdrop-blur-3xl rounded-[32px] p-6 border border-[#E2E8F0] shadow-2xl flex items-center gap-4 group/card hover:border-[#3B82F6]/40 transition-all font-inter z-20 duration-500">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#3B82F6] shadow-inner group-hover/card:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6" strokeWidth={2.5} />
                </div>
                 <div>
                   <div className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[3px] mb-1">{t('systemUptime')}</div>
                   <div className="text-2xl font-manrope font-black text-[#0F172A] tracking-tighter">{stats?.uptime || '100%'}</div>
                 </div>
              </div>

              <div className="absolute bottom-[18%] -right-[5%] bg-white/95 backdrop-blur-3xl rounded-[32px] p-6 border border-[#E2E8F0] shadow-2xl flex items-center gap-4 group/card hover:border-emerald-500/40 transition-all font-inter z-20 duration-500">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner group-hover/card:scale-110 transition-transform">
                  <Zap className="w-6 h-6" strokeWidth={2.5} />
                </div>
                 <div>
                   <div className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[3px] mb-1">{t('stationsCount')}</div>
                   <div className="text-2xl font-manrope font-black text-[#0F172A] tracking-tighter">{stats?.totalStations || 0}</div>
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