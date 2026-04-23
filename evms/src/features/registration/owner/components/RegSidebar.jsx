import React from 'react';
import { Zap, Activity, ShieldCheck, User, Globe, Lock, BarChart3, ChevronRight } from 'lucide-react';

const RegSidebar = ({
  image = "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200",
  stepTag = "EV Owner Portal",
  tagColor = "text-[#00D4AA]",
  tagBg = "bg-[#00D4AA]/10",
  tagBorder = "border-[#00D4AA]/25",
  title = <><span className="text-white">Power Up Your</span><br /><span className="text-[#00D4AA]">EV Journey</span><br /><span className="text-white">Today</span></>,
  description = "Join Sri Lanka's fastest growing EV charging network. Book slots, find stations, and charge smarter.",
  infoCards = [],
  opacity = "opacity-20",
  children
}) => {
  return (
    <aside className="relative lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-[460px] w-full overflow-hidden bg-[#0a1628] shrink-0 z-10 lg:z-20 border-r border-white/10 selection:bg-[#00D4AA]/30 font-inter">
      {/* Visual Background */}
      <div className="absolute inset-0">
        <img
          src={image}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${opacity}`}
          alt="Station BG"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#050F1C] via-[#050F1C]/90 to-transparent"></div>
      </div>

      {/* Decorative Focus */}
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-[#00D4AA]/5 blur-[120px] pointer-events-none animate-pulse"></div>

      {/* Primary Content Area */}
      <div className="relative flex flex-col h-full px-10 py-12 lg:px-16 lg:py-20 justify-between items-center lg:items-start text-center lg:text-left min-h-[400px] lg:min-h-screen">
        
        {/* Brand Identity */}
        <div className="flex items-center gap-4 group cursor-pointer mb-14 lg:mb-0 transform lg:scale-100 scale-90">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative bg-gradient-to-br from-[#00D4AA] to-[#4FFFB0] shadow-xl group-hover:scale-110 transition-transform duration-500">
            <Zap className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div className="text-left font-manrope">
            <div className="text-2xl font-extrabold text-white tracking-tight leading-none uppercase">VoltWay</div>
            <div className="text-[10px] text-[#4E7A96] font-bold uppercase tracking-widest leading-tight opacity-70 mt-2">EV Management System</div>
          </div>
        </div>

        {/* Messaging Module */}
        <div className="w-full max-w-sm lg:max-w-none animate-fade-up">
           <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full mb-10 text-[10px] font-bold tracking-widest uppercase border border-white/10 ${tagBg} ${tagColor} shadow-xl backdrop-blur-md`}>
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              {stepTag}
           </div>
           
           <h1 className="font-manrope text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white mb-8 uppercase border-l-4 border-white/10 pl-8">
             {title}
           </h1>
           
           <p className="text-lg leading-relaxed text-[#8AAFC8] mb-12 opacity-80 font-medium font-inter">
             {description}
           </p>

           {children}

           {/* Metrics Network */}
           <div className="hidden lg:grid grid-cols-1 gap-5 mt-14 animate-fade-in font-inter">
              {infoCards.length > 0 ? infoCards.map((card, i) => (
                <div key={i} className="bg-white/[0.03] rounded-3xl p-6 border border-white/5 hover:border-white/20 transition-all group flex items-center gap-5 shadow-sm">
                   <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-white/5 group-hover:bg-[#00D4AA]/10 transition-all shadow-inner">
                      {typeof card.icon === 'string' ? card.icon : <card.icon className="w-6 h-6" style={{ color: '#00D4AA' }} />}
                   </div>
                   <div className="text-left w-full">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#4E7A96] mb-1 group-hover:text-white transition-colors uppercase">{card.title}</div>
                      <div className="text-sm font-bold text-white leading-snug font-manrope">{card.desc}</div>
                   </div>
                </div>
              )) : (
                <div className="grid grid-cols-2 gap-4 w-full">
                   {[
                     { l: 'Verified Stations', v: '2,400+', c: '#00D4AA', i: ShieldCheck },
                     { l: 'System Uptime', v: '99.9%', c: '#3B82F6', i: BarChart3 }
                   ].map(s => (
                     <div key={s.l} className="bg-white/[0.03] p-6 rounded-[32px] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden shadow-sm">
                        <s.i className="w-5 h-5 mb-4 group-hover:text-white transition-colors" style={{ color: s.c }} strokeWidth={2.5} />
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#4E7A96] mb-2">{s.l}</div>
                        <div className="text-2xl font-manrope font-extrabold text-white">{s.v}</div>
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>

        {/* Compliance Footer */}
        <div className="mt-16 lg:mt-0 pt-10 border-t border-white/10 w-full flex justify-between items-center text-[10px] font-bold text-[#4E7A96] uppercase tracking-widest font-inter opacity-60">
          <div className="flex items-center gap-3">
             <Lock className="w-3.5 h-3.5" />
             © 2026 VoltWay National Network
          </div>
          <div className="flex gap-6">
             <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
             <span className="hover:text-white cursor-pointer transition-colors">Security</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RegSidebar;
