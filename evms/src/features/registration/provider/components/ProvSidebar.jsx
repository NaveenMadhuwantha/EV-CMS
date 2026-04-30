import React from 'react';
import { Zap, Activity, Building2, MapPin, GaugeCircle, ClipboardCheck, ArrowUpRight, Lock, ShieldCheck, Globe } from 'lucide-react';

const ProvSidebar = ({ activeStep = 1, title, description }) => {
  const step = activeStep;
  
  const content = {
    title: step === 2 ? <React.Fragment>Corporate<br/><span className="text-emerald-600">Merchant</span><br/>Entity</React.Fragment> 
           : step === 3 ? <React.Fragment>Hardware<br/>Station <span className="text-amber-600">Network</span><br/>Setup</React.Fragment>
           : step === 4 ? <React.Fragment>Financial<br/><span className="text-purple-600">Earning</span><br/>Logic</React.Fragment>
           : step === 5 ? <React.Fragment>Final<br/><span className="text-blue-600">System</span><br/>Audit</React.Fragment>
           : <React.Fragment>Host Your<br/><span className="text-blue-600">Energy</span><br/>Portal</React.Fragment>,
    desc: step === 2 ? "Define your corporate organizational structure for legal Sri Lankan grid integration."
          : step === 3 ? "Establish your primary charging node with precise hardware specifications and geolocation."
          : step === 4 ? "Configure your hourly rates and secure financial settlement path for payout cycles."
          : step === 5 ? "Verify all node parameters before deploying your entity to the national grid network."
          : "Register your infrastructure on Sri Lanka's leading EV network. Reach thousands of users and optimize your yield.",
    accent: step === 2 ? "#10B981" : step === 3 ? "#F59E0B" : step === 4 ? "#8B5CF6" : "#3B82F6",
    dot: step === 2 ? "Merchant Profile" : step === 3 ? "Station Station" : step === 4 ? "Revenue Logic" : step === 5 ? "Entity Audit" : "Energy Provider",
    icon: step === 2 ? Building2 : step === 3 ? MapPin : step === 4 ? GaugeCircle : step === 5 ? ClipboardCheck : Zap
  };

  const rgb = step === 2 ? "16,185,129" : step === 3 ? "245,158,11" : step === 4 ? "139,92,246" : "59,130,246";

  return (
    <aside className="relative lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-[400px] w-full overflow-hidden bg-white shrink-0 z-10 lg:z-20 border-r border-[#E2E8F0] selection:bg-blue-500/10 font-inter text-[#0F172A]">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=1200"
             className="absolute inset-0 w-full h-full object-cover opacity-10" alt="Provider BG"/>
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      </div>

      <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-20" style={{ background: `radial-gradient(circle,rgba(${rgb},0.5) 0%,transparent 70%)` }}></div>

      <div className="relative flex flex-col h-full px-8 py-10 lg:px-10 lg:py-14 justify-between items-center lg:items-start text-center lg:text-left min-h-[400px] lg:min-h-screen">
        
        {/* Brand System */}
        <div className="flex items-center gap-4 group cursor-pointer lg:scale-100 scale-90 mb-14 lg:mb-0">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative bg-gradient-to-br from-[#3B82F6] to-blue-700 shadow-xl group-hover:scale-105 transition-transform duration-500">
            <Zap className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div className="text-left font-manrope">
            <div className="text-2xl font-extrabold text-[#0F172A] tracking-tight uppercase leading-none">VoltWay</div>
            <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-tight mt-2">EV Management System</div>
          </div>
        </div>

        {/* Messaging Logic */}
        <div className="w-full max-w-sm lg:max-w-none animate-fade-up">
           <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full mb-10 text-[10px] font-bold tracking-widest uppercase border shadow-xl backdrop-blur-md`} 
                style={{ backgroundColor: `${content.accent}15`, border: `1px solid ${content.accent}40`, color: content.accent }}>
              <content.icon className="w-4 h-4 animate-pulse" />
              {content.dot}
           </div>
           
           <h1 className="font-manrope text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-[#0F172A] mb-6 uppercase border-l-4 border-[#E2E8F0] pl-6 transition-all duration-700">
             {title ? title : content.title}
           </h1>
           
           <p className="text-lg leading-relaxed text-slate-600 mb-12 opacity-80 font-medium font-inter">
             {description ? description : content.desc}
           </p>

           {/* Logic Modules (Desktop only) */}
           <div className="hidden lg:grid grid-cols-1 gap-6 font-inter">
              {step === 4 && (
                <div className="bg-white rounded-[32px] p-8 border border-[#E2E8F0] animate-fade-in shadow-xl relative group hover:border-purple-500/30 transition-all overflow-hidden">
                   <div className="absolute top-6 right-8 text-purple-400/20 group-hover:text-purple-400 transition-colors duration-500">
                      <GaugeCircle className="w-12 h-12" />
                   </div>
                   <div className="text-[10px] font-bold uppercase tracking-widest mb-8 text-purple-400 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]"></div>
                      Profit Model X1
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[14px]"><span className="text-[#64748B] font-medium">Revenue Target</span><span className="text-[#0F172A] font-bold font-manrope">LKR X / HR</span></div>
                      <div className="flex justify-between text-[14px]"><span className="text-[#64748B] font-medium">Network Levy</span><span className="text-red-400 font-bold font-manrope">- 15%</span></div>
                      <div className="h-px bg-[#F8FAFC] my-4"></div>
                      <div className="flex justify-between items-center"><span className="text-[11px] font-bold uppercase tracking-widest text-[#64748B]">Net Earnings</span><span className="text-emerald-400 font-extrabold text-xl font-manrope">85% Settlement</span></div>
                   </div>
                </div>
              )}

              {step === 5 && (
                <div className="grid grid-cols-1 gap-3.5 animate-fade-in">
                   {[
                     { i: Lock, t: 'Passwords Verified', c: 'text-blue-400', b: 'bg-blue-400/10' },
                     { i: Building2, t: 'Merchant Identity SET', c: 'text-emerald-400', b: 'bg-emerald-400/10' },
                     { i: MapPin, t: 'Station Station SET', c: 'text-amber-400', b: 'bg-amber-400/10' }
                   ].map(s => (
                     <div key={s.t} className={`flex items-center gap-5 p-6 rounded-[24px] border border-[#E2E8F0] ${s.b} group hover:scale-[1.02] shadow-sm transition-all`}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#F8FAFC] border border-[#E2E8F0] group-hover:bg-white/10 transition-all">
                           <s.i className={`w-5 h-5 ${s.c}`} strokeWidth={2.5} />
                        </div>
                        <div className="text-[11px] font-bold uppercase tracking-widest text-[#0F172A]">{s.t}</div>
                        <div className={`ml-auto text-[10px] font-extrabold uppercase tracking-widest ${s.c} flex items-center gap-2 font-manrope`}>
                           <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]"></div>
                           ✓ VERIFIED
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>

        {/* Station Footer */}
        <div className="mt-16 lg:mt-0 pt-10 border-t border-[#E2E8F0] w-full flex justify-between items-center text-[10px] font-bold text-[#64748B] uppercase tracking-widest font-inter opacity-60">
          <div className="flex items-center gap-3">
             <ShieldCheck className="w-4 h-4" />
             © 2026 VoltWay National Network
          </div>
          <div className="flex gap-6">
             <span className="hover:text-blue-400 cursor-pointer transition-colors flex items-center gap-1.5 group">
                Safety Module 
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
             </span>
             <span className="hover:text-blue-400 cursor-pointer transition-colors">Enterprise</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProvSidebar;





