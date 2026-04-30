import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, LogIn, Globe, ShieldCheck } from 'lucide-react';

const GuestLayout = ({ children, title }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDF8EE] text-[#0F172A] font-inter selection:bg-[#3B82F6]/20 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none opacity-60 overflow-hidden z-0">
        <div className="absolute -top-[100px] -right-[100px] w-[800px] h-[700px] bg-blue-500/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[700px] h-[600px] bg-emerald-500/10 blur-[150px] animate-pulse duration-[8s]" />
        <div className="absolute top-[40%] right-[-200px] w-[600px] h-[600px] bg-amber-500/5 blur-[130px] animate-pulse duration-[12s]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-[100] h-[100px] bg-white/80 backdrop-blur-3xl border-b border-[#E2E8F0] flex items-center px-12 gap-10 font-inter shadow-sm">
        <Link to="/" className="flex items-center gap-5 group">
          <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
            <Zap className="w-7 h-7 text-white fill-white/20" />
          </div>
          <div className="hidden sm:block">
            <div className="font-manrope font-black text-[28px] tracking-tighter text-[#0F172A] leading-none uppercase">VoltWay</div>
            <div className="text-[11px] text-[#94A3B8] font-black uppercase tracking-[3px] leading-tight mt-2">EV Management System</div>
          </div>
        </Link>

        <div className="flex-1 flex justify-center">
            <div className="px-8 py-3 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-black text-emerald-600 uppercase tracking-[4px] hidden lg:block shadow-sm">
                 Live Network Monitoring
            </div>
        </div>

        <div className="flex items-center gap-12">
           <div className="hidden md:flex items-center gap-14 text-[16px] font-inter font-bold uppercase tracking-[2px] text-[#0F172A] mr-4">
              <Link to="/" className="hover:text-[#3B82F6] transition-all">Documentation</Link>
           </div>
           <button 
             onClick={() => navigate('/signin')}
             className="px-14 py-5 bg-[#3B82F6] text-white rounded-2xl text-[16px] font-inter font-bold uppercase tracking-[2px] shadow-[0_20px_40px_rgba(59,130,246,0.25)] hover:scale-105 active:scale-95 transition-all flex items-center gap-6"
           >
              JOIN GRID <LogIn className="w-6 h-6" />
           </button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 w-full max-w-[1600px] mx-auto px-10 py-12 lg:py-20">
         <div className="mb-20">
            <h1 className="font-manrope text-6xl font-black text-[#0F172A] uppercase tracking-tighter mb-6">{title}</h1>
            <p className="text-[#64748B] text-xl max-w-3xl leading-relaxed font-medium">Explore our dynamic charging infrastructure across Sri Lanka's leading EV-Network ecosystem.</p>
         </div>
         {children}
      </main>

      {/* Guest Footer */}
      <footer className="relative z-10 w-full p-16 border-t border-[#E2E8F0] bg-white/50 flex flex-col md:flex-row items-center justify-between gap-8 mt-20 backdrop-blur-xl">
         <div className="flex items-center gap-12 text-[10px] font-black text-[#94A3B8] uppercase tracking-[4px]">
            <div className="flex items-center gap-4">
               <Globe className="w-5 h-5 text-emerald-500" /> Live Data Station
            </div>
            <div className="flex items-center gap-4">
               <ShieldCheck className="w-5 h-5 text-blue-500" /> Guest Authorization
            </div>
         </div>
         <div className="text-[10px] text-[#94A3B8] font-black uppercase tracking-[3px]">
            Powered by VoltWay Network Systems © 2026
         </div>
      </footer>
    </div>
  );
};

export default GuestLayout;
