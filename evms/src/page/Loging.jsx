import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, User, Activity, BarChart3, Globe, Fuel, Car, Lock, ShieldCheck, ChevronRight, Menu } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const handleRegisterClick = (role) => {
    if (role === 'EV Owner') {
      navigate('/register');
    } else if (role === 'Provider') {
      navigate('/provider/register');
    }
  };

  return (
    <div className="min-h-screen bg-[#050F1C] text-white flex flex-col font-inter overflow-x-hidden relative selection:bg-[#00D4AA]/30">
      
      {/* Dynamic Background Elements */}
      <div className="fixed top-[-15%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#00D4AA]/5 blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>

      {/* 1. Header */}
      <header className="w-full px-6 py-8 lg:px-20 lg:py-10 flex items-center justify-between z-50 animate-fade-in">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/login')}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative bg-gradient-to-br from-[#00D4AA] to-[#4FFFB0] shadow-xl group-hover:scale-105 transition-transform duration-500">
             <Zap className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div className="hidden sm:block font-manrope">
            <div className="text-2xl font-extrabold text-white leading-tight tracking-tight uppercase">VoltWay</div>
            <div className="text-[10px] text-[#4E7A96] font-bold uppercase tracking-widest leading-tight opacity-70">EV Management System</div>
          </div>
        </div>
        
        <nav className="flex items-center gap-6 lg:gap-14 animate-fade-in delay-100 font-inter">
          <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-widest text-[#4E7A96]">
            <a href="#" className="hover:text-[#00D4AA] transition-colors flex items-center gap-2 group">
              <Globe className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform opacity-60 group-hover:opacity-100" />
              Our Network
            </a>
            <a href="#" className="hover:text-[#00D4AA] transition-colors flex items-center gap-2 group">
              <ShieldCheck className="w-3.5 h-3.5 group-hover:scale-110 transition-transform opacity-60 group-hover:opacity-100" />
              Documentation
            </a>
          </div>
          <button 
            onClick={() => navigate('/signin')} 
            className="px-8 py-3.5 bg-white/5 backdrop-blur-md rounded-2xl hover:bg-white/10 transition-all border border-white/10 text-[12px] font-extrabold uppercase tracking-widest text-white shadow-xl hover:border-white/20 active:scale-95 flex items-center gap-4 group font-manrope"
          >
            <Lock className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:text-[#00D4AA] transition-all" strokeWidth={2.5} />
            Login
          </button>
        </nav>
      </header>

      {/* 2. Focused Hero Section */}
      <main className="flex-grow flex items-center px-6 lg:px-20 py-12 lg:py-16 relative z-10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full">

          {/* Left Side: Typography & Actions */}
          <div className="flex flex-col items-center lg:items-start space-y-12 animate-fade-up">
            <div className="space-y-8 text-center lg:text-left w-full">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#00D4AA]/5 border border-[#00D4AA]/20 shadow-xl shadow-[#00D4AA]/5">
                <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse shadow-[0_0_8px_#00D4AA]"></span>
                <p className="text-[10px] font-bold text-[#00D4AA] uppercase tracking-widest flex items-center gap-2 font-inter">
                   <Activity className="w-3.5 h-3.5" />
                   Live in Sri Lanka
                </p>
              </div>
              
              <h1 className="font-manrope text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight text-white mb-6 uppercase">
                Powering <br/>
                <span className="text-[#00D4AA]">Sri Lanka's</span> <br/>
                Future.
              </h1>
              
              <p className="text-xl md:text-2xl text-[#8AAFC8] max-w-[500px] leading-relaxed mx-auto lg:mx-0 font-medium opacity-80 border-l-4 border-white/10 pl-8 font-inter">
                The leading platform for electric vehicle management. Simple and reliable charging for everyone.
              </p>
            </div>

            {/* CTA Modules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg lg:max-w-xl font-manrope">
              <button 
                onClick={() => handleRegisterClick('EV Owner')}
                className="group relative flex flex-col items-start justify-end p-10 h-64 bg-white/[0.03] border border-white/10 rounded-3xl hover:border-[#00D4AA]/40 transition-all hover:bg-[#00D4AA]/5 overflow-hidden active:scale-95 shadow-xl"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[#00D4AA]/20 transition-all shadow-inner">
                   <Car className="w-8 h-8 text-[#00D4AA]" strokeWidth={2.5} />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#4E7A96] mb-2 group-hover:text-white transition-all font-inter">For Owners</div>
                <div className="text-2xl font-extrabold text-white uppercase tracking-tight">Join as Owner</div>
                <div className="absolute top-8 right-8 w-11 h-11 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white bg-white/5 backdrop-blur-sm">
                   <ChevronRight className="w-6 h-6" />
                </div>
              </button>
              
              <button 
                onClick={() => handleRegisterClick('Provider')}
                className="group relative flex flex-col items-start justify-end p-10 h-64 bg-white/[0.03] border border-white/10 rounded-3xl hover:border-blue-500/40 transition-all hover:bg-blue-500/5 overflow-hidden active:scale-95 shadow-xl"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-all shadow-inner">
                   <Fuel className="w-8 h-8 text-blue-400" strokeWidth={2.5} />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#4E7A96] mb-2 group-hover:text-white transition-all font-inter">For Providers</div>
                <div className="text-2xl font-extrabold text-white uppercase tracking-tight">Become Provider</div>
                <div className="absolute top-8 right-8 w-11 h-11 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white bg-white/5 backdrop-blur-sm">
                   <ChevronRight className="w-6 h-6" />
                </div>
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start w-full gap-10">
              <div className="flex -space-x-3">
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className="w-12 h-12 rounded-full border-[3px] border-[#050F1C] bg-slate-900 overflow-hidden shadow-xl">
                     <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                   </div>
                 ))}
              </div>
              <div className="font-manrope">
                 <p className="text-[11px] font-bold uppercase tracking-widest text-[#4E7A96] font-inter opacity-60">Happy Users</p>
                 <p className="text-xl font-extrabold text-white uppercase tracking-tight">2,400+ Verified Users</p>
              </div>
            </div>
          </div>

          {/* Right Side: Visual System */}
          <div className="hidden lg:flex flex-col items-center justify-center relative animate-fade-in delay-200">
            <div className="relative w-full aspect-square max-w-[550px]">
               {/* Central Glass Disc */}
               <div className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.01] shadow-[0_0_80px_rgba(0,0,0,0.5)] flex items-center justify-center backdrop-blur-[2px]">
                  <div className="w-[92%] h-[92%] rounded-full border border-dashed border-white/10 animate-[spin_30s_linear_infinite]"></div>
               </div>
               
               {/* Core Visual */}
               <div className="absolute inset-[8%] rounded-[48px] overflow-hidden border border-white/20 shadow-2xl group ring-8 ring-white/[0.03]">
                 <img 
                    src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[60s] ease-linear" 
                    alt="EV Charging" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#050F1C] via-[#050F1C]/20 to-transparent"></div>
               </div>

               {/* Floating Data Nodes */}
               <div className="absolute top-[12%] -left-[10%] bg-[#0a1628]/95 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl flex items-center gap-4 group hover:border-[#00D4AA]/40 transition-all font-inter">
                  <div className="w-12 h-12 rounded-2xl bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA] shadow-inner">
                     <BarChart3 className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-widest mb-1 group-hover:text-[#00D4AA] transition-colors">System Uptime</div>
                    <div className="text-2xl font-manrope font-extrabold text-white tracking-tight">99.9%</div>
                  </div>
               </div>
               
               <div className="absolute bottom-[20%] -right-[8%] bg-[#0a1628]/95 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl flex items-center gap-4 group hover:border-blue-500/40 transition-all font-inter">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner">
                     <Zap className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-widest mb-1 group-hover:text-blue-400 transition-colors">Stations</div>
                    <div className="text-2xl font-manrope font-extrabold text-white tracking-tight">450+</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer Stats */}
      <footer className="w-full py-12 px-6 lg:px-20 border-t border-white/10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 animate-fade-in delay-300 font-inter">
           <div className="flex gap-12 text-[10px] font-bold uppercase tracking-widest text-[#4E7A96]">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                 Secure Platform
              </div>
              <div className="flex items-center gap-3">
                 <ShieldCheck className="w-4 h-4 text-blue-400" />
                 Data Protected
              </div>
           </div>
           <div className="text-[11px] font-bold uppercase tracking-widest text-[#4E7A96] text-center md:text-right flex items-center gap-4 opacity-70">
              <Globe className="w-4 h-4" />
              VoltWay EV-CMS · Colombo · Sri Lanka
           </div>
      </footer>

    </div>
  );
};

export default Login;