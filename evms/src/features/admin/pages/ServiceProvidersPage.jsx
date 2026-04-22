import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';
import { PageHeader } from '../components/AdminComponents';
import { getAllProviders, getAllProviderRequests, approveProviderRequest } from '../../../firestore/providerDb';
import { Loader2, Briefcase, Mail, Phone, MapPin, Activity, CheckCircle, Clock } from 'lucide-react';

export const ServiceProviders = () => {
  const [activeProviders, setActiveProviders] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'active'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [providersData, requestsData] = await Promise.all([
        getAllProviders(),
        getAllProviderRequests()
      ]);
      setActiveProviders(providersData);
      // Filter out only PENDING requests for the requests tab
      setPendingRequests(requestsData.filter(r => r.status === 'PENDING'));
      
      // Auto-switch tab if there are requests for better UX
      if (requestsData.some(r => r.status === 'PENDING')) {
        setActiveTab('requests');
      } else {
        setActiveTab('active');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request) => {
    if (window.confirm(`Approve ${request.name || 'this request'} as a Service Provider?`)) {
      try {
        setLoading(true);
        await approveProviderRequest(request.id, request);
        alert("Provider approved successfully!");
        await fetchData();
      } catch (err) {
        console.error(err);
        alert("Failed to approve request.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <DashboardLayout title="Network Management">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
        <PageHeader title="Service Providers" subtitle="Manage registered node operators and partner networks." />
        
        <div className="flex bg-white/[0.03] border border-white/10 rounded-2xl p-1.5 shadow-inner">
          <button 
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
              activeTab === 'requests' ? 'bg-[#00d2b4] text-[#050f1c] shadow-lg shadow-[#00d2b4]/20' : 'text-[#4E7A96] hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            Pending Requests ({pendingRequests.length})
          </button>
          <button 
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
              activeTab === 'active' ? 'bg-[#00d2b4] text-[#050f1c] shadow-lg shadow-[#00d2b4]/20' : 'text-[#4E7A96] hover:text-white'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Active Grid ({activeProviders.length})
          </button>
        </div>
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
                <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">Identity</th>
                <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">Communication</th>
                <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">Network Status</th>
                <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(activeTab === 'active' ? activeProviders : pendingRequests).length > 0 ? 
                (activeTab === 'active' ? activeProviders : pendingRequests).map((p, i) => (
                <tr key={p.id} className="hover:bg-white/[0.01] transition-all group animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="px-12 py-8 font-manrope">
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-inner ${activeTab === 'active' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                          <Briefcase className="w-5 h-5 shadow-sm" strokeWidth={2.5}/>
                        </div>
                        <div>
                            <div className="text-white font-extrabold text-[17px] uppercase tracking-tight group-hover:text-[#00d2b4] transition-colors">{p.businessName || p.name || p.fullName || 'Unknown Entity'}</div>
                            <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-widest mt-1.5 opacity-60 font-inter flex items-center gap-1.5">
                                <MapPin className="w-3 h-3"/> {p.location || p.businessAddress || p.address || 'Address Pending'}
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
                           <Phone className="w-3.5 h-3.5 text-emerald-400" /> {p.phone || p.contactPhone || 'N/A'}
                        </div>
                     </div>
                  </td>
                  <td className="px-12 py-8 text-center sm:text-left">
                    <span className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest font-inter flex items-center gap-2 w-max ${
                        p.status === 'ACTIVE' || p.status === 'VERIFIED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                        p.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse' : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                      <Activity className="w-3 h-3" /> {p.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-12 py-8 text-right font-inter">
                      {activeTab === 'requests' ? (
                        <button 
                          onClick={() => handleApprove(p)}
                          className="px-6 py-2 rounded-xl bg-[#00d2b4] text-[#050f1c] text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#00d2b4]/20"
                        >
                          Approve Grid Access
                        </button>
                      ) : (
                        <div className="flex flex-col items-end">
                          <div className="text-[11px] font-black text-white uppercase tracking-widest leading-none">NODE {p.id?.slice(-6).toUpperCase()}</div>
                          <div className="text-[9px] font-bold text-[#4E7A96] uppercase tracking-[2px] mt-1.5 opacity-60">Verified Grid Partner</div>
                        </div>
                      )}
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan="4" className="px-12 py-24 text-center opacity-30">
                      <Briefcase className="w-12 h-12 mx-auto mb-6 text-[#4E7A96]" strokeWidth={1.5} />
                      <p className="text-[12px] font-bold uppercase tracking-[5px] text-[#4E7A96]">
                        {activeTab === 'requests' ? 'No Pending Applications' : 'No Providers Registered'}
                      </p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};
