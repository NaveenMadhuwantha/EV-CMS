import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { PageHeader } from './AdminComponents';
import { registerStation, getAllStations, getStationsByProvider } from '../../firestore/stationDb';
import { useAuth } from '../../context/AuthContext';
import { Fuel, MapPin, Zap, ChevronRight, Loader2, Plus } from 'lucide-react';

const AddStationModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', location: '', price: '', type: 'AC Charger' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ ...formData, price: parseFloat(formData.price) });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#050c14]/90 backdrop-blur-xl animate-fade-in font-inter">
       <div className="bg-[#0a2038] border-2 border-dashed border-[#00d2b4]/20 rounded-[48px] p-12 w-full max-w-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d2b4]/5 blur-[120px] pointer-events-none"></div>
          <div className="flex justify-between items-center mb-10">
             <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Register Charging Station</h3>
                <p className="text-[10px] uppercase tracking-widest text-[#4E7A96] mt-1">Deploy a new charging unit to the network</p>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-[#4E7A96] hover:text-white transition-all">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] ml-2">Station Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Apex Station Colombo" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-white text-[16px] focus:outline-none focus:border-[#00d2b4] transition-all font-bold uppercase tracking-tight" />
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] ml-2">Location</label>
                <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Colombo 03" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-white text-[16px] focus:outline-none focus:border-[#00d2b4] transition-all font-bold uppercase tracking-tight" />
             </div>
             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] ml-2">Type</label>
                   <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-white text-[14px] focus:outline-none focus:border-[#00d2b4] transition-all font-black uppercase tracking-widest appearance-none cursor-pointer">
                      <option value="AC Charger">AC CHARGER</option>
                      <option value="DC Fast">DC FAST RATE</option>
                      <option value="Supercharger">SUPERCHARGER</option>
                   </select>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] ml-2">Price per Hour (Rs/Hr)</label>
                   <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-white text-[16px] focus:outline-none focus:border-[#00d2b4] transition-all font-bold font-manrope" />
                </div>
             </div>
             <div className="flex gap-6 pt-6 font-manrope">
                <button type="button" onClick={onClose} className="flex-1 py-5 rounded-3xl bg-white/[0.03] text-[#4E7A96] font-black uppercase tracking-widest text-[11px] hover:bg-white/5 transition-all">ABORT OPERATION</button>
                <button type="submit" disabled={loading} className="flex-[2] py-5 rounded-3xl bg-gradient-to-r from-[#00d2b4] to-blue-500 text-[#050c14] font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50">
                   {loading ? 'DEPLOYING...' : 'INITIALIZE NODE'}
                </button>
             </div>
          </form>
       </div>
    </div>
  );
};

export const Stations = () => {
  const { role, user } = useAuth();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStations();
  }, [role, user]);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const data = role === 'provider' 
        ? await getStationsByProvider(user.uid) 
        : await getAllStations();
      setStations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterStation = async (data) => {
    try {
      await registerStation({ ...data, providerId: user.uid, ownerEmail: user.email });
      setShowModal(false);
      fetchStations();
    } catch (err) {
      alert("Registration failed.");
    }
  };

  return (
    <AdminLayout title="Stations">
      <div className="flex justify-between items-center mb-12">
        <PageHeader title="Network Stations" subtitle={role === 'provider' ? "Manage your deployed charging hubs." : "Manage and monitor all charging nodes."} />
        {role === 'provider' && (
           <button onClick={() => setShowModal(true)} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00d2b4] to-blue-500 text-[#050c14] text-[12px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#00d2b4]/20 flex items-center gap-2">
             <Plus className="w-4 h-4" strokeWidth={3} /> Add Station
           </button>
        )}
      </div>
      
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

      {showModal && <AddStationModal onClose={() => setShowModal(false)} onSubmit={handleRegisterStation} />}
    </AdminLayout>
  );
};
