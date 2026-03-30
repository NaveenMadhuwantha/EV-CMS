import React, { useState, useEffect } from 'react';
import GuestLayout from '../layouts/GuestLayout';
import { getAllStations } from '../firestore/stationDb';
import { getAllProviders } from '../firestore/providerDb';
import { Search, Loader2, MapPin, Navigation, Locate, ChevronRight, Globe, Zap } from 'lucide-react';

const Explore = () => {
  const [nodes, setNodes] = useState([]);
  const [search, setSearch] = useState('Sri Lanka');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNodes();
    window.scrollTo(0, 0);
  }, []);

  const fetchNodes = async () => {
    try {
      setLoading(true);
      const sData = await getAllStations();
      const pData = await getAllProviders();
      const combined = [
        ...sData.map(s => ({ ...s, sourceType: 'Station' })),
        ...pData.map(p => ({ 
          id: p.id, 
          name: p.businessName, 
          location: p.businessAddress, 
          sourceType: 'Provider' 
        }))
      ];
      setNodes(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNodes = nodes.filter(n => 
    (n.name?.toLowerCase() || '').includes(query.toLowerCase()) || 
    (n.location?.toLowerCase() || '').includes(query.toLowerCase())
  );

  return (
    <GuestLayout title="Public Grid Network">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-inter animate-fade-up">
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-[#0a2038]/40 border border-white/5 rounded-[40px] p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d2b4]/5 blur-[60px] pointer-events-none"></div>
              
              <div className="mb-8">
                  <h3 className="font-manrope text-xl font-extrabold text-white uppercase tracking-tight mb-2">Registry</h3>
                  <p className="text-[12px] text-[#4E7A96] font-bold uppercase tracking-widest leading-relaxed opacity-60">Search nodes across the network.</p>
              </div>

              <div className="relative group mb-8">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#4E7A96] group-focus-within:text-[#00d2b4] transition-colors" />
                 <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Infrastructure..." 
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white text-[14px] focus:outline-none focus:border-[#00d2b4] transition-all font-bold placeholder:text-[#4E7A96] placeholder:text-[10px] placeholder:uppercase placeholder:tracking-[2px]" 
                 />
              </div>

              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                 {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 opacity-30">
                       <Loader2 className="w-8 h-8 animate-spin mb-4" />
                       <p className="text-[10px] font-bold uppercase tracking-widest">Scanning Grid Nodes...</p>
                    </div>
                 ) : filteredNodes.length > 0 ? filteredNodes.map((n) => (
                    <div key={n.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#00d2b4]/30 hover:bg-[#00d2b4]/5 transition-all cursor-pointer group shadow-sm">
                       <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-5">
                             <div className="w-12 h-12 rounded-2xl bg-[#0f2040] flex items-center justify-center text-[#00d2b4] shadow-inner border border-white/5 group-hover:scale-110 transition-transform">
                                <MapPin className="w-5 h-5" />
                             </div>
                             <div>
                                <div className="text-white font-black text-[15px] uppercase tracking-tight group-hover:text-[#00d2b4] transition-colors line-clamp-1">{n.name}</div>
                                <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-[2px] mt-1.5 opacity-60 flex items-center gap-2">
                                   <div className={`w-2 h-2 rounded-full ${n.sourceType === 'Station' ? 'bg-[#00d2b4]' : 'bg-blue-400'}`}></div>
                                   {n.sourceType} · {n.location?.split(',')[0]}
                                </div>
                             </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[#4E7A96] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                       </div>
                    </div>
                 )) : (
                    <div className="text-center py-12 opacity-40">
                       <Globe className="w-10 h-10 mx-auto mb-4" />
                       <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Infrastructure Data Not Found</p>
                    </div>
                 )}
              </div>
           </div>

           <div className="p-8 rounded-[40px] bg-gradient-to-br from-[#00d2b4]/10 to-blue-600/5 border border-white/5 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
                <Zap className="absolute -right-8 -bottom-8 w-40 h-40 text-[#00d2b4]/5 transform -rotate-12 group-hover:scale-110 transition-transform" />
                <h4 className="text-white font-manrope font-extrabold text-2xl uppercase tracking-tighter mb-4">Want to Join the Grid?</h4>
                <p className="text-[#8AAFC8] text-[13px] leading-relaxed mb-8 opacity-80">Register your corporate entity or private vehicle infrastructure to starts managing nodes.</p>
                <div className="flex items-center gap-4 text-[#00d2b4] text-[11px] font-black uppercase tracking-[3px]">
                     Start Deployment <ChevronRight className="w-4 h-4" />
                </div>
           </div>
        </div>

        <div className="lg:col-span-8 bg-[#0a2038]/60 border border-white/5 rounded-[48px] overflow-hidden shadow-2xl relative group min-h-[700px] backdrop-blur-3xl">
           <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-[#050c14] to-transparent z-10 pointer-events-none"></div>
           
           <div className="absolute inset-0 bg-[#050c14]/30 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-12 text-center pointer-events-none group-hover:opacity-0 transition-opacity duration-1000">
              <div className="w-24 h-24 rounded-[36px] bg-[#00d2b4]/10 border border-[#00d2b4]/20 flex items-center justify-center mb-10 shadow-2xl animate-[pulse_3s_infinite]">
                 <Navigation className="w-12 h-12 text-[#00d2b4]" />
              </div>
              <h2 className="text-4xl font-extrabold text-white font-manrope uppercase tracking-tighter mb-5">Grid Telemetry</h2>
              <p className="text-[#8AAFC8] font-medium max-w-sm mx-auto leading-relaxed opacity-60 text-lg">Synchronizing satellite telemetry with local infrastructure nodes...</p>
           </div>
           
           <iframe 
              src={`https://www.google.com/maps?q=${encodeURIComponent(search)}&output=embed`}
              className="w-full h-full border-none grayscale opacity-40 contrast-125 brightness-75 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
              title="Grid Telemetry Map"
           />
           
           <div className="absolute top-10 left-10 z-20 flex gap-6">
              <button 
                onClick={() => setSearch('Sri Lanka')} 
                className="px-8 py-4 rounded-2xl bg-[#050c14]/80 backdrop-blur-2xl border border-white/10 text-white text-[11px] font-black uppercase tracking-[4px] hover:border-[#00d2b4]/40 hover:bg-[#00d2b4] hover:text-[#050c14] transition-all shadow-2xl"
              >
                Grid Center
              </button>
              <button className="w-14 h-14 rounded-2xl bg-[#050c14]/80 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white hover:text-blue-400 hover:border-blue-400/40 transition-all shadow-2xl">
                 <Locate className="w-6 h-6" />
              </button>
           </div>
        </div>
      </div>
    </GuestLayout>
  );
};

export default Explore;
