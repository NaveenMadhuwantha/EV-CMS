import React from 'react';
import { Plus } from 'lucide-react';

export const PageHeader = ({ title, subtitle, action, onAction }) => (
  <div className="flex flex-wrap justify-between items-end gap-6 mb-12 pl-2 font-manrope">
    <div>
      <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tighter uppercase leading-none">
        {title}
      </h1>
      <p className="text-[#475569] mt-3 font-medium font-inter text-[15px]">{subtitle}</p>
    </div>
    {action && (
      <button 
        onClick={onAction}
        className="px-8 py-4 rounded-2xl bg-[#3B82F6] text-[#FFFFFF] text-[12px] font-extrabold hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest shadow-xl shadow-[#3B82F6]/20 flex items-center gap-3"
      >
        <Plus className="w-4 h-4" strokeWidth={3} /> {action}
      </button>
    )}
  </div>
);

export const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-8 font-manrope">
    <h3 className="font-extrabold text-[18px] text-[#0F172A] tracking-tight uppercase leading-none">{title}</h3>
    <p className="text-[13px] text-[#475569] mt-2 font-medium opacity-90 leading-relaxed font-inter tracking-tight">{subtitle}</p>
  </div>
);
