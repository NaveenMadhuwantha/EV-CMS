import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';
import { PageHeader, SectionHeader } from '../components/AdminComponents';
import { getAllBookings } from '../../../firestore/bookingDb';
import { getStationsByProvider } from '../../../firestore/stationDb';
import { useAuth } from '../../auth/context/AuthContext';
import { TrendingUp, Activity, Zap, ArrowUpRight, Download, FileText } from 'lucide-react';

export const Commission = () => {
  const { role, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommitData = async () => {
      try {
        let data = await getAllBookings();
        
        if (role === 'provider') {
           const pStations = await getStationsByProvider(user.uid);
           const sIds = pStations.map(s => s.id);
           data = data.filter(b => sIds.includes(b.stationId));
        }
        
        setBookings(data.filter(b => b.platformCommission > 0));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommitData();
  }, [role, user]);

  const downloadReport = () => {
    const headers = ["Reference", "Date", "Time", "Customer", "Station", "Total Cost (Rs)", "Commission (Rs)", "Earnings (Rs)"];
    const rows = bookings.map(b => [
      `REF#${b.id.slice(-6).toUpperCase()}`,
      b.date,
      b.time,
      b.userName,
      b.stationName,
      b.totalCost?.toFixed(2),
      b.platformCommission?.toFixed(2),
      b.providerEarnings?.toFixed(2)
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `VoltWay_${role === 'provider' ? 'Earnings' : 'Revenue'}_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const today = new Date().toISOString().split('T')[0];
  const todayCommits = bookings.filter(b => b.date === today);
  
  const totalCommission = bookings.reduce((sum, b) => sum + (b.platformCommission || 0), 0);
  const totalEarnings = bookings.reduce((sum, b) => sum + (b.providerEarnings || 0), 0);
  
  const dailyTotal = todayCommits.reduce((sum, b) => sum + (role === 'provider' ? (b.providerEarnings || 0) : (b.platformCommission || 0)), 0);
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalCost || 0), 0);
  const primaryMetric = role === 'provider' ? totalEarnings : totalCommission;

  return (
    <DashboardLayout title={role === 'provider' ? "Earnings" : "Revenue"}>
      <PageHeader title={role === 'provider' ? "Earnings Station" : "Revenue Hub"} subtitle={role === 'provider' ? "Real-time earnings extracted from your node network." : "Real-time platform revenue extracted from provider yield."} />
      
      {/* Commission Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 font-inter">
         <div className="bg-white border-2 border-[#E2E8F0] rounded-[40px] p-10 hover:border-[#3B82F6]/30 transition-all shadow-xl group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/5 blur-[60px] pointer-events-none"></div>
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner"><TrendingUp className="w-6 h-6" /></div>
               <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-[3px] font-inter group-hover:text-[#0F172A] transition-colors">Today's {role === 'provider' ? 'Earnings' : 'Profit'}</div>
            </div>
            <div className="text-4xl font-extrabold text-[#0F172A] font-manrope tracking-tighter uppercase tabular-nums">Rs. {dailyTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest"><ArrowUpRight className="w-3 h-3" /> {role === 'provider' ? '75% Provider Cut' : '25.0% Fixed Platform Rate'}</div>
         </div>
 
         <div className="bg-white border-2 border-[#E2E8F0] rounded-[40px] p-10 hover:border-[#3B82F6]/30 transition-all shadow-xl group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] pointer-events-none"></div>
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner"><Activity className="w-6 h-6" /></div>
               <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-[3px] font-inter group-hover:text-[#0F172A] transition-colors">Total Sales</div>
            </div>
            <div className="text-4xl font-extrabold text-[#0F172A] font-manrope tracking-tighter uppercase tabular-nums">Rs. {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div className="mt-4 text-[10px] font-bold text-[#64748B] uppercase tracking-widest opacity-60">Total volume processed</div>
         </div>
 
         <div className="bg-gradient-to-br from-[#3B82F6]/5 to-blue-600/5 border-2 border-[#E2E8F0] rounded-[40px] p-10 hover:border-[#3B82F6]/30 transition-all shadow-2xl group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-transparent pointer-events-none"></div>
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-2xl bg-[#3B82F6] flex items-center justify-center text-white shadow-xl"><Zap className="w-6 h-6" /></div>
               <div className="text-[11px] font-bold text-[#0F172A] uppercase tracking-[4px]">{role === 'provider' ? 'Your Net Earnings' : 'Total Revenue'}</div>
            </div>
            <div className="text-4xl font-extrabold text-[#0F172A] font-manrope tracking-tighter uppercase tabular-nums">Rs. {primaryMetric.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div className="mt-4 text-[10px] font-bold text-[#3B82F6] uppercase tracking-widest">{role === 'provider' ? 'Total Station Earnings' : 'Net Platform Earnings'}</div>
         </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[48px] overflow-hidden shadow-xl relative">
         <div className="px-12 py-10 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap justify-between items-center gap-6">
            <SectionHeader title={role === 'provider' ? 'Earnings History' : 'Commission Ledger'} subtitle="Detailed breakdown of earnings per transaction." />
            <div className="flex gap-4">
               <button 
                  onClick={downloadReport}
                  className="px-8 py-3 rounded-xl bg-[#3B82F6] text-white text-[10px] font-black uppercase tracking-[3px] hover:scale-105 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-3"
               >
                  <Download className="w-4 h-4" strokeWidth={3} /> GENERATE REPORT
               </button>
               <div className="px-6 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-bold text-[#64748B] uppercase tracking-[3px] flex items-center gap-2">
                  <FileText className="w-4 h-4" /> PRINT LOG
               </div>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                     <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[3px]">Transaction Ref</th>
                     <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[3px]">Customer</th>
                     <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[3px] text-right">Session Value</th>
                     <th className="px-12 py-8 text-[11px] font-bold text-emerald-600 uppercase tracking-[3px] text-right">{role === 'provider' ? 'Your Cut (75%)' : 'Revenue (25%)'}</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-[#E2E8F0] font-manrope">
                  {loading ? (
                    <tr><td colSpan="4" className="py-24 text-center text-[#64748B] font-inter text-[12px] font-bold uppercase tracking-[4px]">Calculating Ledger...</td></tr>
                  ) : bookings.length > 0 ? bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#F8FAFC] transition-all group">
                       <td className="px-12 py-8">
                          <div className="text-[#0F172A] font-extrabold text-[14px] uppercase tracking-tight font-manrope">REF#{b.id.slice(-6).toUpperCase()}</div>
                          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mt-1 font-inter">{b.date} · {b.time}</div>
                       </td>
                       <td className="px-12 py-8">
                          <div className="text-[#0F172A] font-extrabold text-[15px] uppercase tracking-tight">{b.userName}</div>
                          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mt-1 font-inter">{b.stationName}</div>
                       </td>
                       <td className="px-12 py-8 text-right font-black text-[#0F172A] text-[16px] tabular-nums">Rs. {(b.totalCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                       <td className="px-12 py-8 text-right font-black text-emerald-600 text-[18px] tabular-nums tracking-tighter">
                          Rs. {(role === 'provider' ? (b.providerEarnings || 0) : (b.platformCommission || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="py-32 text-center text-[#94A3B8]"><Zap className="w-12 h-12 mx-auto mb-6 opacity-20" /><p className="text-[10px] font-extrabold uppercase tracking-[6px]">No Revenue Data Synchronized</p></td></tr>
                  )}
               </tbody>
            </table>
         </div>
         <div className="px-12 py-8 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-between items-center">
            <div className="text-[10px] font-black text-[#64748B] uppercase tracking-widest leading-loose">Automated Ledger System — V1.0.4</div>
            <div className="text-[#3B82F6] font-black text-[13px] uppercase tracking-widest">Net Profit Rs. {primaryMetric.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
         </div>
      </div>
    </DashboardLayout>
  );
};
