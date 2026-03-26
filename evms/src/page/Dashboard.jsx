import React from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { 
  Zap, MapPin, Calendar, PieChart, TrendingUp, 
  Clock, Activity, Fuel, Users, Receipt, 
  ArrowUpRight, BarChart3, Settings 
} from 'lucide-react';

const StatCard = ({ icon: Icon, color, change, value, label, delay }) => (
  <div className={`p-6 bg-[#0a1628] border border-[#00d2b4]/10 rounded-2xl relative overflow-hidden group hover:border-[#00d2b4]/40 hover:-translate-y-1 transition-all animate-fade-up ${delay} shadow-sm font-inter`}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d2b4] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex justify-between items-start mb-6">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-[18px] ${color} shadow-lg shadow-[#000]/10`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className={`text-[12px] font-bold px-2 py-0.5 rounded-lg ${change.startsWith('↑') ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
        {change}
      </div>
    </div>
    <div className="font-manrope text-[32px] font-extrabold text-[#e2eaf8] leading-none mb-1.5 tracking-tight">{value}</div>
    <div className="text-[13px] text-[#7a9bbf] font-semibold opacity-70 uppercase tracking-wider">{label}</div>
  </div>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-center mb-6 px-1">
    <div>
      <h3 className="font-manrope font-bold text-[16px] text-white tracking-tight">{title}</h3>
      <p className="text-[12px] text-[#7a9bbf] mt-0.5 font-medium opacity-60 font-inter">{subtitle}</p>
    </div>
    {action && <button className="text-[12px] font-bold text-[#00d2b4] hover:brightness-125 transition-all font-inter uppercase tracking-widest">{action}</button>}
  </div>
);

const Dashboard = () => {
  const { user, profile } = useAuth();
  const userName = profile?.fullName || user?.email?.split('@')[0] || 'System Admin';

  return (
    <AdminLayout title="Overview Node">
      {/* ── WELCOME & STATS GRID ── */}
      <div className="mb-10 pl-1">
         <h1 className="font-manrope text-4xl font-extrabold text-white tracking-tight">Active <span className="text-[#00d2b4]">Telemetry.</span></h1>
         <p className="text-[#7a9bbf] mt-2 font-medium font-inter opacity-70">Connected to <span className="text-[#00d2b4] font-bold tracking-tight">VoltWay</span> national grid as <span className="text-white font-bold">{userName}</span></p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={Zap} color="bg-[#00d2b4]/10 text-[#00d2b4]" change="↑ 12.4%" value="0" label="Active Sessions" delay="delay-0" />
        <StatCard icon={MapPin} color="bg-[#0094ff]/10 text-[#0094ff]" change="↑ 2.1%" value="0" label="Stations Active" delay="delay-75" />
        <StatCard icon={Calendar} color="bg-amber-500/10 text-amber-500" change="↑ 0.0%" value="0" label="Bookings Month" delay="delay-150" />
        <StatCard icon={PieChart} color="bg-purple-500/10 text-purple-500" change="↑ 0.0%" value="Rs. 0.00" label="Comm. Earned" delay="delay-200" />
      </div>

      {/* ── CHARTS + COMMISSION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-[#0a1628] border border-[#00d2b4]/10 rounded-3xl overflow-hidden p-8 hover:border-[#00d2b4]/30 transition-all shadow-xl relative">
          <SectionHeader title="Revenue Insights" subtitle="Monthly grid performance vs. platform overhead" action="Telemetry Data →" />
          <div className="h-[180px] flex items-end gap-3 mt-10 px-2 group opacity-40">
            {[20, 35, 48, 28, 45, 32, 50].map((v, i) => (
              <div key={i} className="flex-1 flex items-end gap-1.5 h-full">
                <div style={{ height: `${v}%` }} className="flex-1 bg-gradient-to-t from-[#00d2b4]/20 to-[#00d2b4] rounded-t-lg transition-all cursor-pointer"></div>
                <div style={{ height: `${v * 0.25}%` }} className="flex-1 bg-gradient-to-t from-[#0094ff]/20 to-[#0094ff] rounded-t-lg transition-all cursor-pointer"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 px-2 text-[10px] text-[#3a5a7a] font-bold uppercase tracking-widest font-inter">
            {['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map(m => <span key={m}>{m}</span>)}
          </div>
        </div>

        <div className="bg-[#0a1628] border border-[#00d2b4]/10 rounded-3xl p-8 hover:border-[#00d2b4]/30 transition-all shadow-xl font-inter">
          <SectionHeader title="Commission Matrix" subtitle="Ecosystem fee allocation" />
          <div className="flex justify-center p-6 my-4">
             <div className="relative w-36 h-36 flex items-center justify-center group">
                <svg className="w-full h-full -rotate-90 group-hover:scale-105 transition-transform duration-500" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10"/>
                   <circle cx="50" cy="50" r="42" fill="none" stroke="#00d2b4" strokeWidth="10" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="264" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-manrope">
                   <div className="font-extrabold text-[28px] text-white tracking-tight leading-none">0%</div>
                   <div className="text-[10px] font-bold text-[#3a5a7a] uppercase tracking-widest mt-1">Rate</div>
                </div>
             </div>
          </div>
          <div className="space-y-4 border-t border-white/5 pt-8 mt-6">
             <div className="flex justify-between text-[14px]"><span className="text-[#7a9bbf] font-medium">Total Yield</span><span className="text-white font-bold">Rs. 0.00</span></div>
             <div className="flex justify-between text-[14px]"><span className="text-[#7a9bbf] font-medium">To Merchant</span><span className="text-white font-bold">Rs. 0.00</span></div>
             <div className="flex justify-between items-center pt-5 border-t border-white/5"><span className="text-[#00d2b4] font-bold uppercase text-[11px] tracking-wider">Platform Fee</span><span className="text-[#00d2b4] font-extrabold text-xl font-manrope">Rs. 0.00</span></div>
          </div>
        </div>
      </div>

      {/* ── MAP + ACTIVITY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 font-inter">
        <div className="bg-[#0a1628] border border-[#00d2b4]/10 rounded-3xl overflow-hidden p-8 hover:border-[#00d2b4]/30 transition-all shadow-xl relative">
           <SectionHeader title="Grid Hub Map" subtitle="Real-time hub status across sectors" action="System Map →" />
           <div className="h-[280px] bg-[#050c14] rounded-2xl relative overflow-hidden group border border-white/5">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(0,210,180,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,180,0.1) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              {[
                { top: '30%', left: '20%', col: '#00d2b4' },
                { top: '50%', left: '45%', col: '#00d2b4' },
                { top: '25%', left: '70%', col: '#0094ff' },
                { top: '65%', left: '30%', col: '#f59e0b' },
                { top: '75%', left: '60%', col: '#00d2b4' }
              ].map((p, i) => (
                <div key={i} className="absolute w-3 h-3 rounded-full cursor-pointer hover:scale-150 transition-all z-10" 
                     style={{ top: p.top, left: p.left, backgroundColor: p.col, boxShadow: `0 0 12px ${p.col}` }}></div>
              ))}
              <div className="absolute bottom-6 left-6 p-4 bg-[#0a1628]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl font-inter">
                 <div className="text-[10px] font-bold text-white mb-3 uppercase tracking-widest opacity-80">Hub Telemetry Status</div>
                 <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#7a9bbf] uppercase tracking-wide"><div className="w-2.5 h-2.5 rounded-full bg-[#00d2b4]"></div> Avail</div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#7a9bbf] uppercase tracking-wide"><div className="w-2.5 h-2.5 rounded-full bg-[#0094ff]"></div> Occupy</div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#7a9bbf] uppercase tracking-wide"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Error</div>
                 </div>
              </div>
           </div>
           
           <div className="grid grid-cols-4 gap-4 mt-8">
              {[
                { i: Fuel, l: 'Add Node' },
                { i: Calendar, l: 'Book Session' },
                { i: Users, l: 'Registry' },
                { i: BarChart3, l: 'Reports' }
              ].map(q => (
                <button key={q.l} className="flex flex-col items-center gap-3 p-5 bg-[#0f2040]/30 border border-white/5 rounded-2xl hover:bg-[#00d2b4]/10 hover:border-[#00d2b4]/40 transition-all group active:scale-95 shadow-sm">
                   <q.i className="w-5 h-5 text-[#3a5a7a] group-hover:text-[#00d2b4] transition-colors" />
                   <span className="text-[11px] font-bold text-[#7a9bbf] uppercase tracking-wider group-hover:text-white transition-colors">{q.l}</span>
                </button>
              ))}
           </div>
        </div>

        <div className="bg-[#0a1628] border border-[#00d2b4]/10 rounded-3xl p-8 hover:border-[#00d2b4]/30 transition-all shadow-xl font-inter">
          <SectionHeader title="Active Telemetry" subtitle="Real-time system event logs" action="Audit All" />
          <div className="space-y-7 opacity-40">
            {[
              { dot: 'bg-green-500', t: 'System scan: All grids synchronized', s: 'Just now' },
              { dot: 'bg-blue-500', t: 'Security layer: AES-256 protocols ready', s: '1m ago' },
              { dot: 'bg-[#00d2b4]', t: 'Telemetry: Colombo Central Node pinged', s: '5m ago' }
            ].map((a, i) => (
              <div key={i} className="flex gap-5 group cursor-pointer hover:translate-x-1 transition-transform border-b border-white/5 pb-6 last:border-none">
                 <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 shadow-lg ${a.dot}`}></div>
                 <div className="flex-1">
                    <p className="text-[14px] text-white font-bold font-manrope leading-tight uppercase tracking-tight">{a.t}</p>
                    <p className="text-[10px] text-[#3a5a7a] font-bold uppercase tracking-widest mt-2">{a.s}</p>
                 </div>
              </div>
            ))}
          </div>
          <div className="py-12 text-center text-[#3a5a7a] text-[11px] font-bold uppercase tracking-[4px] opacity-60">
             Scanning Networks...
          </div>
        </div>
      </div>

      {/* ── SYSTEM TRANSACTIONS TABLE ── */}
      <div className="bg-[#0a1628] border border-[#00d2b4]/10 rounded-3xl overflow-hidden hover:border-[#00d2b4]/30 transition-all shadow-2xl font-inter">
         <div className="p-8 border-b border-white/5 flex flex-wrap justify-between items-center gap-6 bg-[#0f2040]/30">
            <SectionHeader title="Network Transactions" subtitle="Latest global grid activities verified via secure ledger" />
            <button className="px-6 py-3 rounded-xl bg-[#00d2b4] text-[#050c14] text-[11px] font-extrabold hover:brightness-110 transition-all uppercase tracking-widest shadow-xl shadow-[#00d2b4]/20 font-manrope">+ Secure Entry</button>
         </div>
         <div className="py-24 text-center opacity-40">
             <Receipt className="w-12 h-12 text-[#3a5a7a] mx-auto mb-6" />
             <p className="text-[11px] font-bold uppercase tracking-[4px] text-[#3a5a7a]">No active sessions in current sector.</p>
         </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
