import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  AreaChart, Map as MapIcon, Fuel, Users as UsersIcon, 
  Receipt, PieChart, Search, Filter, Plus, 
  MoreHorizontal, CheckCircle2, AlertCircle, Clock,
  MapPin, Zap, Calendar, ArrowUpRight, TrendingUp, X, Navigation, LocateControl
} from 'lucide-react';

const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-wrap justify-between items-end gap-6 mb-10 pl-1">
    <div>
      <h1 className="font-syne text-4xl font-black text-white italic uppercase tracking-tight">{title} <span className="text-[#00d2b4]">Node.</span></h1>
      <p className="text-[#7a9bbf] mt-2 font-medium italic opacity-60 tracking-wide">{subtitle}</p>
    </div>
    {action && (
      <button className="px-6 py-3 rounded-2xl bg-[#00d2b4] text-[#050c14] text-[10px] font-black hover:brightness-110 transition-all uppercase tracking-[4px] shadow-xl shadow-[#00d2b4]/20 flex items-center gap-2">
        <Plus className="w-4 h-4" /> {action}
      </button>
    )}
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <h3 className="font-syne font-bold text-[15px] text-white tracking-tight italic uppercase">{title}</h3>
    <p className="text-[12px] text-[#7a9bbf] mt-0.5 font-medium italic opacity-60">{subtitle}</p>
  </div>
);

// ── STATION MAP (INTEGRATED GOOGLE MAPS STYLE) ──
export const StationMap = () => {
  const [search, setSearch] = useState('Colombo, Sri Lanka');

  return (
    <AdminLayout title="Grid Overlay">
      <PageHeader title="Global Map" subtitle="Real-time geographic distribution of VoltWay assets powered by Google Maps." />
      
      <div className="bg-[#0a1628] border border-[#00d2b4]/10 rounded-[40px] overflow-hidden hover:border-[#00d2b4]/30 transition-all border-2 border-dashed">
        {/* Search & Intelligence Bar */}
        <div className="p-8 border-b border-[#00d2b4]/10 flex flex-wrap justify-between items-center gap-6 bg-white/2">
           <div className="flex-1 min-w-[300px] relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3a5a7a] group-focus-within:text-[#00d2b4] transition-colors" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Nearby Nodes or Enter Address..." 
                className="w-full bg-[#0f2040] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:outline-none focus:border-[#00d2b4] transition-all italic font-medium" 
              />
           </div>
           <div className="flex gap-4">
              <button className="px-6 py-3.5 rounded-xl bg-[#00d2b4]/10 border border-[#00d2b4]/20 text-[10px] font-black text-[#00d2b4] uppercase tracking-widest flex items-center gap-2">
                 <LocateControl className="w-4 h-4" /> Near Me
              </button>
              <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#00d2b4]/20 hover:text-[#00d2b4] transition-all">
                 <Filter className="w-4 h-4" />
              </button>
           </div>
        </div>

        {/* Real Google Maps Integration Frame */}
        <div className="h-[600px] relative">
           <iframe 
              title="Google Maps"
              className="w-full h-full grayscale-[0.8] invert-[0.9] opacity-70"
              frameBorder="0" 
              scrolling="no" 
              marginHeight="0" 
              marginWidth="0" 
              src={`https://maps.google.com/maps?q=${encodeURIComponent(search)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
           ></iframe>
           
           {/* Custom UI Overlays */}
           <div className="absolute top-6 left-6 space-y-3 pointer-events-none">
              <div className="p-5 bg-[#050c14]/90 backdrop-blur-xl border border-[#00d2b4]/20 rounded-2xl shadow-2xl pointer-events-auto">
                 <div className="text-[10px] font-black text-white mb-3 uppercase tracking-[3px]">Grid Node Analytics</div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] font-bold text-[#7a9bbf] italic"><div className="w-2 h-2 rounded-full bg-[#00d2b4] shadow-[0_0_8px_#00d2b4]"></div> Colombo Hub-01 (Active)</div>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-[#7a9bbf] italic"><div className="w-2 h-2 rounded-full bg-[#0094ff] shadow-[0_0_8px_#0094ff]"></div> Gampaha Node (Occupied)</div>
                 </div>
              </div>
           </div>

           <div className="absolute bottom-6 right-6 p-4 bg-[#0a1628]/95 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl pointer-events-auto max-w-[200px]">
              <div className="flex items-center gap-3 mb-3">
                 <Navigation className="w-4 h-4 text-[#00d2b4]" />
                 <span className="text-[11px] font-black text-white uppercase tracking-widest italic">Routing Node</span>
              </div>
              <p className="text-[10px] text-[#7a9bbf] font-medium opacity-60 italic mb-4 leading-relaxed">System will prioritize nodes within 5km radius of your current identity.</p>
              <button className="w-full py-3 rounded-xl bg-[#00d2b4] text-[#050c14] text-[9px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#00d2b4]/20">Establish Link</button>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// ── STATIONS ──
export const Stations = () => (
  <AdminLayout title="Grid Assets">
    <PageHeader title="Charging Registry" subtitle="Manage and monitor national charging hub infrastructure." action="Establish New Node" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-[#0a1628] border border-[#00d2b4]/10 rounded-[32px] p-8 hover:border-[#00d2b4]/40 transition-all group border-2 border-dashed">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00d2b4] to-[#0094ff] flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
               <Fuel className="w-7 h-7 text-white" />
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-[9px] font-black uppercase tracking-widest text-green-500">Online</span>
          </div>
          <h3 className="font-syne text-xl font-black text-white italic uppercase tracking-tight mb-2 opacity-80 group-hover:opacity-100 group-hover:text-[#00d2b4] transition-all">Node #{400 + i} HUB</h3>
          <p className="text-[12px] text-[#7a9bbf] font-medium opacity-60 mb-6 italic">Secure Sector A{i} - Regional Grid Node</p>
          <div className="space-y-4 pt-6 border-t border-white/5">
             <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-[#3a5a7a] italic"><div>UPTIME</div><div className="text-[#00d2b4]">99.9%</div></div>
             <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-[#3a5a7a] italic"><div>HEALTH</div><div className="text-white">OPTIMAL</div></div>
          </div>
        </div>
      ))}
    </div>
  </AdminLayout>
);

// ── BOOK SLOT (MATCHING IMAGE LAYOUT) ──
export const BookSlot = () => (
  <AdminLayout title="Grid Allocation">
    <PageHeader title="Book a Slot" subtitle="Reserve charging resources across the VoltWay network." />
    
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Booking Form */}
      <div className="lg:col-span-7 bg-[#0a1628]/40 border border-[#00d2b4]/10 rounded-[32px] p-10 hover:border-[#00d2b4]/20 transition-all border-2 border-dashed">
        <div className="space-y-8">
          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-[3px] text-[#3a5a7a] ml-1">Charging Station</label>
             <select className="w-full bg-[#0f2040] border border-white/5 rounded-2xl p-5 text-white text-sm focus:outline-none focus:border-[#00d2b4] transition-all appearance-none cursor-pointer italic font-medium">
                <option>Select Hub Node...</option>
                <option>VoltWay Central — Rs. 120/kWh (DC Fast)</option>
                <option>Colombo Downtown — Rs. 95/kWh (AC)</option>
             </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-[3px] text-[#3a5a7a] ml-1">Date</label>
               <input type="date" className="w-full bg-[#0f2040] border border-white/5 rounded-2xl p-5 text-white text-sm focus:outline-none focus:border-[#00d2b4] transition-all italic font-medium" />
            </div>
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-[3px] text-[#3a5a7a] ml-1">Start Time</label>
               <input type="time" className="w-full bg-[#0f2040] border border-white/5 rounded-2xl p-5 text-white text-sm focus:outline-none focus:border-[#00d2b4] transition-all italic font-medium" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-[3px] text-[#3a5a7a] ml-1">Duration</label>
               <select className="w-full bg-[#0f2040] border border-white/5 rounded-2xl p-5 text-white text-sm focus:outline-none focus:border-[#00d2b4] transition-all appearance-none cursor-pointer italic font-medium">
                  <option>0.5 hours</option>
                  <option>1.0 hours</option>
                  <option>1.5 hours</option>
                  <option>2.0 hours</option>
               </select>
            </div>
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-[3px] text-[#3a5a7a] ml-1">EV Owner</label>
               <input type="text" placeholder="Owner Identity..." className="w-full bg-[#0f2040] border border-white/5 rounded-2xl p-5 text-white text-sm focus:outline-none focus:border-[#00d2b4] transition-all placeholder:text-[#3a5a7a] italic font-medium" />
            </div>
          </div>

          <div className="bg-[#050c14]/50 border border-white/5 rounded-[28px] p-8 space-y-5">
             <div className="text-[11px] font-black uppercase tracking-[4px] text-white">Price Estimate</div>
             <div className="space-y-3">
                <div className="flex justify-between text-[13px] font-medium text-[#7a9bbf] italic"><span>Rate</span><span>Rs. 120 / kWh</span></div>
                <div className="flex justify-between text-[13px] font-medium text-[#7a9bbf] italic"><span>Duration</span><span>1h 30m</span></div>
                <div className="flex justify-between text-[13px] font-medium text-[#7a9bbf] italic"><span>Est. Energy</span><span>~22 kWh</span></div>
                <div className="flex justify-between text-[13px] font-medium text-[#7a9bbf] italic"><span>Service Fee</span><span>Rs. 500.00</span></div>
             </div>
             <div className="pt-5 border-t border-white/5 flex justify-between items-center font-bold">
                <span className="text-white text-lg">Total</span>
                <span className="text-[#00d2b4] text-2xl font-black italic">Rs. 3,140</span>
             </div>
          </div>

          <div className="flex gap-4 pt-4">
             <button className="flex-1 py-5 rounded-2xl bg-white/5 text-[#7a9bbf] text-[10px] font-black uppercase tracking-[4px] hover:text-white transition-all">Cancel</button>
             <button className="flex-[2] py-5 rounded-2xl bg-gradient-to-r from-[#00d2b4] to-[#00d2b4]/80 text-[#050c14] text-[10px] font-black uppercase tracking-[4px] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#00d2b4]/20">
                <Zap className="w-4 h-4 fill-current" /> Confirm Booking
             </button>
          </div>
        </div>
      </div>

      {/* Right Column: Status Table */}
      <div className="lg:col-span-5 bg-[#0a1628]/40 border border-[#00d2b4]/10 rounded-[32px] overflow-hidden hover:border-[#00d2b4]/20 transition-all border-2 border-dashed h-full">
         <table className="w-full text-left">
            <thead>
               <tr className="bg-[#0f2040]/30 border-b border-white/5">
                  <th className="px-8 py-5 text-[10px] font-black text-[#3a5a7a] uppercase tracking-[3px]">Owner</th>
                  <th className="px-8 py-5 text-[10px] font-black text-[#3a5a7a] uppercase tracking-[3px]">Time</th>
                  <th className="px-8 py-5 text-[10px] font-black text-[#3a5a7a] uppercase tracking-[3px]">Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5 italic">
               {[
                 { u: 'James Kim', t: 'Today 09:30', s: 'Active', c: 'text-green-500 bg-green-500/10 border-green-500/20' },
                 { u: 'Sarah Chen', t: 'Today 11:00', s: 'Pending', c: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
                 { u: 'Mike Adams', t: 'Today 13:30', s: 'Pending', c: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
                 { u: 'Lisa Park', t: 'Tomorrow 08:00', s: 'Pending', c: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
                 { u: 'Ryan Ng', t: 'Tomorrow 10:30', s: 'Pending', c: 'text-amber-500 bg-amber-500/10 border-amber-500/20' }
               ].map((row, i) => (
                 <tr key={i} className="hover:bg-white/2 transition-all group">
                    <td className="px-8 py-6 text-[14px] font-bold text-white group-hover:text-[#00d2b4] transition-colors">{row.u}</td>
                    <td className="px-8 py-6 text-[13px] text-[#7a9bbf] font-medium opacity-60 uppercase tracking-tight">{row.t}</td>
                    <td className="px-8 py-6">
                       <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${row.c}`}>
                          • {row.s}
                       </span>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
         <div className="p-10 text-center text-[#3a5a7a] font-black italic tracking-[5px] text-[10px] uppercase opacity-40">
            Monitoring Global Sector A1...
         </div>
      </div>
    </div>
  </AdminLayout>
);

// ── USERS ──
export const UserManagement = () => (
  <AdminLayout title="Identity Registry">
    <PageHeader title="Entity Control" subtitle="Oversee managed user identities across the secure sector." action="Invite Entry" />
    <div className="bg-[#0a1628] border border-[#00d2b4]/10 rounded-[40px] overflow-hidden hover:border-[#00d2b4]/30 transition-all shadow-2xl border-2 border-dashed">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#0f2040]/30 border-b border-[#00d2b4]/10">
              <th className="px-10 py-6 text-[10px] font-black text-[#3a5a7a] uppercase tracking-[3px]">Identity Node</th>
              <th className="px-10 py-6 text-[10px] font-black text-[#3a5a7a] uppercase tracking-[3px]">Auth Status</th>
              <th className="px-10 py-6 text-[10px] font-black text-[#3a5a7a] uppercase tracking-[3px]">Activity</th>
              <th className="px-10 py-6 text-[10px] font-black text-[#3a5a7a] uppercase tracking-[3px]">Sector Root</th>
              <th className="px-10 py-6 text-[10px] font-black text-[#3a5a7a] uppercase tracking-[3px]">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 opacity-60">
             {[1,2,3].map(i => (
               <tr key={i} className="hover:bg-[#00d2b4]/5 transition-all cursor-crosshair">
                 <td className="px-10 py-6">
                    <div className="flex items-center gap-4 italic"><div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs text-[#00d2b4]">S{i}</div><div><div className="text-white font-bold">SYSTEM_IDENTITY_{i}102</div><div className="text-[10px] font-black text-[#3a5a7a] tracking-widest mt-1 uppercase">Awaiting Registry</div></div></div>
                 </td>
                 <td className="px-10 py-6"><span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest text-amber-500">Pending</span></td>
                 <td className="px-10 py-6 text-[12px] font-bold text-[#7a9bbf] italic">Not Detected</td>
                 <td className="px-10 py-6 text-[12px] font-bold text-white italic">Sector A1</td>
                 <td className="px-10 py-6"><MoreHorizontal className="w-5 h-5 text-[#3a5a7a]" /></td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
      <div className="p-12 text-center text-[#3a5a7a] font-black italic tracking-[5px] text-[10px] uppercase">Registry Awaiting Hardware Sync...</div>
    </div>
  </AdminLayout>
);

// ── TRANSACTIONS ──
export const Transactions = () => (
  <AdminLayout title="Grid Ledger">
    <PageHeader title="System Flows" subtitle="Financial telemetry across the VoltWay national sector." />
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12 pl-1">
       {[
         { icon: Zap, label: 'Ledger Sum', value: 'Rs. 0.00', color: 'text-[#00d2b4] bg-[#00d2b4]/10' },
         { icon: Receipt, label: 'Provision Keys', value: '0 TOTAL', color: 'text-blue-400 bg-blue-400/10' },
         { icon: TrendingUp, label: 'Sector Yield', value: '0.0% AVG', color: 'text-purple-400 bg-purple-400/10' },
         { icon: MapPin, label: 'Nodes Active', value: '342 NODES', color: 'text-amber-500 bg-amber-500/10' }
       ].map((s, i) => (
         <div key={i} className="bg-[#0a1628] border border-[#00d2b4]/10 rounded-[32px] p-8 hover:border-[#00d2b4]/30 transition-all border-2 border-dashed">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-xl ${s.color}`}><s.icon className="w-6 h-6" /></div>
            <div className="text-[9px] font-black text-[#3a5a7a] uppercase tracking-[3px] mb-2">{s.label}</div>
            <div className="text-2xl font-syne font-black text-white italic">{s.value}</div>
         </div>
       ))}
    </div>
    <div className="bg-[#0a1628] border border-[#00d2b4]/10 rounded-[40px] overflow-hidden hover:border-[#00d2b4]/30 transition-all border-2 border-dashed p-20 text-center">
       <div className="w-24 h-24 rounded-[32px] bg-white/5 flex items-center justify-center mx-auto mb-8 rotate-12 relative">
          <Receipt className="w-10 h-10 text-[#00d2b4]" />
          <div className="absolute inset-0 rounded-[32px] border border-[#00d2b4]/20 animate-pulse"></div>
       </div>
       <h3 className="font-syne text-2xl font-black text-white italic uppercase tracking-tight mb-4">Ledger Operational.</h3>
       <p className="text-[#7a9bbf] font-medium max-w-sm mx-auto italic opacity-60">Scanning VoltWay national grid for verified session keys. Telemetry node state: READY.</p>
    </div>
  </AdminLayout>
);

// ── ANALYTICS ──
export const Analytics = () => (
  <AdminLayout title="Grid Intelligence">
    <PageHeader title="Telemetry Node" subtitle="Deep data analytics and grid performance telemetry." />
    <div className="bg-[#0a1628] border border-[#00d2b4]/10 rounded-[40px] p-12 hover:border-[#00d2b4]/30 transition-all border-2 border-dashed mb-8">
       <div className="flex justify-between items-center mb-12">
          <SectionHeader title="Grid Output Efficiency" subtitle="Temporal yield analysis across sector hubs." />
          <div className="flex gap-4">
             {['24H', '7D', '30D', 'Q1'].map(p => <button key={p} className="px-5 py-2 rounded-xl bg-white/5 text-[10px] font-black text-[#7a9bbf] hover:text-[#00d2b4] transition-all tracking-widest">{p}</button>)}
          </div>
       </div>
       <div className="h-[300px] flex items-end gap-2 group opacity-40 italic">
          {[40, 60, 45, 80, 55, 90, 70, 100, 65, 85, 45, 95].map((v, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-[#00d2b4]/5 to-[#00d2b4] rounded-t-xl transition-all cursor-pointer hover:brightness-110" style={{ height: `${v}%` }}>
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-[#00d2b4] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">SECTOR_ID_A{i}</div>
            </div>
          ))}
       </div>
    </div>
  </AdminLayout>
);

// ── COMMISSION ──
export const Commission = () => (
  <AdminLayout title="System Overhead">
    <PageHeader title="Yield Allocation" subtitle="Manage platform fees and grid node commission splits." />
    <div className="max-w-4xl mx-auto bg-[#0a1628] border border-[#00d2b4]/10 rounded-[48px] p-12 hover:border-[#00d2b4]/30 transition-all border-2 border-dashed">
       <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-[32px] bg-[#00d2b4]/10 border border-[#00d2b4]/20 flex items-center justify-center mx-auto mb-6">
             <PieChart className="w-10 h-10 text-[#00d2b4]" />
          </div>
          <h2 className="font-syne text-3xl font-black text-white italic uppercase tracking-tighter mb-2">GRID COMMISSION PROTOCOLS</h2>
          <p className="text-[#3a5a7a] font-black uppercase tracking-[5px] text-[10px]">Awaiting Global Settlement Sync...</p>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-[#00d2b4]/20 transition-all opacity-60">
             <div className="text-[10px] font-black text-[#3a5a7a] uppercase tracking-widest mb-4">BASE PLATFORM OVERHEAD</div>
             <div className="text-4xl font-syne font-black text-white italic">25.0%</div>
          </div>
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-[#00d2b4]/20 transition-all opacity-60">
             <div className="text-[10px] font-black text-[#3a5a7a] uppercase tracking-widest mb-4">MERCHANT YIELD SPLIT</div>
             <div className="text-4xl font-syne font-black text-white italic">75.0%</div>
          </div>
       </div>

       <button className="w-full py-6 rounded-[32px] bg-[#0f2040] text-[#7a9bbf] font-black uppercase tracking-[5px] text-xs hover:text-white transition-all border border-white/5 border-dashed">PENDING GRID SETTLEMENT</button>
    </div>
  </AdminLayout>
);
