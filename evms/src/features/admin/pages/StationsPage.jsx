import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';
import { PageHeader } from '../components/AdminComponents';
import { registerStation, getAllStations, getStationsByProvider, deleteStation, updateStationStatus, verifyStation } from '../../../firestore/stationDb';
import { auditDb } from '../../../firestore/auditDb';
import { useAuth } from '../../auth/context/AuthContext';
import { Fuel, MapPin, Zap, ChevronRight, Loader2, Plus, ShieldCheck, Trash2, AlertTriangle, CheckCircle2, XCircle, Settings2, BarChart3, Clock } from 'lucide-react';
import { useLanguage } from '../../../shared/context/LanguageContext';

const AddStationModal = ({ onClose, onSubmit, role }) => {
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
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Register Station</h3>
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
                <button type="button" onClick={onClose} className="flex-1 py-5 rounded-3xl bg-white/[0.03] text-[#4E7A96] font-black uppercase tracking-widest text-[11px] hover:bg-white/5 transition-all">ABORT</button>
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
  const { role, user, profile } = useAuth();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unverified, offline
  const { t } = useLanguage();

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
      const pId = role === 'admin' ? 'system' : user.uid;
      const pEmail = role === 'admin' ? 'admin@voltway.lk' : user.email;
      
      const newStation = { 
        ...data, 
        providerId: pId, 
        ownerEmail: pEmail,
        isVerified: role === 'admin' 
      };
      
      await registerStation(newStation);
      await auditDb.log({
        action: 'STATION_REGISTERED',
        user: user.email,
        details: `Registered station: ${data.name}`,
        targetId: data.name
      });

      setShowModal(false);
      fetchStations();
    } catch (err) {
      alert("Registration failed.");
    }
  };

  const handleDelete = async (id, name) => {
     try {
       await deleteStation(id);
       await auditDb.log({
         action: 'STATION_DELETED',
         user: user.email,
         details: `Deleted station: ${name}`,
         targetId: id
       });
       setDeleteConfirm(null);
       fetchStations();
     } catch (err) {
       alert("Deletion failed.");
     }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'LIVE' ? 'MAINTENANCE' : (currentStatus === 'MAINTENANCE' ? 'OFFLINE' : 'LIVE');
    try {
      await updateStationStatus(id, nextStatus);
      fetchStations();
    } catch (err) { console.error(err); }
  };

  const handleVerify = async (id, name) => {
    try {
      await verifyStation(id, true);
      await auditDb.log({
        action: 'STATION_VERIFIED',
        user: user.email,
        details: `Verified station: ${name}`,
        targetId: id
      });
      fetchStations();
    } catch (err) { console.error(err); }
  };

  const filteredStations = stations.filter(s => {
    if (filter === 'unverified') return !s.isVerified;
    if (filter === 'offline') return s.status === 'OFFLINE' || s.status === 'MAINTENANCE';
    return true;
  });

  const isComplete = role === 'admin' || profile?.isProfileComplete;

  return (
    <DashboardLayout title="Stations">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
        <PageHeader title="Network Stations" subtitle={role === 'provider' ? "Manage your deployed charging hubs." : "Advanced orchestration of all charging nodes."} />
        
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 font-manrope">
            {['all', 'unverified', 'offline'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#00d2b4] text-[#050c14] shadow-lg' : 'text-[#4E7A96] hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => isComplete ? setShowModal(true) : alert("Complete profile to add stations.")} 
            disabled={!isComplete}
            className={`px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00d2b4] to-blue-500 text-[#050c14] text-[12px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#00d2b4]/20 flex items-center gap-2 ${!isComplete ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
          >
            <Plus className="w-4 h-4" strokeWidth={3} /> {t('addStation') || 'Add Station'}
          </button>
        </div>
      </div>
      
      {!isComplete && role === 'provider' && (
         <div className="mb-12 p-10 bg-amber-500/5 border-2 border-dashed border-amber-500/20 rounded-[48px] text-center">
            <ShieldCheck className="w-12 h-12 text-amber-500 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Verification Pending</h3>
            <p className="text-[#7a9bbf] text-sm max-w-lg mx-auto mt-2">Complete your provider profile to activate station management and deployment tools.</p>
         </div>
      )}
           <div className="bg-[#0a1628] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl font-inter">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#4E7A96]">Station Node</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#4E7A96]">Category</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#4E7A96]">Energy Rate</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#4E7A96]">Operation Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#4E7A96]">Performance</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#4E7A96] text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-20 text-center opacity-30">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-[#00d2b4]" />
                    <div className="text-[10px] font-black uppercase tracking-[4px]">Accessing Infrastructure...</div>
                  </td>
                </tr>
              ) : filteredStations.length > 0 ? filteredStations.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.01] transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${!s.isVerified ? 'bg-amber-500/10 text-amber-500' : 'bg-[#00d2b4]/10 text-[#00d2b4]'}`}>
                        <Fuel className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <span className="text-white font-extrabold text-[15px] uppercase tracking-tight group-hover:text-[#00d2b4] transition-colors">{s.name}</span>
                           {!s.isVerified && <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[8px] font-black text-amber-500 uppercase tracking-widest">PENDING</span>}
                        </div>
                        <div className="text-[#4E7A96] text-[11px] font-bold flex items-center gap-1.5 mt-1 opacity-70">
                          <MapPin className="w-3.5 h-3.5" /> {s.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/5 text-[10px] font-black text-[#7a9bbf] uppercase tracking-widest shadow-inner">
                      {s.type?.split(' ')[0] || 'AC'} NODE
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="text-white font-manrope font-extrabold text-[16px]">Rs. {s.price}</div>
                    <div className="text-[10px] text-[#4E7A96] font-bold uppercase tracking-widest mt-0.5 opacity-60">per hour usage</div>
                  </td>
                  <td className="p-6">
                    <button 
                      onClick={() => handleStatusToggle(s.id, s.status || 'LIVE')}
                      className={`px-5 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all shadow-sm hover:scale-105 active:scale-95 ${
                        s.status === 'LIVE' ? 'bg-[#00d2b4]/10 border-[#00d2b4]/20 text-[#00d2b4]' : 
                        s.status === 'MAINTENANCE' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 
                        'bg-red-500/10 border-red-500/20 text-red-500'
                      }`}
                    >
                      {s.status || 'LIVE'}
                    </button>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1.5">
                       <div className="text-[13px] font-extrabold text-white flex items-center gap-2">84% <span className="text-[#00d2b4] text-[10px]">↑</span></div>
                       <div className="text-[10px] text-[#4E7A96] font-bold uppercase tracking-widest opacity-50 italic">142 sessions log</div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-end gap-3">
                      {role === 'admin' && !s.isVerified && (
                        <button 
                          onClick={() => handleVerify(s.id, s.name)}
                          className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center shadow-lg border border-amber-500/20"
                          title="Verify Station"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      )}
                      <button 
                        className="w-10 h-10 rounded-xl bg-white/5 text-[#4E7A96] hover:bg-[#00d2b4] hover:text-[#050c14] transition-all flex items-center justify-center shadow-lg border border-white/5"
                        title="Configure Settings"
                      >
                        <Settings2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm({ id: s.id, name: s.name })}
                        className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-lg border border-red-500/20"
                        title="Decommission Node"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-32 text-center opacity-20">
                    <Zap className="w-12 h-12 mx-auto mb-6" />
                    <p className="text-[12px] font-black uppercase tracking-[8px]">No Infrastructure Deployed</p>
                    <p className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-widest mt-4">Initialize a new node to begin operations</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#050c14]/95 backdrop-blur-2xl animate-fade-in">
          <div className="bg-[#0a2038] border-2 border-red-500/20 rounded-[48px] p-12 w-full max-w-md shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[60px]"></div>
            <div className="w-20 h-20 rounded-[28px] bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-8 shadow-inner">
               <AlertTriangle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Decommission Node?</h3>
            <p className="text-[#8AAFC8] text-sm font-medium leading-relaxed mb-10 opacity-70">Are you sure you want to permanently remove <b>{deleteConfirm.name}</b>? This action will impact existing bookings.</p>
            <div className="flex flex-col gap-4">
              <button onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.name)} className="w-full py-5 rounded-3xl bg-red-500 text-white font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-red-600 transition-all">CONFIRM DELETION</button>
              <button onClick={() => setDeleteConfirm(null)} className="w-full py-4 text-[#4E7A96] font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">ABORT</button>
            </div>
          </div>
        </div>
      )}

      {showModal && <AddStationModal onClose={() => setShowModal(false)} onSubmit={handleRegisterStation} role={role} />}
    </DashboardLayout>
  );
};
