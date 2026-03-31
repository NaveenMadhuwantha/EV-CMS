import React from 'react';
import { Plus } from 'lucide-react';

export const PageHeader = ({ title, subtitle, action, onAction }) => (
  <div className="flex flex-wrap justify-between items-end gap-6 mb-12 pl-2 font-manrope">
    <div>
      <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tighter uppercase leading-none">
        {title}
      </h1>
      <p className="text-[#8AAFC8] mt-3 font-medium opacity-70 font-inter text-[15px]">{subtitle}</p>
    </div>
    {action && (
      <button 
        onClick={onAction}
        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-[#0A8F6A] text-[#050c14] text-[12px] font-extrabold hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest shadow-xl shadow-emerald-500/10 flex items-center gap-3"
      >
        <Plus className="w-4 h-4" strokeWidth={3} /> {action}
      </button>
    )}
  </div>
);

export const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-8 font-manrope">
    <h3 className="font-extrabold text-[18px] text-white tracking-tight uppercase leading-none">{title}</h3>
    <p className="text-[13px] text-[#8AAFC8] mt-2 font-medium opacity-60 leading-relaxed font-inter tracking-tight">{subtitle}</p>
  </div>
);
