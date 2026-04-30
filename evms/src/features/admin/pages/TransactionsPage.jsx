import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';
import { PageHeader } from '../components/AdminComponents';
import { getAllBookings } from '../../../firestore/bookingDb';
import { getStationsByProvider } from '../../../firestore/stationDb';
import { useAuth } from '../../auth/context/AuthContext';
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
    <DashboardLayout title="Transactions">
      <PageHeader title={role === 'provider' ? "Your Ledger" : "Transactions"} subtitle="Track payment transactions & charging history." />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 font-inter">
          {[
            { icon: Zap, label: role === 'provider' ? 'Session Volume' : 'Gross Income', val: `Rs. ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, col: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            { icon: Receipt, label: 'Completed Tx', val: `${completedTx} Sessions`, col: 'text-blue-600 bg-blue-50 border-blue-100' },
            { icon: TrendingUp, label: role === 'provider' ? 'Net Earnings (Yours)' : 'Net Profit (Platform)', val: `Rs. ${(role === 'provider' ? totalEarnings : totalCommission).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, col: 'text-purple-600 bg-purple-50 border-purple-100' },
            { icon: MapPin, label: 'Active Stations', val: `${uniqueStations} Stations`, col: 'text-amber-600 bg-amber-50 border-amber-100' }
          ].map((s, i) => (
            <div key={i} className="bg-white border-2 border-[#E2E8F0] rounded-[32px] p-8 hover:border-[#3B82F6]/30 transition-all shadow-xl group cursor-default">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 shadow-inner border ${s.col}`}><s.icon className="w-5.5 h-5.5" strokeWidth={2.5} /></div>
               <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-[3px] mb-3 font-inter group-hover:text-[#0F172A] transition-colors">{s.label}</div>
               <div className="text-3xl font-extrabold text-[#0F172A] font-manrope tracking-tighter uppercase tabular-nums">{s.val}</div>
            </div>
          ))}
       </div>

       <div className="bg-white border border-[#E2E8F0] rounded-[48px] overflow-hidden shadow-xl relative font-inter">
        {loading ? (
          <div className="py-24 text-center text-[#64748B]">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 opacity-30" />
            <p className="text-[12px] font-bold uppercase tracking-widest leading-loose">Syncing Ledger Data...</p>
          </div>
        ) : (
          <table className="w-full text-left">
             <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                   <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[3px]">Reference</th>
                   <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[3px]">User & Station</th>
                   <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[3px]">Gross Amount</th>
                   <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[3px]">{role === 'provider' ? 'Your Earnings' : 'Fee'}</th>
                   <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[3px] text-right">Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-[#E2E8F0] font-manrope">
                 {transactions.length > 0 ? transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-[#F8FAFC] transition-all group">
                       <td className="px-12 py-8">
                          <div className="text-[#0F172A] font-extrabold text-[14px] uppercase tracking-tight">REF#{t.id.slice(-6).toUpperCase()}</div>
                          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mt-1 font-inter flex items-center gap-1.5">
                             <Calendar className="w-3 h-3" /> {t.date} · {t.time}
                          </div>
                       </td>
                       <td className="px-12 py-8">
                          <div className="text-[#0F172A] font-extrabold text-[15px] uppercase tracking-tight">{t.userName}</div>
                          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mt-1 font-inter">{t.stationName}</div>
                       </td>
                       <td className="px-12 py-8 font-black text-[#0F172A] text-[16px] tabular-nums tracking-tighter">
                          Rs. {(t.totalCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </td>
                       <td className="px-12 py-8 font-black text-emerald-600 text-[16px] tabular-nums tracking-tighter">
                          Rs. {(role === 'provider' ? (t.providerEarnings || 0) : (t.platformCommission || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </td>
                       <td className="px-12 py-8 text-right">
                          <span className={`px-4 py-2 rounded-xl border text-[9px] font-bold uppercase tracking-widest font-inter ${
                            t.status === 'COMPLETED' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                            t.status === 'CHARGING' ? 'bg-blue-50 border-blue-100 text-blue-600' : 
                            'bg-amber-50 border-amber-100 text-amber-600'
                          }`}>
                            {t.status || 'PENDING'}
                          </span>
                       </td>
                   </tr>
                )) : (
                    <tr>
                       <td colSpan="5" className="px-12 py-32 text-center text-[#94A3B8]">
                          <Receipt className="w-12 h-12 mx-auto mb-6 opacity-20" />
                          <p className="text-[12px] font-extrabold uppercase tracking-[6px]">No Transactions Found</p>
                       </td>
                    </tr>
                )}
             </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};
