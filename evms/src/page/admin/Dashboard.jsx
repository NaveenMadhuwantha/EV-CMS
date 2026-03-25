import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Zap, MapPin, Calendar, PieChart, TrendingUp, TrendingDown, Clock, Activity, Fuel, Users, Receipt, ArrowUpRight, BarChart3, Lock, ShieldCheck, Globe, Package, Cpu, ChevronRight } from 'lucide-react';

const StatCard = ({ icon: Icon, color, change, value, label, delay }) => (
  <div className={`p-6 bg-[#0a1628] border border-[#00d2b4]/10 rounded-2xl relative overflow-hidden group hover:border-[#00d2b4]/40 hover:-translate-y-1 transition-all animate-fade-up ${delay}`}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d2b4] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex justify-between items-start mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-[18px] ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className={`text-[12px] font-medium flex items-center gap-1 ${change.startsWith('↑') ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </div>
    </div>
    <div className="font-syne text-[30px] font-extrabold text-[#e2eaf8] leading-none mb-1.5">{value}</div>
    <div className="text-[13px] text-[#7a9bbf] font-medium">{label}</div>
  </div>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-center mb-6 px-1">
    <div>
      <h3 className="font-syne font-bold text-[15px] text-white tracking-tight">{title}</h3>
      <p className="text-[12px] text-[#7a9bbf] mt-0.5">{subtitle}</p>
    </div>
    {action && <button className="text-[12px] font-medium text-[#00d2b4] hover:opacity-70 transition-all">{action}</button>}
  </div>
);

const AdminDashboard = () => {
  return (
    <AdminLayout title="Dashboard">
      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Zap} color="bg-[#00d2b4]/10 text-[#00d2b4]" change="↑ 0.0%" value="0" label="Active Sessions" delay="delay-0" />
        <StatCard icon={MapPin} color="bg-[#0094ff]/10 text-[#0094ff]" change="↑ 0.0%" value="0" label="Stations Active" delay="delay-75" />
        <StatCard icon={Calendar} color="bg-amber-500/10 text-amber-500" change="↑ 0.0%" value="0" label="Bookings Month" delay="delay-150" />
        <StatCard icon={PieChart} color="bg-purple-500/10 text-purple-500" change="↑ 0.0%" value="Rs. 0.00" label="Comm. Earned" delay="delay-200" />
      </div>

      {/* ── CHARTS + COMMISSION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-[#0a1628] border border-[#00d2b4]/10 rounded-2xl overflow-hidden p-6 hover:border-[#00d2b4]/30 transition-all opacity-40">
          <SectionHeader title="Revenue Overview" subtitle="Monthly charging revenue vs. platform commission" action="View Details →" />
          <div className="h-[120px] flex items-end gap-2.5 mt-8 px-2">
            {[20, 35, 48, 28, 45, 32, 50].map((v, i) => (
              <div key={i} className="flex-1 group relative flex items-end gap-1.5 h-full">
                <div style={{ height: `${v}%` }} className="flex-1 bg-gradient-to-t from-[#00d2b4]/30 to-[#00d2b4] rounded-t-[4px] group-hover:brightness-125 transition-all cursor-pointer"></div>
                <div style={{ height: `${v * 0.25}%` }} className="flex-1 bg-gradient-to-t from-[#0094ff]/30 to-[#0094ff] rounded-t-[4px] group-hover:brightness-125 transition-all cursor-pointer"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2 text-[10px] text-[#3a5a7a] font-bold uppercase tracking-widest">
            {['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map(m => <span key={m}>{m}</span>)}
          </div>
        </div>

        <div className="bg-[#0a1628] border border-[#00d2b4]/10 rounded-2xl p-6 hover:border-[#00d2b4]/30 transition-all">
          <SectionHeader title="Commission Rate" subtitle="Platform fee allocation" />
          <div className="flex justify-center p-6 mb-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#3a5a7a" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-syne font-black text-[24px] text-[#3a5a7a]">0%</div>
                <div className="text-[10px] font-bold text-[#3a5a7a] uppercase tracking-wider">Fee</div>
              </div>
            </div>
          </div>
          <div className="space-y-3.5 border-t border-[#00d2b4]/10 pt-6 mt-4">
            <div className="flex justify-between text-[13px]"><span className="text-[#7a9bbf] font-medium">Total Rev</span><span className="text-white font-bold">Rs. 0.00</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-[#7a9bbf] font-medium">To Providers</span><span className="text-white font-bold">Rs. 0.00</span></div>
            <div className="flex justify-between text-[13px] font-bold pt-1.5 border-t border-white/5"><span className="text-[#00d2b4]">Platform Fee</span><span className="text-[#00d2b4]">Rs. 0.00</span></div>
          </div>
        </div>
      </div>

      {/* ── MAP + ACTIVITY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#0a1628] border border-[#00d2b4]/10 rounded-2xl overflow-hidden p-6 hover:border-[#00d2b4]/30 transition-all">
          <SectionHeader title="Live Station Map" subtitle="Real-time status across charging nodes" action="Expand Map →" />
          <div className="h-[240px] bg-[#0f2040] rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(0,210,180,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,180,0.1) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            {[
              { top: '30%', left: '20%', col: '#00d2b4' },
              { top: '50%', left: '45%', col: '#00d2b4' },
              { top: '25%', left: '70%', col: '#0094ff' },
              { top: '65%', left: '30%', col: '#f59e0b' },
              { top: '75%', left: '60%', col: '#00d2b4' }
            ].map((p, i) => (
              <div key={i} className="absolute w-3 h-3 rounded-full shadow-[0_0_12px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-150 transition-all animate-pulse"
                style={{ top: p.top, left: p.left, backgroundColor: p.col, boxShadow: `0 0 15px ${p.col}` }}></div>
            ))}
            <div className="absolute bottom-4 left-4 p-3.5 bg-[#050c14]/90 backdrop-blur-md border border-white/5 rounded-lg">
              <div className="text-[11px] font-bold text-white mb-2 uppercase tracking-wide">Hub Monitoring</div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#7a9bbf] uppercase"><div className="w-1.5 h-1.5 rounded-full bg-[#00d2b4]"></div> Avail</div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#7a9bbf] uppercase"><div className="w-1.5 h-1.5 rounded-full bg-[#0094ff]"></div> In Use</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            {[
              { i: Fuel, l: 'Add Node' },
              { i: Calendar, l: 'Book Slot' },
              { i: Users, l: 'Add User' },
              { i: BarChart3, l: 'Analytics' }
            ].map(q => (
              <button key={q.l} className="flex flex-col items-center gap-2.5 p-4 bg-[#0f2040]/30 border border-white/5 rounded-xl hover:bg-[#00d2b4]/10 hover:border-[#00d2b4]/30 transition-all group">
                <q.i className="w-5 h-5 text-[#3a5a7a] group-hover:text-[#00d2b4]" />
                <span className="text-[11px] font-medium text-[#7a9bbf] group-hover:text-white">{q.l}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#0a1628] border border-[#00d2b4]/10 rounded-2xl p-6 hover:border-[#00d2b4]/30 transition-all">
          <SectionHeader title="System Telemetry" subtitle="Active sectors" action="View All" />
          <div className="space-y-6 opacity-30">
            {[
              { dot: 'bg-green-500', t: 'Hardware: Grid Node initialized', s: 'Just now' },
              { dot: 'bg-blue-500', t: 'Security: Layer 1 monitoring active', s: '5m ago' },
              { dot: 'bg-[#00d2b4]', t: 'Session: Global keys synchronized', s: '10m ago' }
            ].map((a, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 animate-pulse ${a.dot}`}></div>
                <div className="flex-1 border-b border-white/5 pb-4 group-last:border-none">
                  <p className="text-[13px] text-[#e2eaf8] font-medium leading-relaxed">{a.t}</p>
                  <p className="text-[10px] text-[#3a5a7a] font-bold uppercase tracking-widest mt-1.5">{a.s}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RECENT BOOKINGS TABLE ── */}
      <div className="bg-[#0a1628] border border-[#00d2b4]/10 rounded-2xl overflow-hidden hover:border-[#00d2b4]/30 transition-all">
        <div className="p-6 border-b border-[#00d2b4]/10 flex flex-wrap justify-between items-center gap-4">
          <SectionHeader title="System Transactions" subtitle="Latest global grid activities verified" />
          <div className="flex gap-3">
            <button className="px-5 py-2.5 rounded-xl bg-[#00d2b4] text-[#050c14] text-[11px] font-black hover:brightness-110 transition-all uppercase tracking-widest shadow-lg shadow-[#00d2b4]/20">+ New Slot</button>
          </div>
        </div>
        <div className="p-20 text-center opacity-30 text-[#7a9bbf] italic font-medium">
             Scanning for session identities in current sector...
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
