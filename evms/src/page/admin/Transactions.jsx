import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { PageHeader } from './AdminComponents';
import { getAllBookings } from '../../firestore/bookingDb';
import { getStationsByProvider } from '../../firestore/stationDb';
import { useAuth } from '../../context/AuthContext';
import { Zap, Receipt, TrendingUp, MapPin, Loader2, Calendar } from 'lucide-react';

export const Transactions = () => {
  const { role, user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [role, user]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let data = await getAllBookings();
      
      if (role === 'provider') {
         const pStations = await getStationsByProvider(user.uid);
         const sIds = pStations.map(s => s.id);
         data = data.filter(b => sIds.includes(b.stationId));
      }
      
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = transactions.reduce((sum, t) => sum + (t.totalCost || 0), 0);
  const totalCommission = transactions.reduce((sum, t) => sum + (t.platformCommission || 0), 0);
  const totalEarnings = transactions.reduce((sum, t) => sum + (t.providerEarnings || 0), 0);
  
  const uniqueStations = new Set(transactions.map(t => t.stationId)).size;
  const completedTx = transactions.filter(t => t.status === 'COMPLETED').length;

  return (
    <AdminLayout title="Transactions">
      <PageHeader title={role === 'provider' ? "Your Ledger" : "Transactions"} subtitle="Track payment transactions & charging history." />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 font-inter">
         {[
           { icon: Zap, label: role === 'provider' ? 'Session Volume' : 'Gross Income', val: `Rs. ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, col: 'text-[#00d2b4] bg-[#00d2b4]/10' },
           { icon: Receipt, label: 'Completed Tx', val: `${completedTx} Sessions`, col: 'text-blue-400 bg-blue-400/10' },
           { icon: TrendingUp, label: role === 'provider' ? 'Net Earnings (Yours)' : 'Net Profit (Platform)', val: `Rs. ${(role === 'provider' ? totalEarnings : totalCommission).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, col: 'text-[#8B5CF6] bg-[#8B5CF6]/10' },
           { icon: MapPin, label: 'Active Stations', val: `${uniqueStations} Stations`, col: 'text-amber-500 bg-amber-500/10' }
         ].map((s, i) => (
           <div key={i} className="bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[32px] p-8 hover:border-[#00d2b4]/40 transition-all shadow-xl group cursor-default">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${s.col}`}><s.icon className="w-5.5 h-5.5" strokeWidth={2.5} /></div>
              <div className="text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] mb-3 opacity-70 font-inter group-hover:opacity-100 transition-opacity">{s.label}</div>
              <div className="text-3xl font-extrabold text-white font-manrope tracking-tighter uppercase tabular-nums">{s.val}</div>
           </div>
         ))}
      </div>

      <div className="bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[48px] overflow-hidden shadow-2xl relative font-inter">
        {loading ? (
          <div className="py-24 text-center opacity-30">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-[#00d2b4]" />
            <p className="text-[12px] font-bold uppercase tracking-widest text-[#4E7A96]">Syncing Ledger Data...</p>
          </div>
        ) : (
          <table className="w-full text-left">
             <thead>
                <tr className="bg-white/5 border-b border-white/5">
                   <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">Reference</th>
                   <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">User & Station</th>
                   <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">Gross Amount</th>
                   <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">{role === 'provider' ? 'Your Earnings' : 'Fee'}</th>
                   <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60 text-right">Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5 font-manrope">
                {transactions.length > 0 ? transactions.map((t) => (
                   <tr key={t.id} className="hover:bg-white/[0.01] transition-all group">
                      <td className="px-12 py-8">
                         <div className="text-white font-extrabold text-[14px] uppercase tracking-tight">REF#{t.id.slice(-6).toUpperCase()}</div>
                         <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-widest mt-1 opacity-60 font-inter flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" /> {t.date} · {t.time}
                         </div>
                      </td>
                      <td className="px-12 py-8">
                         <div className="text-white font-extrabold text-[15px] uppercase tracking-tight">{t.userName}</div>
                         <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-widest mt-1 opacity-60 font-inter">{t.stationName}</div>
                      </td>
                      <td className="px-12 py-8 font-black text-white text-[16px] tabular-nums tracking-tighter">
                         Rs. {(t.totalCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-12 py-8 font-black text-[#00d2b4] text-[16px] tabular-nums tracking-tighter shadow-inner">
                         Rs. {(role === 'provider' ? (t.providerEarnings || 0) : (t.platformCommission || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-12 py-8 text-right">
                         <span className={`px-4 py-2 rounded-xl border text-[9px] font-bold uppercase tracking-widest font-inter ${
                           t.status === 'COMPLETED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                           t.status === 'CHARGING' ? 'bg-[#00d2b4]/10 border-[#00d2b4]/20 text-[#00d2b4]' : 
                           'bg-amber-500/10 border-amber-500/20 text-amber-500'
                         }`}>
                           {t.status || 'PENDING'}
                         </span>
                      </td>
                   </tr>
                )) : (
                   <tr>
                      <td colSpan="5" className="px-12 py-32 text-center opacity-30">
                         <Receipt className="w-12 h-12 mx-auto mb-6 text-[#4E7A96]" />
                         <p className="text-[12px] font-extrabold uppercase tracking-[6px] text-[#4E7A96]">No Transactions Found</p>
                      </td>
                   </tr>
                )}
             </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};
