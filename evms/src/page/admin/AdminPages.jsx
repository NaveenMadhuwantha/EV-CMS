import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  AreaChart, Map as MapIcon, Fuel, Users as UsersIcon, 
  Receipt, PieChart, Search, Filter, Plus, 
  MoreHorizontal, CheckCircle2, AlertCircle, Clock,
  MapPin, Zap, Calendar, ArrowUpRight, TrendingUp, X, Navigation, Locate,
  ChevronRight, Globe, Activity
} from 'lucide-react';

const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-wrap justify-between items-end gap-6 mb-12 pl-2 font-manrope">
    <div>
      <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tighter uppercase leading-none">
        {title}
      </h1>
      <p className="text-[#8AAFC8] mt-3 font-medium opacity-70 font-inter text-[15px]">{subtitle}</p>
    </div>
    {action && (
      <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-[#0A8F6A] text-[#050c14] text-[12px] font-extrabold hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest shadow-xl shadow-emerald-500/10 flex items-center gap-3">
        <Plus className="w-4 h-4" strokeWidth={3} /> {action}
      </button>
    )}
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-8 font-manrope">
    <h3 className="font-extrabold text-[18px] text-white tracking-tight uppercase leading-none">{title}</h3>
    <p className="text-[13px] text-[#8AAFC8] mt-2 font-medium opacity-60 leading-relaxed font-inter tracking-tight">{subtitle}</p>
  </div>
);

// ── STATION MAP ──
export const StationMap = () => {
  const [search, setSearch] = useState('Colombo, Sri Lanka');
  const [query, setQuery] = useState('');

  const stations = [
    { id: 'VWC-01', name: 'VoltWay Central Hub', loc: 'Colombo 07', type: 'DC Fast' },
    { id: 'VWC-02', name: 'Downtown District Hub', loc: 'Galle Road', type: 'AC Standard' },
    { id: 'VWC-03', name: 'Airport Node Cluster', loc: 'Katunayake', type: 'DC Hyper' },
    { id: 'VWC-04', name: 'Negombo Site Node', loc: 'Beach Road', type: 'AC Standard' },
  ];

  const filteredStations = stations.filter(s => 
    s.name.toLowerCase().includes(query.toLowerCase()) || 
    s.loc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AdminLayout title="Station Map">
      <PageHeader title="Station Map" subtitle="View and manage all charging stations on the map." />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-inter">
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[32px] p-8 hover:border-[#00d2b4]/30 transition-all shadow-xl">
              <SectionHeader title="Station Search" subtitle="Find specific stations by name or location." />
              <div className="relative group mb-8">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#4E7A96] group-focus-within:text-[#00d2b4] transition-colors" />
                 <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Stations..." 
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white text-[14px] focus:outline-none focus:border-[#00d2b4] transition-all font-bold placeholder:text-[#4E7A96] placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]" 
                 />
              </div>

              <div className="space-y-4 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                 {filteredStations.map((s) => (
                    <button 
                       key={s.id}
                       onClick={() => setSearch(`${s.name}, ${s.loc}`)}
                       className="w-full p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#00d2b4]/40 hover:bg-[#00d2b4]/5 transition-all group text-left shadow-sm"
                    >
                       <div className="flex justify-between items-start mb-2 group font-manrope">
                          <span className="text-[15px] font-extrabold text-white group-hover:text-[#00d2b4] transition-colors tracking-tight leading-none uppercase">{s.name}</span>
                          <span className="text-[9px] font-black text-[#00d2b4] px-2.5 py-1.5 rounded-lg bg-[#00d2b4]/10 uppercase tracking-widest border border-emerald-500/10 shrink-0 font-inter">{s.id}</span>
                       </div>
                       <div className="flex items-center gap-2.5 text-[11px] text-[#8AAFC8] font-bold uppercase tracking-widest opacity-60">
                          <MapPin className="w-3.5 h-3.5" /> {s.loc}
                       </div>
                    </button>
                 ))}
              </div>
           </div>

           <div className="bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-3xl p-8 transition-all hover:bg-blue-500/5 hover:border-blue-500/20 shadow-sm">
              <div className="flex items-center gap-5">
                 <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner"><Globe className="w-6 h-6 shadow-[0_0_15px_#3b82f6]" /></div>
                 <div>
                    <div className="text-[11px] font-bold text-white uppercase tracking-widest font-manrope">Global Registry</div>
                    <div className="text-[10px] text-[#4E7A96] font-extrabold uppercase mt-1 opacity-60 tracking-tighter">Verified Active Clusters</div>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-8 bg-[#0a1628]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[48px] overflow-hidden hover:border-[#00d2b4]/30 transition-all shadow-2xl h-[740px] relative">
           <iframe 
              title="Google Maps"
              className="w-full h-full grayscale-[0.5] invert-[0.8] opacity-90 brightness-[0.8]"
              frameBorder="0" 
              src={`https://maps.google.com/maps?q=${encodeURIComponent(search)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
           ></iframe>

           <div className="absolute top-8 right-8 p-6 bg-[#050c14]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl font-manrope min-w-[240px]">
              <div className="text-[10px] font-bold text-[#4E7A96] mb-2 uppercase tracking-widest opacity-60">SELECTED LOCATION</div>
              <div className="text-[17px] font-extrabold text-white tracking-tight leading-none uppercase group-hover:text-[#00d2b4] transition-colors">{search}</div>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                 <Activity className="w-3.5 h-3.5" /> Network Status: Optimal
              </div>
           </div>

           <div className="absolute bottom-8 left-8 p-5 bg-[#0a1628]/95 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl font-inter">
              <div className="flex gap-8">
                 <div className="flex items-center gap-3 text-[10px] font-bold text-[#8AAFC8] uppercase tracking-widest"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse"></div> ONLINE</div>
                 <div className="flex items-center gap-3 text-[10px] font-bold text-[#8AAFC8] uppercase tracking-widest"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6]"></div> OCCUPIED</div>
                 <div className="flex items-center gap-3 text-[10px] font-bold text-[#8AAFC8] uppercase tracking-widest"><div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_12px_#f59e0b]"></div> ALERT</div>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// ── STATIONS ──
export const Stations = () => (
  <AdminLayout title="Stations">
    <PageHeader title="Stations" subtitle="Manage your charging station assets." action="Add Station" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-inter">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[40px] p-10 hover:border-[#00d2b4]/50 transition-all group shadow-xl">
          <div className="flex justify-between items-start mb-8 font-inter">
            <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#00d2b4] to-[#0094ff] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
               <Fuel className="w-8 h-8 text-white shadow-sm" strokeWidth={2.5} />
            </div>
            <span className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/10 text-[10px] font-bold uppercase tracking-widest text-emerald-400">STATUS: LIVE</span>
          </div>
          <h3 className="font-manrope text-2xl font-extrabold text-white tracking-tight mb-3 group-hover:text-[#00d2b4] transition-colors uppercase leading-none">Station {i}40</h3>
          <p className="text-[14px] text-[#8AAFC8] font-medium opacity-60 mb-10 font-inter leading-relaxed">Central Sector A{i} - Main Charging Hub</p>
          <div className="space-y-5 pt-8 border-t border-white/5 font-inter">
             <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-[3px] text-[#4E7A96]"><div>Efficiency</div><div className="text-emerald-400 font-extrabold">99%</div></div>
             <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-[3px] text-[#4E7A96]"><div>Condition</div><div className="text-white font-extrabold">OPTIMAL</div></div>
          </div>
        </div>
      ))}
    </div>
  </AdminLayout>
);

// ── BOOK SLOT ──
export const BookSlot = () => (
  <AdminLayout title="Bookings">
    <PageHeader title="Bookings" subtitle="View and manage slot bookings." />
    
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start font-inter">
      <div className="lg:col-span-7 bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[40px] p-12 hover:border-[#00d2b4]/30 transition-all shadow-xl font-inter">
        <div className="space-y-10">
          <div className="space-y-4">
             <label className="text-[11px] font-bold uppercase tracking-widest text-[#4E7A96] ml-2">Select Station</label>
             <div className="relative font-manrope">
                <select className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 pl-7 text-white text-[16px] focus:outline-none focus:border-[#00d2b4] transition-all appearance-none cursor-pointer font-bold uppercase tracking-tight">
                   <option>VoltWay Central Hub</option>
                   <option>Downtown District — Rs. 140/kWh</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#4E7A96] pointer-events-none text-xs">▼</div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-inter">
            <div className="space-y-4">
               <label className="text-[11px] font-bold uppercase tracking-widest text-[#4E7A96] ml-2">Date</label>
               <input type="date" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-[#00d2b4] transition-all font-bold font-inter [color-scheme:dark]" />
            </div>
            <div className="space-y-4">
               <label className="text-[11px] font-bold uppercase tracking-widest text-[#4E7A96] ml-2">Time</label>
               <input type="time" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-[#00d2b4] transition-all font-bold font-inter [color-scheme:dark]" />
            </div>
          </div>

          <div className="bg-[#050c14]/80 border-2 border-dashed border-[#00d2b4]/10 rounded-3xl p-10 space-y-6 shadow-sm">
             <div className="text-[11px] font-bold uppercase tracking-[4px] text-[#00d2b4] mb-8 opacity-80">Booking Summary</div>
             <div className="space-y-4 font-inter">
                <div className="flex justify-between items-center text-[15px] font-medium text-[#8AAFC8]"><span>Base Rate</span><span className="text-white font-extrabold font-manrope">Rs. 120.00 / Hr</span></div>
                <div className="flex justify-between items-center text-[15px] font-medium text-[#8AAFC8]"><span>Duration</span><span className="text-white font-extrabold font-manrope">1.5 HR</span></div>
                <div className="flex justify-between items-center text-[15px] font-medium text-[#8AAFC8]"><span>Estimated Fee</span><span className="text-white font-extrabold font-manrope">Rs. 450.00</span></div>
             </div>
             <div className="pt-8 border-t border-white/10 flex justify-between items-center font-manrope">
                <span className="text-[#8AAFC8] text-[11px] font-bold uppercase tracking-widest">Total cost</span>
                <span className="text-[#00d2b4] text-4xl font-extrabold tracking-tighter">Rs. 2,850</span>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-4 font-manrope">
             <button className="flex-1 py-5 rounded-2xl bg-white/[0.03] border border-white/10 text-[#4E7A96] text-[12px] font-extrabold uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all">CANCEL</button>
             <button className="flex-[2] py-5 rounded-2xl bg-gradient-to-r from-[#10b981] to-[#0A8F6A] text-[#050c14] text-[13px] font-extrabold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/10">CONFIRM BOOKING</button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[40px] overflow-hidden hover:border-[#00d2b4]/20 transition-all shadow-xl font-inter">
         <table className="w-full text-left">
            <thead>
               <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-10 py-6 text-[10px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">Subscriber</th>
                  <th className="px-10 py-6 text-[10px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-manrope">
               {['Alice Silva', 'Mahes Perera', 'Kasun Fernando'].map((u, i) => (
                 <tr key={i} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-10 py-7">
                       <div className="font-extrabold text-white text-[16px] uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{u}</div>
                       <div className="text-[10px] text-[#4E7A96] font-bold mt-2 font-inter uppercase tracking-widest opacity-60">Today @ 14:00 SECTOR A1</div>
                    </td>
                    <td className="px-10 py-7">
                       <span className="px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 font-inter">PENDING</span>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  </AdminLayout>
);

export const UserManagement = () => (
  <AdminLayout title="Users">
    <PageHeader title="Users" subtitle="Manage user accounts and details." action="Add User" />
    <div className="bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[40px] overflow-hidden shadow-2xl font-inter">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-white/5 border-b border-white/5">
            <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">User Identity</th>
            <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">Status</th>
            <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
           {[1,2,3].map(i => (
             <tr key={i} className="hover:bg-white/[0.01] transition-all group">
               <td className="px-12 py-8 font-manrope">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#0f2040] border border-white/5 flex items-center justify-center font-extrabold text-[#00d2b4] shadow-inner text-lg">S{i}</div>
                    <div>
                        <div className="text-white font-extrabold text-[17px] uppercase tracking-tight group-hover:text-emerald-400 transition-colors">User_Account_{i}04</div>
                        <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-widest mt-1.5 opacity-60 font-inter">Colombo Cluster A1</div>
                    </div>
                  </div>
               </td>
               <td className="px-12 py-8"><span className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/10 text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-inter">VERIFIED</span></td>
               <td className="px-12 py-8"><button className="p-3 rounded-xl hover:bg-white/5 transition-all text-[#4E7A96] hover:text-white"><MoreHorizontal className="w-6 h-6" /></button></td>
             </tr>
           ))}
        </tbody>
      </table>
    </div>
  </AdminLayout>
);

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

export const Analytics = () => (
  <AdminLayout title="Analytics">
    <PageHeader title="Analytics" subtitle="Visual insights into system performance." />
    <div className="bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[48px] p-12 lg:p-16 hover:border-[#00d2b4]/30 transition-all font-inter shadow-2xl relative overflow-hidden">
       <div className="flex flex-wrap justify-between items-start gap-8 mb-12 relative z-10">
          <SectionHeader title="System Efficiency" subtitle="Daily efficiency analysis in real-time." />
          <div className="flex gap-4 font-manrope bg-white/5 p-2 rounded-2xl">
             {['24H', '7D', '30D'].map(p => <button key={p} className="px-6 py-2.5 rounded-xl text-[11px] font-extrabold text-[#4E7A96] hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest">{p}</button>)}
          </div>
       </div>
       <div className="h-[320px] flex items-end gap-3.5 opacity-40 mt-16 relative z-10">
          {[40, 60, 45, 80, 55, 90, 70, 100, 65, 85, 45, 95].map((v, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-[#00d2b4] to-[#0094ff] rounded-t-xl transition-all hover:scale-x-110 hover:brightness-125 shadow-2xl group relative" style={{ height: `${v}%` }}>
               <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-3 py-1 transparent rounded-lg text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold">{v}%</div>
            </div>
          ))}
       </div>
       <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#00d2b4]/5 to-transparent pointer-events-none opacity-40"></div>
    </div>
  </AdminLayout>
);

export const Commission = () => (
  <AdminLayout title="Commission">
    <PageHeader title="Commission" subtitle="Set and manage commission rates." />
    <div className="max-w-4xl mx-auto bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[48px] p-16 hover:border-[#00d2b4]/30 transition-all shadow-2xl font-inter relative overflow-hidden">
       <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d2b4]/5 blur-[120px] pointer-events-none"></div>
       <div className="text-center mb-16 relative z-10">
          <div className="w-24 h-24 rounded-[32px] bg-[#00d2b4]/10 flex items-center justify-center mx-auto mb-8 shadow-xl border border-emerald-500/10"><PieChart className="w-10 h-10 text-[#00d2b4] shadow-sm font-light" strokeWidth={1.5} /></div>
          <h2 className="font-manrope text-3xl font-extrabold text-white uppercase tracking-tighter mb-4 leading-none">Platform Commission</h2>
          <p className="text-[12px] font-bold text-[#4E7A96] uppercase tracking-[4px] leading-relaxed max-w-sm mx-auto opacity-70">Commission settings for the platform.</p>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 relative z-10">
          <div className="p-12 rounded-[40px] bg-white/[0.02] border-2 border-dashed border-white/5 hover:border-[#00d2b4]/20 transition-all opacity-80 group shadow-sm text-center">
             <div className="text-[11px] font-bold text-[#4E7A96] uppercase mb-5 tracking-[4px] opacity-60 font-inter group-hover:opacity-100 transition-opacity">Platform Rate</div>
             <div className="text-6xl font-extrabold text-white font-manrope tracking-tighter">25.0<span className="text-emerald-400 opacity-50">%</span></div>
          </div>
          <div className="p-12 rounded-[40px] bg-white/[0.02] border-2 border-dashed border-white/5 hover:border-blue-500/20 transition-all opacity-80 group shadow-sm text-center">
             <div className="text-[11px] font-bold text-[#4E7A96] uppercase mb-5 tracking-[4px] opacity-60 font-inter group-hover:opacity-100 transition-opacity">Provider Yield</div>
             <div className="text-6xl font-extrabold text-white font-manrope tracking-tighter">75.0<span className="text-blue-500 opacity-50">%</span></div>
          </div>
       </div>

       <button className="w-full py-7 rounded-[28px] bg-white/[0.04] text-[#4E7A96] font-extrabold uppercase tracking-[4px] text-[12px] border border-white/10 hover:text-white hover:border-[#00d2b4]/40 hover:bg-[#00d2b4]/5 transition-all font-manrope shadow-inner relative z-10">UPDATE SETTINGS</button>
    </div>
  </AdminLayout>
);
