import React, { useState, useEffect } from 'react';
import { Zap, Activity, ShieldCheck, User, Globe, Lock, BarChart3, ChevronRight } from 'lucide-react';
import { streamGlobalStats } from '../../../../firestore/statsDb';

const RegistrationStats = ({ sBg }) => {
  const [stats, setStats] = useState({ totalStations: 0, uptime: '100%' });
  
  useEffect(() => {
    const unsub = streamGlobalStats(setStats);
    return () => unsub();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <div className={`${sBg} p-6 rounded-[32px] border border-[#E2E8F0] hover:border-[#3B82F6]/30 transition-all group relative overflow-hidden shadow-sm`}>
        <ShieldCheck className="w-5 h-5 mb-4 group-hover:text-[#3B82F6] transition-colors text-[#3B82F6]" strokeWidth={2.5} />
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Verified Nodes</div>
        <div className="text-2xl font-manrope font-extrabold text-[#0F172A]">{stats?.totalStations || 0}</div>
      </div>
      <div className={`${sBg} p-6 rounded-[32px] border border-[#E2E8F0] hover:border-[#3B82F6]/30 transition-all group relative overflow-hidden shadow-sm`}>
        <BarChart3 className="w-5 h-5 mb-4 group-hover:text-[#3B82F6] transition-colors text-blue-500" strokeWidth={2.5} />
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">System Uptime</div>
        <div className="text-2xl font-manrope font-extrabold text-[#0F172A]">{stats?.uptime || '100%'}</div>
      </div>
    </div>
  );
};

const RegSidebar = ({
  image = "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200",
  stepTag = "EV Owner Portal",
  tagColor = "text-[#3B82F6]",
  tagBg = "bg-blue-50",
  tagBorder = "border-blue-500/25",
  title = <><span className="text-[#0F172A]">Power Up Your</span><br /><span className="text-[#3B82F6]">EV Journey</span><br /><span className="text-[#0F172A]">Today</span></>,
  description = "Join Sri Lanka's fastest growing EV charging network. Book slots, find stations, and charge smarter.",
  infoCards = [],
  opacity = "opacity-20",
  children
}) => {
  return (
    <aside className="relative lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-[520px] w-full overflow-hidden bg-white shrink-0 z-10 lg:z-20 border-r border-[#E2E8F0] selection:bg-blue-600/10 font-inter text-[#0F172A]">
      {/* Visual Background */}
      <div className="absolute inset-0">
        <img
          src={image}
             className="absolute inset-0 w-full h-full object-cover opacity-5" alt="Register BG"/>
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-transparent"></div>
      </div>

      {/* Decorative Focus */}
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none animate-pulse"></div>

      {/* Primary Content Area */}
      <div className="relative flex flex-col h-full px-10 py-12 lg:px-16 lg:py-20 justify-between items-center lg:items-start text-center lg:text-left min-h-[400px] lg:min-h-screen">
        
        {/* Brand Identity */}
        <div className="flex items-center gap-4 group cursor-pointer mb-14 lg:mb-0 transform lg:scale-100 scale-90">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative bg-gradient-to-br from-blue-500 to-blue-400 shadow-xl group-hover:scale-110 transition-transform duration-500">
            <Zap className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div className="text-left font-manrope">
            <div className="text-2xl font-extrabold text-[#0F172A] tracking-tight leading-none uppercase">VoltWay</div>
            <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-tight mt-2">EV Management System</div>
          </div>
        </div>

        {/* Messaging Module */}
        <div className="w-full max-w-sm lg:max-w-none animate-fade-up">
           <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full mb-10 text-[10px] font-bold tracking-widest uppercase border border-[#E2E8F0] ${tagBg} ${tagColor} shadow-xl backdrop-blur-md`}>
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              {stepTag}
           </div>
           
           <h1 className="font-manrope text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-[#0F172A] mb-8 uppercase border-l-4 border-[#3B82F6] pl-8">
             {title}
           </h1>
           
           <p className="text-lg leading-relaxed text-slate-700 mb-12 font-medium font-inter">
             {description}
           </p>

           {children}

           {/* Metrics Network */}
           <div className="hidden lg:grid grid-cols-1 gap-5 mt-14 animate-fade-in font-inter">
              {infoCards.length > 0 ? infoCards.map((card, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-[#E2E8F0] hover:border-[#3B82F6]/30 transition-all group flex items-center gap-5 shadow-sm">
                   <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-[#F8FAFC] group-hover:bg-blue-50 transition-all shadow-inner">
                      {/* Fixed icon rendering */}
                      {typeof card.icon === 'string' ? card.icon : <card.icon className="w-6 h-6" style={{ color: '#3B82F6' }} />}
                   </div>
                   <div className="text-left w-full">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1 group-hover:text-[#0F172A] transition-colors uppercase">{card.title}</div>
                      <div className="text-sm font-bold text-[#0F172A] leading-snug font-manrope">{card.desc}</div>
                   </div>
                </div>
              )) : (
                <RegistrationStats sBg="bg-white" />
              )}
           </div>
        </div>

        {/* Compliance Footer */}
        <div className="mt-16 lg:mt-0 pt-10 border-t border-[#E2E8F0] w-full flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase tracking-widest font-inter opacity-60">
          <div className="flex items-center gap-3">
             <Lock className="w-3.5 h-3.5" />
             © 2026 VoltWay National Network
          </div>
          <div className="flex gap-6">
             <span className="hover:text-[#0F172A] cursor-pointer transition-colors">Privacy</span>
             <span className="hover:text-[#0F172A] cursor-pointer transition-colors">Security</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RegSidebar;
