import React from 'react';
import { Zap, Activity, Building2, MapPin, GaugeCircle, ClipboardCheck, ArrowUpRight, Lock, ShieldCheck, Globe } from 'lucide-react';

const ProvSidebar = ({ activeStep = 1, title, description }) => {
  const step = activeStep;
  
  const content = {
    title: step === 2 ? <React.Fragment>Corporate<br/><span className="text-emerald-400">Merchant</span><br/>Entity</React.Fragment> 
           : step === 3 ? <React.Fragment>Hardware<br/>Node <span className="text-amber-400">Grid</span><br/>Setup</React.Fragment>
           : step === 4 ? <React.Fragment>Financial<br/><span className="text-purple-400">Earning</span><br/>Logic</React.Fragment>
           : step === 5 ? <React.Fragment>Final<br/><span className="text-blue-400">System</span><br/>Audit</React.Fragment>
           : <React.Fragment>Host Your<br/><span className="text-blue-400">Energy</span><br/>Portal</React.Fragment>,
    desc: step === 2 ? "Define your corporate organizational structure for legal Sri Lankan grid integration."
          : step === 3 ? "Establish your primary charging node with precise hardware specifications and geolocation."
          : step === 4 ? "Configure your hourly rates and secure financial settlement path for payout cycles."
          : step === 5 ? "Verify all node parameters before deploying your entity to the national grid network."
          : "Register your infrastructure on Sri Lanka's leading EV network. Reach thousands of users and optimize your yield.",
    accent: step === 2 ? "#10B981" : step === 3 ? "#F59E0B" : step === 4 ? "#8B5CF6" : "#3B82F6",
    dot: step === 2 ? "Merchant Profile" : step === 3 ? "Station Node" : step === 4 ? "Revenue Logic" : step === 5 ? "Entity Audit" : "Energy Provider",
    icon: step === 2 ? Building2 : step === 3 ? MapPin : step === 4 ? GaugeCircle : step === 5 ? ClipboardCheck : Zap
  };

  const rgb = step === 2 ? "16,185,129" : step === 3 ? "245,158,11" : step === 4 ? "139,92,246" : "59,130,246";

  return (
    <aside className="relative lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-[460px] w-full overflow-hidden bg-[#061221] shrink-0 z-10 lg:z-20 border-r border-white/5 selection:bg-blue-500/20">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=1200"
             className="absolute inset-0 w-full h-full object-cover opacity-10" alt="Provider BG"/>
        <div className="absolute inset-0 bg-gradient-to-br from-[#050F1C] via-[#050F1C]/95 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: `radial-gradient(circle,rgba(${rgb},0.1) 0%,transparent 70%)` }}></div>

      <div className="relative flex flex-col h-full px-10 py-12 lg:px-16 lg:py-20 justify-between items-center lg:items-start text-center lg:text-left min-h-[400px] lg:min-h-screen">
        
        {/* Brand System */}
        <div className="flex items-center gap-4 group cursor-pointer lg:scale-100 scale-90 mb-14 lg:mb-0">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_40px_rgba(59,130,246,0.25)] group-hover:rotate-12 transition-all duration-500 group-hover:scale-105">
            <Zap className="w-7 h-7 text-white fill-white/20" />
          </div>
          <div className="text-left">
            <div className="font-syne text-2xl font-black text-white tracking-tight uppercase">VoltWay</div>
            <div className="text-[10px] text-[#4E7A96] font-black uppercase tracking-[3px] mt-1 opacity-70 flex items-center gap-2">
               <Globe className="w-3 h-3 text-blue-400 group-hover:rotate-45 transition-transform" />
               Enterprise
            </div>
          </div>
        </div>

        {/* Messaging Logic */}
        <div className="w-full max-w-sm lg:max-w-none animate-fade-up">
           <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full mb-10 text-[10px] font-black tracking-[3px] uppercase border shadow-2xl transition-all duration-500 backdrop-blur-md`} 
                style={{ backgroundColor: `${content.accent}10`, border: `1.5px solid ${content.accent}30`, color: content.accent }}>
              <content.icon className="w-4 h-4 animate-pulse" />
              {content.dot}
           </div>
           
           <h1 className="font-syne text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight text-white mb-8 uppercase italic border-l-4 border-white/5 pl-8 transition-all duration-700">
             {title ? title : content.title}
           </h1>
           
           <p className="text-lg leading-relaxed text-[#8AAFC8] mb-12 opacity-80 font-medium">
             {description ? description : content.desc}
           </p>

           {/* Logic Modules (Desktop only) */}
           <div className="hidden lg:grid grid-cols-1 gap-6">
              {step === 4 && (
                <div className="glass-panel rounded-[40px] p-10 border-purple-500/20 animate-fade-in shadow-2xl relative group hover:border-purple-500/40 transition-all">
                   <div className="absolute top-6 right-8 text-purple-400/20 group-hover:text-purple-400 transition-colors">
                      <GaugeCircle className="w-10 h-10" />
                   </div>
                   <div className="text-[9px] font-black uppercase tracking-[5px] mb-8 text-purple-400 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                      Profit Model X1
                   </div>
                   <div className="space-y-4">
                      <div className="flex justify-between text-sm"><span className="text-[#8AAFC8]">Revenue Target</span><span className="text-white font-bold tracking-tight">LKR X / HR</span></div>
                      <div className="flex justify-between text-sm"><span className="text-[#8AAFC8]">Network Levy</span><span className="text-rose-400 font-bold tracking-tight">- 15%</span></div>
                      <div className="h-px bg-white/5 my-4"></div>
                      <div className="flex justify-between text-xl font-black"><span className="text-white">Net Yield</span><span className="text-emerald-400">85% Settlement</span></div>
                   </div>
                </div>
              )}

              {step === 5 && (
                <div className="grid grid-cols-1 gap-3 animate-fade-in">
                   {[
                     { i: Lock, t: 'Access Key SET', c: 'text-blue-400', b: 'bg-blue-400/10' },
                     { i: Building2, t: 'Merchant SET', c: 'text-emerald-400', b: 'bg-emerald-400/10' },
                     { i: MapPin, t: 'Node SET', c: 'text-amber-400', b: 'bg-amber-400/10' }
                   ].map(s => (
                     <div key={s.t} className={`flex items-center gap-5 p-6 rounded-[32px] border border-white/5 ${s.b} group hover:scale-[1.02] transition-all`}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-xl border border-white/10 group-hover:bg-white/20 transition-all">
                           <s.i className={`w-5 h-5 ${s.c}`} />
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-[4px] text-white tracking-widest">{s.t}</div>
                        <div className={`ml-auto text-[9px] font-black uppercase tracking-widest ${s.c} flex items-center gap-2`}>
                           <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]"></div>
                           ✓ Active
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>

        {/* Node Footer */}
        <div className="mt-16 lg:mt-0 pt-10 border-t border-white/5 w-full flex justify-between items-center text-[9px] font-black text-[#4E7A96] uppercase tracking-[5px]">
          <div className="flex items-center gap-3">
             <ShieldCheck className="w-3.5 h-3.5" />
             © 2026 VoltWay Solutions
          </div>
          <div className="flex gap-6">
             <span className="hover:text-blue-400 cursor-pointer transition-colors flex items-center gap-1.5 group">
                Safety Module 
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
             </span>
             <span className="hover:text-blue-400 cursor-pointer transition-colors">Enterprise</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProvSidebar;
