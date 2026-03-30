import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { PageHeader } from './AdminComponents';
import { Zap, Receipt, TrendingUp, MapPin } from 'lucide-react';

export const Transactions = () => (
  <AdminLayout title="Transactions">
    <PageHeader title="Transactions" subtitle="Track all payment transactions." />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 font-inter">
       {[
         { icon: Zap, label: 'Income', val: 'Rs. 0.00', col: 'text-[#00d2b4] bg-[#00d2b4]/10' },
         { icon: Receipt, label: 'Units Sold', val: '432 Units', col: 'text-blue-400 bg-blue-400/10' },
         { icon: TrendingUp, label: 'Net Profit', val: '12.4%', col: 'text-[#8B5CF6] bg-[#8B5CF6]/10' },
         { icon: MapPin, label: 'Localities', val: '12 Sectors', col: 'text-amber-500 bg-amber-500/10' }
       ].map((s, i) => (
         <div key={i} className="bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[32px] p-8 hover:border-[#00d2b4]/40 transition-all shadow-xl group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${s.col}`}><s.icon className="w-5.5 h-5.5" strokeWidth={2.5} /></div>
            <div className="text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] mb-3 opacity-70 font-inter group-hover:opacity-100 transition-opacity">{s.label}</div>
            <div className="text-3xl font-extrabold text-white font-manrope tracking-tighter uppercase">{s.val}</div>
         </div>
       ))}
    </div>
    <div className="bg-[#0a2038]/40 border-2 border-dashed border-white/5 rounded-[48px] p-24 text-center font-inter shadow-2xl">
       <div className="w-20 h-20 rounded-[32px] bg-white/[0.03] flex items-center justify-center mx-auto mb-8 shadow-inner"><Receipt className="w-10 h-10 text-[#4E7A96] opacity-30" strokeWidth={1.5} /></div>
       <h3 className="text-2xl font-extrabold text-white font-manrope uppercase mb-3 tracking-tight">No Transactions Found</h3>
       <p className="text-[15px] text-[#8AAFC8] font-medium max-w-sm mx-auto opacity-70 leading-relaxed font-inter">Synchronizing latest transaction data from the server.</p>
    </div>
  </AdminLayout>
);
