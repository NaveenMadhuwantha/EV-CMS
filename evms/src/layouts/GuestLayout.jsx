import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, LogIn, Globe, ShieldCheck } from 'lucide-react';

const GuestLayout = ({ children, title }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050c14] text-[#e2eaf8] font-inter selection:bg-[#00d2b4]/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40 overflow-hidden z-0">
        <div className="absolute -top-[100px] -right-[100px] w-[600px] h-[500px] bg-[#00d2b4]/5 blur-[140px]" />
        <div className="absolute bottom-0 left-[300px] w-[500px] h-[500px] bg-blue-500/3 blur-[140px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-[100] h-[90px] bg-[#050c14]/80 backdrop-blur-3xl border-b border-white/5 flex items-center px-12 gap-8 font-inter">
        <Link to="/login" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-gradient-to-br from-[#00d2b4] to-blue-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-500">
            <Zap className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div className="hidden sm:block">
            <div className="font-manrope font-extrabold text-[22px] tracking-tighter text-white leading-none uppercase">VoltWay</div>
            <div className="text-[10px] text-[#4E7A96] uppercase tracking-[4px] mt-2 font-bold opacity-60">Public Network Explorer</div>
          </div>
        </Link>

        <div className="flex-1 flex justify-center">
            <div className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-emerald-400 uppercase tracking-[4px] hidden lg:block">
                 Live Network Monitoring
            </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-[#4E7A96] mr-4">
              <Link to="/login" className="hover:text-white transition-colors">Documentation</Link>
           </div>
           <button 
             onClick={() => navigate('/signin')}
             className="px-8 py-3.5 bg-[#00d2b4] text-[#050c14] rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-[#00d2b4]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
           >
              JOIN GRID <LogIn className="w-4 h-4" />
           </button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 w-full max-w-[1440px] mx-auto p-12 lg:p-16">
         <div className="mb-14">
            <h1 className="font-manrope text-5xl font-extrabold text-white uppercase tracking-tighter mb-4">{title}</h1>
            <p className="text-[#8AAFC8] text-lg max-w-2xl leading-relaxed opacity-60">Explore our dynamic charging infrastructure across Sri Lanka's leading EV-Grid ecosystem.</p>
         </div>
         {children}
      </main>

      {/* Guest Footer */}
      <footer className="relative z-10 w-full p-12 border-t border-white/5 bg-black/20 flex flex-col md:flex-row items-center justify-between gap-8 mt-20">
         <div className="flex items-center gap-10 text-[10px] font-bold text-[#4E7A96] uppercase tracking-[4px]">
            <div className="flex items-center gap-3">
               <Globe className="w-4 h-4 text-emerald-400" /> Live Data Hub
            </div>
            <div className="flex items-center gap-3">
               <ShieldCheck className="w-4 h-4 text-blue-400" /> Guest Authorization
            </div>
         </div>
         <div className="text-[10px] text-[#4E7A96] font-bold uppercase tracking-widest italic opacity-50">
            Powered by VoltWay Grid Systems © 2026
         </div>
      </footer>
    </div>
  );
};

export default GuestLayout;
