import React from 'react';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';
import { PageHeader, SectionHeader } from '../components/AdminComponents';

export const Analytics = () => (
  <DashboardLayout title="Analytics">
    <PageHeader title="Analytics" subtitle="Visual insights into system performance." />
    <div className="bg-white border-2 border-[#E2E8F0] rounded-[48px] p-12 lg:p-16 hover:border-[#3B82F6]/30 transition-all font-inter shadow-xl relative overflow-hidden">
       <div className="flex flex-wrap justify-between items-start gap-8 mb-12 relative z-10">
          <SectionHeader title="System Efficiency" subtitle="Daily efficiency analysis in real-time." />
          <div className="flex gap-4 font-manrope bg-[#F8FAFC] p-2 rounded-2xl border border-[#E2E8F0]">
             {['24H', '7D', '30D'].map(p => <button key={p} className="px-6 py-2.5 rounded-xl text-[11px] font-extrabold text-[#64748B] hover:text-[#0F172A] hover:bg-white hover:shadow-sm transition-all uppercase tracking-widest">{p}</button>)}
          </div>
       </div>
       <div className="h-[320px] flex items-end gap-3.5 opacity-40 mt-16 relative z-10">
          {[40, 60, 45, 80, 55, 90, 70, 100, 65, 85, 45, 95].map((v, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-[#00d2b4] to-[#0094ff] rounded-t-xl transition-all hover:scale-x-110 hover:brightness-125 shadow-2xl group relative" style={{ height: `${v}%` }}>
               <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0F172A] px-3 py-1 transparent rounded-lg text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold">{v}%</div>
            </div>
          ))}
       </div>
       <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#3B82F6]/5 to-transparent pointer-events-none opacity-40"></div>
    </div>
  </DashboardLayout>
);
