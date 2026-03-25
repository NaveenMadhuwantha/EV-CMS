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
    <div className="min-h-screen bg-[#050F1C] text-white flex flex-col font-dm overflow-x-hidden relative selection:bg-[#00D4AA]/30">
      
      {/* Dynamic Background Elements */}
      <div className="fixed top-[-15%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#00D4AA]/5 blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>
      <div className="fixed top-[20%] left-[15%] w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none"></div>

      {/* 1. Refined Header */}
      <header className="w-full px-6 py-8 lg:px-20 lg:py-10 flex items-center justify-between z-50 animate-fade-in">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/login')}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#00D4AA] to-[#4FFFB0] shadow-[0_0_30px_rgba(0,212,170,0.2)] group-hover:scale-110 transition-transform duration-500">
             <Zap className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div className="hidden sm:block">
            <div className="font-syne text-xl font-black text-white leading-tight uppercase tracking-tight">VoltWay</div>
            <div className="text-[9px] text-[#4E7A96] font-black uppercase tracking-[4px] leading-tight opacity-70">Grid Ecosystem</div>
          </div>
        </div>
        
        <nav className="flex items-center gap-6 lg:gap-14 animate-fade-in delay-100">
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[3px] text-[#8AAFC8]">
            <a href="#" className="hover:text-[#00D4AA] transition-colors relative group flex items-center gap-2">
              <Globe className="w-3 h-3 group-hover:rotate-12 transition-transform" />
              Grid Network
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00D4AA] transition-all group-hover:w-full"></span>
            </a>
            <a href="#" className="hover:text-[#00D4AA] transition-colors relative group flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 group-hover:scale-110 transition-transform" />
              Governance
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00D4AA] transition-all group-hover:w-full"></span>
            </a>
          </div>
          <button 
            onClick={() => navigate('/signin')} 
            className="px-8 py-4 glass-panel rounded-full hover:bg-white/10 transition-all border-white/5 text-[11px] font-black uppercase tracking-[3px] text-white shadow-2xl hover:border-white/20 active:scale-95 flex items-center gap-3 group"
          >
            <Lock className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:text-[#00D4AA] transition-all" />
            Secure Entry
          </button>
        </nav>
      </header>

      {/* 2. Focused Hero Section */}
      <main className="flex-grow flex items-center px-6 lg:px-20 py-12 lg:py-16 relative z-10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center w-full">

          {/* Left Side: Refined Typography & Actions */}
          <div className="flex flex-col items-center lg:items-start space-y-12 animate-fade-up">
            <div className="space-y-8 text-center lg:text-left w-full">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass-panel border-[#00D4AA]/20 shadow-xl shadow-[#00D4AA]/5">
                <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse"></span>
                <p className="text-[10px] font-black text-[#00D4AA] uppercase tracking-[5px] flex items-center gap-2">
                   <Activity className="w-3 h-3" />
                   Active Grid: Region A1
                </p>
              </div>
              
              <h1 className="font-syne text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight text-white mb-6 uppercase">
                Powering <br/>
                <span className="bg-gradient-to-r from-[#00D4AA] via-[#4FFFB0] to-blue-500 bg-clip-text text-transparent">Sri Lanka's</span> <br/>
                Future.
              </h1>
              
              <p className="text-xl md:text-2xl text-[#8AAFC8] max-w-[500px] leading-relaxed mx-auto lg:mx-0 font-medium opacity-80 border-l-2 border-white/5 pl-8 italic">
                The definitive ecosystem for electric vehicle management. Scalable, secure, and decentralized charging infrastructure for the island.
              </p>
            </div>

            {/* Symmetrical CTA Modules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg lg:max-w-xl">
              <button 
                onClick={() => handleRegisterClick('EV Owner')}
                className="group relative flex flex-col items-start justify-end p-10 h-56 bg-white/5 border-2 border-white/5 rounded-[48px] hover:border-[#00D4AA]/40 transition-all hover:bg-[#00D4AA]/5 overflow-hidden active:scale-95 shadow-2xl"
              >
                <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[#00D4AA]/20 group-hover:rotate-12 transition-all">
                   <Car className="w-8 h-8 text-[#00D4AA]" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[4px] text-[#4E7A96] mb-2 uppercase group-hover:text-white transition-colors">Consumer Module</div>
                <div className="text-2xl font-black text-white uppercase tracking-tight">Join as Owner</div>
                <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white">
                   <ChevronRight className="w-6 h-6" />
                </div>
              </button>
              
              <button 
                onClick={() => handleRegisterClick('Provider')}
                className="group relative flex flex-col items-start justify-end p-10 h-56 bg-white/5 border-2 border-white/5 rounded-[48px] hover:border-blue-500/40 transition-all hover:bg-blue-500/5 overflow-hidden active:scale-95 shadow-2xl"
              >
                <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 group-hover:rotate-12 transition-all">
                   <Fuel className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[4px] text-[#4E7A96] mb-2 uppercase group-hover:text-white transition-colors">Network Module</div>
                <div className="text-2xl font-black text-white uppercase tracking-tight">Become Provider</div>
                <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white">
                   <ChevronRight className="w-6 h-6" />
                </div>
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start w-full gap-10">
              <div className="flex -space-x-4">
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className="w-12 h-12 rounded-full border-[3px] border-[#050F1C] bg-slate-900 overflow-hidden shadow-2xl">
                     <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                   </div>
                 ))}
                 <div className="w-12 h-12 rounded-full border-[3px] border-[#050F1C] bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-2xl">
                    <User className="w-4 h-4" />
                 </div>
              </div>
              <div>
                 <p className="text-[11px] font-black uppercase tracking-[3px] text-[#4E7A96]">Trusted Nodes</p>
                 <p className="text-lg font-black text-white tracking-tight uppercase">2,400+ Verified</p>
              </div>
            </div>
          </div>

          {/* Right Side: Visual System */}
          <div className="hidden lg:flex flex-col items-center justify-center relative animate-fade-in delay-200">
            <div className="relative w-full aspect-square max-w-[640px]">
               {/* Central Glass Disc */}
               <div className="absolute inset-0 rounded-full border border-white/5 glass-panel bg-white/[0.01] shadow-[0_0_120px_rgba(0,0,0,0.6)] flex items-center justify-center">
                  <div className="w-[88%] h-[88%] rounded-full border-2 border-dashed border-white/5 animate-spin-slow"></div>
               </div>
               
               {/* Core Visual */}
               <div className="absolute inset-[12%] rounded-[64px] overflow-hidden border-2 border-white/5 shadow-2xl group">
                 <img 
                    src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[6000ms]" 
                    alt="EV" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#050F1C] via-[#050F1C]/20 to-transparent"></div>
               </div>

               {/* Floating Data Nodes */}
               <div className="absolute top-[10%] -left-[12%] glass-panel rounded-[32px] p-7 border-[#00D4AA]/20 animate-float shadow-2xl flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#00D4AA]/10 flex items-center justify-center text-2xl text-[#00D4AA]">
                     <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-[#00D4AA] uppercase tracking-[4px] mb-1">Grid Sync</div>
                    <div className="text-2xl font-syne font-black text-white">99.9%</div>
                  </div>
               </div>
               
               <div className="absolute bottom-[20%] -right-[10%] glass-panel rounded-[32px] p-7 border-blue-400/20 animate-float-delayed shadow-2xl flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-2xl text-blue-400">
                     <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-blue-400 uppercase tracking-[4px] mb-1">Live Nodes</div>
                    <div className="text-2xl font-syne font-black text-white">450+</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Refined Footer Stats */}
      <footer className="w-full py-12 px-6 lg:px-20 border-t border-white/5 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 opacity-60 animate-fade-in delay-300">
           <div className="flex gap-12 text-[9px] font-black uppercase tracking-[5px] text-[#4E7A96]">
              <div className="flex items-center gap-3">
                 <Activity className="w-3.5 h-3.5" />
                 Latency: 14ms
              </div>
              <div className="flex items-center gap-3">
                 <ShieldCheck className="w-3.5 h-3.5" />
                 AES-256 SECURE
              </div>
           </div>
           <div className="text-[10px] font-black uppercase tracking-[5px] text-[#4E7A96] text-center md:text-right flex items-center gap-4">
              <Globe className="w-4 h-4" />
              VoltWay Ecosystem · Colombo ·  श्रीलंका
           </div>
      </footer>

    </div>
  );
};

export default Login;