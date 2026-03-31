import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../shared/layouts/AdminLayout';
import { PageHeader } from '../components/AdminComponents';
import { getAllProviders } from '../../../firestore/providerDb';
import { Loader2, Briefcase, Mail, Phone, MapPin, Activity } from 'lucide-react';

export const ServiceProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <AdminLayout title="Service Providers">
      <div className="flex justify-between items-center mb-12">
        <PageHeader title="Service Providers" subtitle="Manage registered node operators and partner networks." />
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
                <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60 text-right">Verification</th>
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
                                <MapPin className="w-3 h-3"/> {p.address || p.location || 'Location Pending'}
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
                  <td className="px-12 py-8 text-right font-inter">
                      <div className="text-[11px] font-black text-white uppercase tracking-widest">UID: {p.id?.slice(-6).toUpperCase()}</div>
                      <div className="text-[9px] font-bold text-[#4E7A96] uppercase tracking-[2px] mt-1 opacity-60">ID VERIFIED: {p.nic ? 'YES' : 'NO'}</div>
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
    </AdminLayout>
  );
};
