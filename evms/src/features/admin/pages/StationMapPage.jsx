import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';
import { useAuth } from '../../auth/context/AuthContext';
import { PageHeader, SectionHeader } from '../components/AdminComponents';
import { registerStation, getAllStations } from '../../../firestore/stationDb';
import { getAllProviders } from '../../../firestore/providerDb';
import { Search, Loader2, MapPin, X, Navigation, Locate, ChevronRight, Globe, Zap } from 'lucide-react';

const StationFormModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'AC Standard',
    price: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[#0F172A]/40 backdrop-blur-md animate-fade-in">
       <div className="w-full max-w-2xl bg-white border-2 border-[#E2E8F0] rounded-[48px] p-12 lg:p-16 shadow-2xl animate-fade-up relative overflow-hidden font-inter">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d2b4]/5 blur-[120px] pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-12 relative z-10">
             <div>
                <h2 className="font-manrope text-3xl font-extrabold text-[#0F172A] uppercase tracking-tighter mb-3 leading-none">Register New Station</h2>
                <p className="text-[13px] text-[#64748B] font-medium font-inter">Enter the infrastructure details to deploy a new charging node.</p>
             </div>
             <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-all">
                <X className="w-6 h-6" />
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] ml-2">Station Name</label>
                    <input 
                       type="text" 
                       required
                       value={formData.name}
                       onChange={e => setFormData({...formData, name: e.target.value})}
                       className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 text-[#0F172A] text-[16px] focus:outline-none focus:border-[#3B82F6] transition-all font-bold placeholder:text-[#94A3B8] uppercase tracking-tight" 
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] ml-2">Geographic Address</label>
                    <input 
                       type="text" 
                       required
                       value={formData.location}
                       onChange={e => setFormData({...formData, location: e.target.value})}
                       className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 text-[#0F172A] text-[16px] focus:outline-none focus:border-[#3B82F6] transition-all font-bold placeholder:text-[#94A3B8] uppercase tracking-tight" 
                    />
                 </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] ml-2">Station Capacity TYPE</label>
                    <select 
                       value={formData.type}
                       onChange={e => setFormData({...formData, type: e.target.value})}
                       className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 text-[#0F172A] text-[14px] focus:outline-none focus:border-[#3B82F6] transition-all font-black uppercase tracking-widest appearance-none cursor-pointer"
                    >
                       <option value="AC Standard">AC STANDARD (7kW)</option>
                       <option value="DC Rapid">DC RAPID (50kW+)</option>
                       <option value="Supercharger">V3 SUPERCHARGER</option>
                    </select>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] ml-2">Base rate (RS/HR)</label>
                    <input 
                       type="number" 
                       required
                       value={formData.price}
                       onChange={e => setFormData({...formData, price: e.target.value})}
                       className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 text-[#0F172A] text-[16px] focus:outline-none focus:border-[#3B82F6] transition-all font-bold" 
                    />
                 </div>
             </div>

             <div className="space-y-8 pt-8 font-manrope">
                <button type="submit" disabled={loading} className="w-full py-7 rounded-3xl bg-gradient-to-r from-[#00d2b4] to-blue-600 text-[#0F172A] text-[13px] font-black uppercase tracking-[4px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-emerald-500/20">
                   {loading ? 'INITIALIZING DEPLOYMENT...' : 'DEPLOY STATION TO GRID'}
                </button>
             </div>
          </form>
       </div>
    </div>
  );
};

export const StationMap = () => {
  const { role } = useAuth();
  const isAdminOrProvider = role === 'admin' || role === 'provider';
  const [nodes, setStations] = useState([]);
  const [search, setSearch] = useState('Sri Lanka');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
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
      setStations(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStation = async (data) => {
    try {
      await registerStation(data);
      setShowModal(false);
      fetchStations();
    } catch (err) {
      alert("Failed to register station");
    }
  };

  const filteredStations = nodes.filter(n => 
    (n.name?.toLowerCase() || '').includes(query.toLowerCase()) || 
    (n.location?.toLowerCase() || '').includes(query.toLowerCase())
  );

  return (
    <DashboardLayout title="Station Map">
      <PageHeader 
        title="Station Map" 
        subtitle="View and manage all charging stations and providers on the map."
        action={isAdminOrProvider ? "Register Station" : null}
        onAction={isAdminOrProvider ? () => setShowModal(true) : null}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-inter">
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white border-2 border-[#E2E8F0] rounded-[32px] p-8 hover:border-[#3B82F6]/30 transition-all shadow-xl">
              <SectionHeader title="Live Station Registry" subtitle="Search and select registered nodes across the grid." />
              <div className="relative group mb-8">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#64748B] group-focus-within:text-[#3B82F6] transition-colors" />
                 <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Stations..." 
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl py-5 pl-14 pr-6 text-[#0F172A] text-[14px] focus:outline-none focus:border-[#3B82F6] transition-all font-bold placeholder:text-[#94A3B8] placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]" 
                 />
              </div>

              <div className="space-y-4 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                 {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 opacity-30">
                       <Loader2 className="w-8 h-8 animate-spin mb-4" />
                       <p className="text-[10px] font-bold uppercase tracking-widest">Scanning Network...</p>
                    </div>
                 ) : filteredStations.length > 0 ? filteredStations.map((n) => (
                    <div key={n.id} className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3B82F6]/30 hover:bg-[#3B82F6]/5 transition-all cursor-pointer group shadow-sm">
                       <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-[#E0E7FF] flex items-center justify-center text-[#3B82F6] shadow-inner group-hover:scale-110 transition-transform">
                                <MapPin className="w-4.5 h-4.5" />
                             </div>
                             <div>
                                <div className="text-[#0F172A] font-extrabold text-[15px] uppercase tracking-tight group-hover:text-[#3B82F6] transition-colors line-clamp-1">{n.name}</div>
                                <div className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest mt-1 flex items-center gap-2">
                                   <div className={`w-1.5 h-1.5 rounded-full ${n.sourceType === 'Station' ? 'bg-[#3B82F6]' : 'bg-[#10B981]'}`}></div>
                                   {n.sourceType} · {n.location?.split(',')[0]}
                                </div>
                             </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#64748B] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                       </div>
                    </div>
                  )) : (
                     <div className="text-center py-20 text-[#64748B]">
                        <Globe className="w-10 h-10 mx-auto mb-4 opacity-20" />
                        <p className="text-[10px] font-bold uppercase tracking-[4px]">No matching nodes found</p>
                     </div>
                 )}
              </div>
           </div>
        </div>

        <div className="lg:col-span-8 bg-white border-2 border-[#E2E8F0] rounded-[48px] overflow-hidden shadow-2xl relative group min-h-[600px]">
           <div className="absolute inset-0 bg-[#FDF8EE]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-12 text-center pointer-events-none group-hover:opacity-0 transition-opacity duration-700">
              <div className="w-20 h-20 rounded-[32px] bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center mb-8 shadow-xl animate-pulse">
                 <Navigation className="w-10 h-10 text-[#3B82F6]" />
              </div>
              <h2 className="text-3xl font-extrabold text-[#0F172A] font-manrope uppercase tracking-tighter mb-4">Initializing Network Map</h2>
              <p className="text-[#64748B] font-medium max-w-sm mx-auto leading-relaxed">Synchronizing satellite telemetry with local infrastructure nodes...</p>
           </div>
           
           <iframe 
              src={`https://www.google.com/maps?q=${encodeURIComponent(search)}&output=embed`}
              className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100"
              title="Network Overview Map"
           />
           
           <div className="absolute top-8 left-8 z-20 flex gap-4">
              <button onClick={() => setSearch('Sri Lanka')} className="px-6 py-3 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] text-[10px] font-black uppercase tracking-widest hover:bg-[#3B82F6] hover:text-white transition-all shadow-lg">SRI LANKA CENTER</button>
              <button className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] hover:bg-[#3B82F6] hover:text-white transition-all shadow-lg"><Locate className="w-5 h-5" /></button>
           </div>
        </div>
      </div>

      {showModal && <StationFormModal onClose={() => setShowModal(false)} onSubmit={handleAddStation} />}
    </DashboardLayout>
  );
};
