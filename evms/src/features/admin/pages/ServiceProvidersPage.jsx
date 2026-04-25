import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';
import { PageHeader } from '../components/AdminComponents';
import { getAllProviders, addProvider, deleteProvider } from '../../../firestore/providerDb';
import { Loader2, Briefcase, Mail, Phone, MapPin, Activity, Plus, Trash2 } from 'lucide-react';

const ProviderFormModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    contactEmail: '',
    contactPhone: '',
    status: 'ACTIVE'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#050c14]/90 backdrop-blur-xl animate-fade-in font-inter">
       <div className="bg-[#0a2038] border-2 border-dashed border-[#00d2b4]/20 rounded-[48px] p-12 w-full max-w-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d2b4]/5 blur-[120px] pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-10">
             <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Register New Provider</h3>
             <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-[#4E7A96] hover:text-white transition-all">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] ml-2">Business / Entity Name</label>
                <input 
                   type="text" 
                   required
                   placeholder="e.g. VoltWay Solutions"
                   value={formData.businessName}
                   onChange={e => setFormData({...formData, businessName: e.target.value})}
                   className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white text-[15px] focus:outline-none focus:border-[#00d2b4] transition-all font-bold uppercase tracking-tight placeholder:opacity-20" 
                />
             </div>
             
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] ml-2">Operational Address</label>
                <input 
                   type="text" 
                   required
                   placeholder="e.g. 123 Tech Park, Colombo"
                   value={formData.businessAddress}
                   onChange={e => setFormData({...formData, businessAddress: e.target.value})}
                   className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white text-[15px] focus:outline-none focus:border-[#00d2b4] transition-all font-bold tracking-tight placeholder:opacity-20" 
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] ml-2">Contact Email</label>
                   <input 
                      type="email" 
                      required
                      placeholder="provider@voltway.com"
                      value={formData.contactEmail}
                      onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white text-[14px] focus:outline-none focus:border-[#00d2b4] transition-all font-bold lowercase placeholder:opacity-20" 
                   />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] ml-2">Contact Phone</label>
                   <input 
                      type="tel" 
                      required
                      placeholder="+94 7X XXX XXXX"
                      value={formData.contactPhone}
                      onChange={e => setFormData({...formData, contactPhone: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white text-[14px] focus:outline-none focus:border-[#00d2b4] transition-all font-bold placeholder:opacity-20" 
                   />
                </div>
             </div>

             <div className="flex gap-6 pt-6 font-manrope">
                <button type="button" onClick={onClose} className="flex-1 py-5 rounded-3xl bg-white/[0.03] text-[#4E7A96] font-black uppercase tracking-widest text-[11px] hover:bg-white/5 transition-all">CANCEL</button>
                <button 
                   type="submit" 
                   disabled={loading}
                   className="flex-[2] py-5 rounded-3xl bg-gradient-to-r from-[#00d2b4] to-blue-500 text-[#050c14] font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                   {loading ? 'PROCESSING...' : 'ACTIVATE PROVIDER'}
                </button>
             </div>
          </form>
       </div>
    </div>
  );
};

export const ServiceProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const data = await getAllProviders();
      setProviders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProvider = async (providerData) => {
    try {
      await addProvider(providerData);
      setShowModal(false);
      fetchProviders();
    } catch (err) {
      alert("Failed to add provider.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this provider? This action is irreversible.")) {
      try {
        await deleteProvider(id);
        fetchProviders();
      } catch (err) {
        alert("Failed to delete provider.");
      }
    }
  };

  return (
    <DashboardLayout title="Service Providers">
      <div className="flex justify-between items-center mb-12">
        <PageHeader title="Service Providers" subtitle="Manage registered node operators and partner networks." />
        <button 
          onClick={() => setShowModal(true)}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00d2b4] to-blue-500 text-[#050c14] text-[12px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#00d2b4]/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Provider
        </button>
      </div>

      <div className="bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[40px] overflow-hidden shadow-2xl font-inter">
        {loading ? (
          <div className="py-24 text-center opacity-30">
             <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-[#00d2b4]" />
             <p className="text-[12px] font-bold uppercase tracking-widest text-[#4E7A96]">Syncing Provider Network...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">Business Identity</th>
                <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">Contact Info</th>
                <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">Status</th>
                <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {providers.length > 0 ? providers.map((p, i) => (
                <tr key={p.id} className="hover:bg-white/[0.01] transition-all group">
                  <td className="px-12 py-8 font-manrope">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                          <Briefcase className="w-5 h-5 shadow-sm" strokeWidth={2.5}/>
                        </div>
                        <div>
                            <div className="text-white font-extrabold text-[17px] uppercase tracking-tight group-hover:text-amber-400 transition-colors">{p.businessName || p.fullName || 'Unknown'}</div>
                            <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-widest mt-1.5 opacity-60 font-inter flex items-center gap-1.5">
                                <MapPin className="w-3 h-3"/> {p.businessAddress || p.address || p.location || 'Location Pending'}
                            </div>
                        </div>
                      </div>
                  </td>
                  <td className="px-12 py-8">
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-[#4E7A96] uppercase tracking-widest opacity-80 font-inter lowercase">
                           <Mail className="w-3.5 h-3.5 text-blue-400" /> {p.contactEmail || p.email || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-[#4E7A96] uppercase tracking-widest opacity-80 font-inter">
                           <Phone className="w-3.5 h-3.5 text-emerald-400" /> {p.contactPhone || p.phone || p.phoneNumber || 'N/A'}
                        </div>
                     </div>
                  </td>
                  <td className="px-12 py-8">
                    <span className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest font-inter flex items-center gap-2 w-max ${
                        p.status === 'ACTIVE' || p.status === 'VERIFIED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                        p.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                      <Activity className="w-3 h-3" /> {p.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-12 py-8 text-right">
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="p-3 rounded-xl hover:bg-red-500/10 text-[#4E7A96] hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan="4" className="px-12 py-24 text-center opacity-30">
                      <Briefcase className="w-12 h-12 mx-auto mb-6 text-[#4E7A96]" strokeWidth={1.5} />
                      <p className="text-[12px] font-bold uppercase tracking-[5px] text-[#4E7A96]">No Providers Registered</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && <ProviderFormModal onClose={() => setShowModal(false)} onSubmit={handleAddProvider} />}
    </DashboardLayout>
  );
};
