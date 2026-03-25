import React from 'react';

const RegSidebar = ({
  image = "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&q=80",
  stepTag = "EV Owner Portal",
  tagColor = "text-[#00D4AA]",
  tagBg = "bg-[#00D4AA]/10",
  tagBorder = "border-[#00D4AA]/25",
  title = <><span className="text-white">Power Up Your</span><br /><span className="text-[#00D4AA]">EV Journey</span><br /><span className="text-white">Today</span></>,
  description = "Join Sri Lanka's fastest growing EV charging network. Book slots, find stations, and charge smarter.",
  infoCards = [],
  opacity = "opacity-30",
  children
}) => {
  return (
    <div className="hidden lg:flex w-[420px] flex-shrink-0 relative flex-col overflow-hidden bg-[#091825]">
      <img
        src={image}
        className={`absolute inset-0 w-full h-full object-cover ${opacity}`}
        alt=""
      />
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,170,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,170,0.04)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
      
      {/* Main Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050F1C]/95 via-[#091825]/85 to-[#00D4AA]/5"></div>
      
      {/* Accent Glow */}
      <div className="absolute bottom-20 -right-16 w-72 h-72 rounded-full bg-[#00D4AA]/10 blur-3xl"></div>

      <div className="relative flex flex-col h-full p-10 justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl relative overflow-hidden bg-gradient-to-br from-[#00D4AA] to-[#4FFFB0] shadow-[0_0_20px_rgba(0,212,170,0.3)] text-[#050F1C]">
            ⚡
          </div>
          <div>
            <div className="font-syne text-lg font-extrabold text-white">VoltWay</div>
            <div className="text-[10px] text-[#4E7A96] uppercase tracking-widest leading-none">Charge Management</div>
          </div>
        </div>

        {/* Copy */}
        <div>
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-[11px] font-semibold tracking-widest uppercase border ${tagBg} ${tagBorder} ${tagColor}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse bg-current`}></span> {stepTag}
          </div>
          <h1 className="font-syne text-4xl font-extrabold leading-tight tracking-[-0.02em] text-white mb-4">
            {title}
          </h1>
          <p className="text-[15px] leading-relaxed mb-10 text-[#8AAFC8]">
            {description}
          </p>
          
          {children}

          {infoCards.length > 0 && (
            <div className="space-y-3">
              {infoCards.map((card, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{card.icon}</span>
                    <span className="text-sm font-semibold text-white">{card.title}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#4E7A96]">{card.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-xs text-[#4E7A96]">
          © 2026 VoltWay · <a href="#" className="text-[#00D4AA] hover:underline">Privacy</a> · <a href="#" className="text-[#00D4AA] hover:underline">Terms</a>
        </div>
      </div>
    </div>
  );
};


export default RegSidebar;


