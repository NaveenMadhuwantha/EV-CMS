import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { PageHeader } from './AdminComponents';
import { registerStation, getAllStations } from '../../firestore/stationDb';
import { Fuel, MapPin, Zap, ChevronRight, Loader2 } from 'lucide-react';

export const Stations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getAllStations();
        setStations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  return (
    <AdminLayout title="Stations">
      <PageHeader title="Stations" subtitle="Manage and monitor all charging nodes." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-inter">
        {loading ? (
          <div className="col-span-full py-24 text-center opacity-30">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-[#00d2b4]" />
            <p className="text-[12px] font-bold uppercase tracking-[4px]">Fetching Infrastructure...</p>
          </div>
        ) : stations.length > 0 ? stations.map((s) => (
          <div key={s.id} className="bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[40px] p-10 hover:border-[#00d2b4]/30 transition-all shadow-xl group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d2b4]/5 blur-[60px] pointer-events-none"></div>
             <div className="flex justify-between items-start mb-10">
                <div className="w-14 h-14 rounded-2xl bg-[#00d2b4]/10 flex items-center justify-center text-[#00d2b4] shadow-inner group-hover:scale-110 transition-transform">
                   <Fuel className="w-6 h-6" />
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-[#00d2b4] uppercase tracking-widest shadow-sm">ACTIVE</div>
             </div>
             <div>
                <h3 className="text-white font-extrabold text-[20px] uppercase tracking-tighter mb-2 group-hover:text-emerald-400 transition-colors">{s.name}</h3>
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#4E7A96] uppercase tracking-widest opacity-70 mb-8">
                   <MapPin className="w-3.5 h-3.5" /> {s.location}
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                      <div className="text-[9px] font-bold text-[#4E7A96] uppercase tracking-widest mb-1 opacity-60">Base Rate</div>
                      <div className="text-[14px] font-black text-white font-manrope">Rs. {s.price}</div>
                   </div>
                   <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                      <div className="text-[9px] font-bold text-[#4E7A96] uppercase tracking-widest mb-1 opacity-60">Type</div>
                      <div className="text-[14px] font-black text-white font-manrope">{s.type?.split(' ')[0] || 'AC'}</div>
                   </div>
                </div>
                <button className="w-full mt-8 py-5 rounded-2xl bg-white/[0.03] border border-white/5 text-[#4E7A96] text-[10px] font-black uppercase tracking-[3px] hover:bg-[#00d2b4] hover:text-[#050c14] transition-all flex items-center justify-center gap-3 group/btn">
                   MANAGE NODE <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>
        )) : (
          <div className="col-span-full py-32 text-center opacity-20">
             <Zap className="w-12 h-12 mx-auto mb-6" />
             <p className="text-[10px] font-extrabold uppercase tracking-[6px]">No Infrastructure Deployed</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
