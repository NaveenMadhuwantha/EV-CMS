import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { getDashboardOverview } from '../../firestore/dashboardDb';
import { performBackup, performRecovery } from '../../firestore/backupDb';
import { Zap, MapPin, Calendar, PieChart, Activity, Fuel, Users, BarChart3, Database, Download, Upload, Receipt } from 'lucide-react';

const StatCard = ({ icon: Icon, color, change, value, label, delay }) => (
  <div className={`p-8 bg-[#0a1628]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-3xl relative overflow-hidden group hover:border-[#00d2b4]/40 hover:-translate-y-1 transition-all animate-fade-up ${delay} shadow-sm font-inter`}>
    <div className="flex justify-between items-start mb-8 relative z-10 font-inter">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[18px] ${color} shadow-lg shadow-[#000]/20`}>
        <Icon className="w-5.5 h-5.5" strokeWidth={2.5} />
      </div>
      <div className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg font-manrope tracking-widest ${change.startsWith('↑') ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/10' : 'text-red-400 bg-red-500/10 border border-red-500/10'}`}>
        {change}
      </div>
    </div>
    <div className="font-manrope text-[40px] font-extrabold text-white leading-none mb-3 tracking-tighter relative z-10">{value}</div>
    <div className="text-[12px] text-[#4E7A96] font-bold uppercase tracking-[3px] opacity-70 relative z-10">{label}</div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-bl-[100px] pointer-events-none group-hover:bg-white/[0.02] transition-colors"></div>
  </div>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-center mb-10 px-1 font-manrope">
    <div>
      <h3 className="font-extrabold text-[20px] text-white tracking-tight uppercase">{title}</h3>
      <p className="text-[13px] text-[#8AAFC8] font-medium opacity-60 mt-1.5 font-inter">{subtitle}</p>
    </div>
    {action && <button className="text-[11px] font-extrabold text-[#00d2b4] hover:brightness-125 transition-all font-manrope uppercase tracking-widest border border-white/5 bg-white/5 px-4 py-2 rounded-xl">{action}</button>}
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState({ activeStations: 0, totalBookings: 0, recentSessions: [], commissionRate: 0, loading: true });
  const [bkpMsg, setBkpMsg] = useState('');

  useEffect(() => {
     getDashboardOverview().then(res => setData({ ...res, loading: false }));
  }, []);

  const handleBackup = async () => {
    try {
      await performBackup();
      setBkpMsg('Backup successful.');
    } catch (e) { setBkpMsg('Backup failed.'); }
  };

  const handleRestore = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          await performRecovery(ev.target.result);
          setBkpMsg('Recovery successful. Refreshing...');
          setTimeout(() => window.location.reload(), 2000);
        } catch (err) { setBkpMsg('Recovery failed.'); }
      };
      reader.readAsText(file);
    }
  };

  return (
    <AdminLayout title="System Overview">
      <div className="font-inter">
        {/* ── MAINTENANCE BAR ── */}
        <div className="mb-10 p-6 bg-[#00d2b4]/5 border border-[#00d2b4]/20 rounded-3xl flex flex-wrap items-center justify-between gap-6 animate-fade-in shadow-inner relative overflow-hidden">
           <div className="flex items-center gap-4 relative z-10">
              <Database className="w-8 h-8 text-[#00d2b4]" />
              <div>
                 <h4 className="text-[12px] font-black text-white uppercase tracking-[3px]">Network Maintenance Engine</h4>
                 <p className="text-[10px] text-[#8AAFC8] font-bold uppercase tracking-widest mt-1 opacity-70">Automated synchronization and manual snapshot recovery active.</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4 relative z-10">
              {bkpMsg && <span className="text-[10px] font-bold text-[#00d2b4] uppercase tracking-widest mr-4 animate-pulse italic">{bkpMsg}</span>}
              <button onClick={handleBackup} className="px-6 py-3 bg-[#0a2038] border border-white/5 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:border-[#00d2b4]/40 transition-all flex items-center gap-3">
                 <Download className="w-4 h-4" /> Snapshot Backup
              </button>
              <label className="px-6 py-3 bg-[#00d2b4] rounded-xl text-[#050c14] text-[10px] font-black uppercase tracking-widest hover:brightness-110 cursor-pointer transition-all flex items-center gap-3">
                 <Upload className="w-4 h-4" /> Restore Data
                 <input type="file" onChange={handleRestore} className="hidden" accept=".json" />
              </label>
           </div>
           
           <div className="absolute top-0 right-0 w-64 h-full bg-[#00d2b4]/5 blur-[60px] pointer-events-none"></div>
        </div>

        {/* ── STATS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard icon={Zap} color="bg-[#00d2b4]/10 text-[#00d2b4]" change="↑ 0.0%" value={data.recentSessions.length} label="Active Sessions" delay="delay-0" />
          <StatCard icon={MapPin} color="bg-[#0094ff]/10 text-[#0094ff]" change="↑ 0.0%" value={data.activeStations} label="Station Clusters" delay="delay-75" />
          <StatCard icon={Calendar} color="bg-amber-500/10 text-amber-500" change="↑ 0.0%" value={data.totalBookings} label="Slot Bookings" delay="delay-150" />
          <StatCard icon={PieChart} color="bg-purple-500/10 text-purple-500" change="↑ 0.0%" value={`Rs. 0`} label="Earnings Earned" delay="delay-200" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-[#0a1628]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[40px] overflow-hidden p-10 hover:border-[#00d2b4]/30 transition-all shadow-xl relative opacity-40 font-manrope">
            <SectionHeader title="Revenue Analysis" subtitle="Daily revenue trends across all sectors." />
            <div className="h-[220px] flex items-center justify-center text-[12px] font-bold uppercase tracking-[4px] text-[#4E7A96] opacity-40">Syncing telemetry data...</div>
          </div>

          <div className="bg-[#0a1628]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[40px] p-10 hover:border-[#00d2b4]/30 transition-all shadow-xl font-inter">
            <SectionHeader title="Commission Split" subtitle="Platform fee vs provider earnings." />
            <div className="flex justify-center p-8 mb-10">
              <div className="relative w-40 h-40 flex items-center justify-center group font-manrope">
                <svg className="w-full h-full -rotate-90 group-hover:scale-105 transition-transform duration-700" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#00d2b4" strokeWidth="10" strokeDasharray={`${data.commissionRate * 2.64} 264`} strokeLinecap="round" className="shadow-2xl" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-extrabold text-[36px] text-white leading-none tracking-tighter">{data.commissionRate}%</div>
                  <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-widest mt-2 opacity-60">Split</div>
                </div>
              </div>
            </div>
            <div className="space-y-5 border-t border-white/5 pt-10 px-2 font-inter">
              <div className="flex justify-between items-center text-[15px]"><span className="text-[#8AAFC8] font-medium">Total Revenue</span><span className="text-white font-extrabold font-manrope">Rs. 0.00</span></div>
              <div className="flex justify-between items-center text-[15px]"><span className="text-[#8AAFC8] font-medium">Platform Commission</span><span className="text-[#00d2b4] font-extrabold font-manrope">Rs. 0.00</span></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[40px] p-10 hover:border-[#00d2b4]/30 transition-all shadow-xl relative font-manrope">
            <SectionHeader title="Quick Links" subtitle="Navigate to admin modules." />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10 font-manrope">
              {[ 
                { i: Users, l: 'Users', path: '/admin/users' }, 
                { i: Zap, l: 'Providers', path: '/admin/providers' }, 
                { i: Receipt, l: 'Ledger', path: '/admin/transactions' }, 
                { i: PieChart, l: 'Revenue', path: '/admin/commission' } 
              ].map(q => (
                <a href={q.path} key={q.l} className="flex flex-col items-center gap-4 p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-[#00d2b4]/10 hover:border-[#00d2b4]/40 transition-all group shadow-sm cursor-pointer">
                  <q.i className="w-5.5 h-5.5 text-[#4E7A96] group-hover:text-[#00d2b4] transition-colors" strokeWidth={2.5} />
                  <span className="text-[10px] font-bold text-[#4E7A96] group-hover:text-white uppercase tracking-widest transition-colors">{q.l}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[40px] p-10 hover:border-[#00d2b4]/30 transition-all shadow-xl font-inter">
            <SectionHeader title="Recent Bookings" subtitle="Latest user interactions and sessions." action="Audit All" />
            <div className="space-y-6 max-h-[460px] overflow-y-auto custom-scrollbar pr-4">
              {data.loading ? (
                 <div className="text-center py-24 text-[#4E7A96] font-bold uppercase tracking-widest text-[11px] animate-pulse">Syncing data...</div>
              ) : data.recentSessions.map((session, i) => (
                <div key={i} className="flex gap-6 group cursor-pointer border-b border-white/5 pb-6 last:border-none hover:bg-white/[0.01] rounded-xl transition-all p-3">
                  <div className="w-3 h-3 rounded-full mt-2 shrink-0 bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse"></div>
                  <div className="flex-1 min-w-0 font-manrope">
                    <p className="text-[17px] text-white font-extrabold tracking-tight leading-none truncate uppercase group-hover:text-[#00d2b4] transition-colors">{session.userName || 'Unknown User'}</p>
                    <p className="text-[10px] text-[#4E7A96] font-bold uppercase tracking-widest mt-2.5 flex items-center gap-2">
                       <Activity className="w-3.5 h-3.5" />
                       LOC: {session.location || 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
              {!data.loading && data.recentSessions.length === 0 && (
                 <div className="py-24 text-center text-[#4E7A96] font-bold italic tracking-[4px] text-[12px] uppercase opacity-30">No active sessions found.</div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#0a1628]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[48px] overflow-hidden hover:border-[#00d2b4]/40 transition-all shadow-2xl font-inter">
          <div className="p-10 border-b border-white/5 flex flex-wrap justify-between items-center bg-white/[0.02] font-manrope gap-6">
            <SectionHeader title="Recent Transactions" subtitle="Detailed log of recent node transactions." />
            <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-[#0A8F6A] text-[#050c14] text-[12px] font-extrabold hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest shadow-xl shadow-emerald-500/10">+ Add Transaction</button>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-left font-inter">
                 <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                       <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">User</th>
                       <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">Amount</th>
                       <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">Date & Time</th>
                       <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5 font-manrope">
                    {data.recentSessions.map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.01] transition-all group">
                         <td className="px-12 py-8 text-[16px] font-extrabold text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{row.userName}</td>
                         <td className="px-12 py-8 text-[16px] font-extrabold text-emerald-400 tracking-tight">Rs. {row.amount || '0.00'}</td>
                         <td className="px-12 py-8 text-[13px] text-[#8AAFC8] font-bold uppercase opacity-60 tracking-wider font-inter">
                            {row.timestamp?.toDate().toLocaleString() || 'N/A'}
                         </td>
                         <td className="px-12 py-8">
                            <span className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20 text-emerald-400 bg-emerald-500/10 shadow-sm font-inter">Completed</span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
              {data.recentSessions.length === 0 && !data.loading && (
                 <div className="p-24 text-center opacity-30 text-[#4E7A96] font-bold uppercase tracking-[5px] text-[12px] italic">No transaction data found.</div>
              )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
