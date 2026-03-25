import React from 'react';

const ProvSidebar = ({ activeStep = 1, title, description }) => {
  const isStep2 = activeStep === 2;
  const isStep3 = activeStep === 3;
  const isStep4 = activeStep === 4;
  const isStep5 = activeStep === 5;
  
  const content = {
    title: isStep2 ? <React.Fragment>Your<br/><span className="text-[#34D399]">Business</span><br/>Identity</React.Fragment> 
           : isStep3 ? <React.Fragment>Register<br/>Your <span className="text-[#FBBF24]">Charging</span><br/>Station</React.Fragment>
           : isStep4 ? <React.Fragment>Set Your<br/><span className="text-[#A78BFA]">Rates &</span><br/>Hours</React.Fragment>
           : isStep5 ? <React.Fragment>Almost<br/><span className="text-[#60A5FA]">Ready to</span><br/>Go Live!</React.Fragment>
           : <React.Fragment>Grow Your<br/><span className="text-[#60A5FA]">Charging</span><br/>Business</React.Fragment>,
    desc: isStep2 ? "Tell us about your company. This information will be displayed to EV owners searching for nearby charging stations."
          : isStep3 ? "Provide details about your charging infrastructure so we can accurately list your station for EV owners."
          : isStep4 ? "Define your charging rates and operating schedule. EV owners will see this information when booking."
          : isStep5 ? "Review all your details before submitting. Our team will verify your application within 24–48 hours."
          : "Register your charging stations on Sri Lanka's leading EV network. Reach thousands of EV owners and maximize utilization.",
    accent: isStep2 ? "#34D399" : isStep3 ? "#FBBF24" : isStep4 ? "#A78BFA" : "#3B82F6",
    dot: isStep2 ? "Business Profile" : isStep3 ? "Station Setup" : isStep4 ? "Pricing & Schedule" : isStep5 ? "Final Review" : "Charging Provider"
  };

  const rgb = isStep2 ? "52,211,153" : isStep3 ? "251,191,36" : isStep4 ? "167,139,250" : "59,130,246";

  return (
    <div className="hidden lg:flex w-[440px] flex-shrink-0 relative flex-col overflow-hidden bg-[#060C18]">
      <img src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=900&q=80"
           className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Provider BG"/>
      <div className="absolute inset-0 bg-[size:44px_44px] transition-all duration-700" style={{ backgroundImage: `linear-gradient(rgba(${rgb},0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(${rgb},0.04) 1px, transparent 1px)` }}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#060C18]/97 via-[#0A0F1E]/88 transition-all duration-700" style={{ to: `rgba(${rgb},0.05)` }}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#060C18]/97 via-[#0A0F1E]/88 transition-all duration-700 pointer-events-none" style={{ background: `linear-gradient(135deg, rgba(6,12,24,0.97) 0%, rgba(10,15,30,0.88) 55%, rgba(${rgb},0.05) 100%)` }}></div>
      
      <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full transition-all duration-700 pointer-events-none" style={{ background: `radial-gradient(circle,rgba(${rgb},0.1)_0%,transparent_70%)` }}></div>

      <div className="relative flex flex-col h-full p-10 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl relative overflow-hidden bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] shadow-[0_0_22px_rgba(59,130,246,0.35)]">
            ⚡
          </div>
          <div>
            <div className="font-syne text-lg font-extrabold text-white">VoltWay</div>
            <div className="text-[10px] text-[#475569] uppercase tracking-widest leading-none font-bold">Charge Management</div>
          </div>
        </div>

        <div className="animate-[fadeInUp_0.5s_ease_both]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-[11px] font-bold tracking-widest uppercase border transition-all duration-500" 
               style={{ backgroundColor: `${content.accent}15`, borderColor: `${content.accent}40`, color: content.accent }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: content.accent }}></span>
            {content.dot}
          </div>
          <h1 className="font-syne text-[38px] font-extrabold leading-[1.1] text-white mb-4 tracking-tight">
            {title ? title : content.title}
          </h1>
          <p className="text-[15px] leading-relaxed text-[#94A3B8] mb-8">
            {description ? description : content.desc}
          </p>

          {!title && isStep4 && (
            <div className="space-y-3 animate-[fadeInUp_0.6s_ease_both]">
              <div className="rounded-2xl p-4 bg-[#A78BFA]/10 border border-[#A78BFA]/20">
                <div className="text-[11px] font-bold uppercase tracking-wider mb-3 text-[#A78BFA]">💰 Commission Structure</div>
                <div className="flex items-center justify-between text-sm mb-2"><span className="text-[#94A3B8]">Your rate (set by you)</span><span className="text-white font-bold">LKR X / hr</span></div>
                <div className="flex items-center justify-between text-sm mb-2"><span className="text-[#94A3B8]">Platform fee (deducted)</span><span className="text-rose-400 font-semibold">− 15%</span></div>
                <div className="h-[1px] bg-white/10 my-2"></div>
                <div className="flex items-center justify-between text-sm"><span className="text-white font-semibold">Your payout per hour</span><span className="text-emerald-400 font-bold">LKR X × 85%</span></div>
              </div>
              <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📅</span>
                  <div>
                    <div className="text-sm font-semibold text-white">Flexible Scheduling</div>
                    <div className="text-xs mt-0.5 text-[#64748B]">Set different hours for weekdays and weekends</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!title && isStep5 && (
            <div className="space-y-2.5 animate-[fadeInUp_0.6s_ease_both]">
              {[
                { i: '🔐', t: 'Account Created', c: '#60A5FA', b: '#3B82F6' },
                { i: '🏢', t: 'Business Profile', c: '#34D399', b: '#10B981' },
                { i: '⚡', t: 'Station Details', c: '#FBBF24', b: '#F59E0B' },
                { i: '💰', t: 'Pricing & Schedule', c: '#A78BFA', b: '#8B5CF6' }
              ].map(s => (
                <div key={s.t} className="flex items-center gap-3 p-3.5 rounded-xl border" style={{ backgroundColor: `${s.b}15`, borderColor: `${s.b}35` }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.b}30` }}>{s.i}</div>
                  <div className="text-sm text-white font-semibold">{s.t}</div>
                  <div className="ml-auto text-[11px]" style={{ color: s.c }}>✓ Done</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-[10px] text-[#334155] font-semibold">
          © 2026 VoltWay · <a href="#" className="text-[#3B82F6] hover:underline">Privacy</a> · <a href="#" className="text-[#3B82F6] hover:underline">Terms</a>
        </div>
      </div>
    </div>
  );
};

export default ProvSidebar;
