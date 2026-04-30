import React, { useState, useEffect } from 'react';
import GuestLayout from '../../../shared/layouts/GuestLayout';
import { getAllStations } from '../../../firestore/stationDb';
import { getAllProviders } from '../../../firestore/providerDb';
import { Search, Loader2, MapPin, Navigation, Locate, ChevronRight, Globe, Zap } from 'lucide-react';

const Explore = () => {
  const [nodes, setStations] = useState([]);
  const [search, setSearch] = useState('Sri Lanka');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStations();
    window.scrollTo(0, 0);
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const sData = await getAllStations();
      const pData = await getAllProviders();
      
      const verifiedStations = sData.filter(s => s.isVerified);
      const activeProviders = pData.filter(p => p.status === 'ACTIVE');

      const combined = [
        ...verifiedStations.map(s => ({ ...s, sourceType: 'Station' })),
        ...activeProviders.map(p => ({ 
          id: p.id, 
          name: p.businessName, 
          location: p.businessAddress, 
          sourceType: 'Provider' 
        }))
      ];
      setStations(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStations = nodes.filter(n => 
    ((n.name?.toLowerCase() || '').includes(query.toLowerCase()) || 
    (n.location?.toLowerCase() || '').includes(query.toLowerCase()))
  );

  return (
    <GuestLayout title="Public Network">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-inter animate-fade-up">
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white border-2 border-[#E2E8F0] rounded-[40px] p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] pointer-events-none"></div>
              
              <div className="mb-8">
                  <h3 className="font-manrope text-2xl font-black text-[#0F172A] uppercase tracking-tighter mb-2">Registry</h3>
                  <p className="text-[12px] text-[#64748B] font-black uppercase tracking-[3px] leading-relaxed">Search nodes across the network.</p>
              </div>

              <div className="relative group mb-10">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#3B82F6] transition-colors" />
                 <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Infrastructure..." 
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl py-5.5 pl-15 pr-6 text-[#0F172A] text-[15px] focus:outline-none focus:border-[#3B82F6] transition-all font-bold placeholder:text-[#94A3B8] placeholder:text-[10px] placeholder:uppercase placeholder:tracking-[3px] shadow-inner" 
                 />
              </div>

              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                 {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 opacity-30">
                       <Loader2 className="w-10 h-10 animate-spin mb-6 text-[#3B82F6]" />
                       <p className="text-[11px] font-black uppercase tracking-[4px] text-[#0F172A]">Scanning Charging Stations...</p>
                    </div>
                 ) : filteredStations.length > 0 ? filteredStations.map((n) => (
                    <div key={n.id} className="p-6 rounded-[32px] bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/5 transition-all cursor-pointer group shadow-sm">
                       <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#3B82F6] shadow-inner group-hover:scale-110 transition-transform">
                                <MapPin className="w-6 h-6" />
                             </div>
                             <div>
                                <div className="text-[#0F172A] font-black text-[16px] uppercase tracking-tighter group-hover:text-[#3B82F6] transition-colors line-clamp-1">{n.name}</div>
                                <div className="text-[11px] font-black text-[#94A3B8] uppercase tracking-[3px] mt-2 flex items-center gap-2">
                                   <div className={`w-2.5 h-2.5 rounded-full ${n.sourceType === 'Station' ? 'bg-[#3B82F6]' : 'bg-emerald-500'}`}></div>
                                   {n.sourceType} · {n.location?.split(',')[0]}
                                </div>
                             </div>
                          </div>
                          <ChevronRight className="w-6 h-6 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                       </div>
                    </div>
                 )) : (
                    <div className="text-center py-16 opacity-30 text-[#0F172A]">
                       <Globe className="w-12 h-12 mx-auto mb-6" />
                       <p className="text-[11px] font-black uppercase tracking-[4px] leading-relaxed">Infrastructure Data Not Found</p>
                    </div>
                 )}
              </div>
           </div>

           <div className="p-10 rounded-[40px] bg-gradient-to-br from-[#3B82F6]/5 to-emerald-500/5 border-2 border-[#E2E8F0] shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
                <Zap className="absolute -right-10 -bottom-10 w-48 h-48 text-[#3B82F6]/5 transform -rotate-12 group-hover:scale-110 transition-transform" />
                <h4 className="text-[#0F172A] font-manrope font-black text-3xl uppercase tracking-tighter mb-6">Want to Join the Network?</h4>
                <p className="text-[#64748B] text-lg leading-relaxed mb-10 font-medium">Register your corporate entity or private vehicle infrastructure to starts managing nodes.</p>
                <div className="flex items-center gap-5 text-[#3B82F6] text-[13px] font-black uppercase tracking-[4px]">
                     Start Setup <ChevronRight className="w-5 h-5" />
                </div>
           </div>
        </div>

        <div className="lg:col-span-8 bg-white border-2 border-[#E2E8F0] rounded-[56px] overflow-hidden shadow-2xl relative group min-h-[700px]">
           <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none"></div>
           
           <div className="absolute inset-0 bg-[#FDF8EE]/60 backdrop-blur-[4px] z-10 flex flex-col items-center justify-center p-16 text-center pointer-events-none group-hover:opacity-0 transition-opacity duration-1000">
              <div className="w-28 h-28 rounded-[40px] bg-white border-2 border-[#E2E8F0] flex items-center justify-center mb-12 shadow-2xl animate-[pulse_4s_infinite]">
                 <Navigation className="w-14 h-14 text-[#3B82F6]" />
              </div>
              <h2 className="text-5xl font-black text-[#0F172A] font-manrope uppercase tracking-tighter mb-6">Network Overview</h2>
              <p className="text-[#64748B] font-bold max-w-sm mx-auto leading-relaxed text-xl">Synchronizing satellite telemetry with local infrastructure nodes...</p>
           </div>
           
           <iframe 
              src={`https://www.google.com/maps?q=${encodeURIComponent(search)}&output=embed`}
              className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100"
              title="Network Overview Map"
           />
           
           <div className="absolute top-12 left-12 z-20 flex gap-8">
              <button 
                onClick={() => setSearch('Sri Lanka')} 
                className="px-10 py-5 rounded-2xl bg-white border-2 border-[#E2E8F0] text-[#0F172A] text-[12px] font-black uppercase tracking-[4px] hover:border-[#3B82F6]/40 hover:bg-[#F8FAFC] transition-all shadow-2xl"
              >
                Map Center
              </button>
              <button className="w-16 h-16 rounded-2xl bg-white border-2 border-[#E2E8F0] flex items-center justify-center text-[#3B82F6] hover:bg-[#F8FAFC] hover:border-[#3B82F6]/40 transition-all shadow-2xl">
                 <Locate className="w-7 h-7" />
              </button>
           </div>
        </div>
      </div>
    </GuestLayout>
  );
};

export default Explore;
