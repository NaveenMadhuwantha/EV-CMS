import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

const Topbar = ({ title }) => (
  <header className="sticky top-0 z-50 h-[80px] bg-[#050c14]/80 backdrop-blur-2xl border-b border-white/5 flex items-center px-12 gap-8 font-inter shadow-sm">
    <div className="font-manrope font-extrabold text-[24px] flex-1 text-white tracking-tighter uppercase leading-none">{title}</div>
    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3 w-[320px] focus-within:border-[#00d2b4]/40 transition-all group shadow-inner">
      <Search className="w-4.5 h-4.5 text-[#4E7A96] group-focus-within:text-[#00d2b4]" />
      <input 
        type="text" 
        placeholder="Search System..." 
        className="bg-transparent border-none outline-none text-[13px] text-white w-full placeholder:text-[#4E7A96] placeholder:uppercase placeholder:tracking-widest placeholder:text-[9px] font-bold" 
      />
    </div>
    <div className="flex items-center gap-4">
      <button className="w-12 h-12 flex items-center justify-center bg-white/[0.03] border border-white/5 rounded-2xl text-[#4E7A96] hover:text-white hover:border-[#00d2b4]/30 relative transition-all shadow-sm group">
        <Bell className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
        <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#050c14] shadow-[0_0_8px_#10b981]" />
      </button>
      <button className="w-12 h-12 flex items-center justify-center bg-white/[0.03] border border-white/5 rounded-2xl text-[#4E7A96] hover:text-white hover:border-[#00d2b4]/30 transition-all shadow-sm group">
        <Settings className="w-4.5 h-4.5 group-hover:rotate-45 transition-transform" />
      </button>
    </div>
  </header>
);

export default Topbar;
