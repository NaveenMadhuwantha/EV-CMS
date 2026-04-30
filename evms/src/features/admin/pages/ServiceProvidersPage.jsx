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
        
        <div className="flex bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-1.5 shadow-inner">
          <button 
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
              activeTab === 'requests' ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Clock className="w-4 h-4" />
            Pending Requests ({pendingRequests.length})
          </button>
          <button 
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
              activeTab === 'active' ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Active Grid ({activeProviders.length})
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[40px] overflow-hidden shadow-xl font-inter">
        {loading ? (
          <div className="py-24 text-center text-[#64748B]">
             <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 opacity-30" />
             <p className="text-[12px] font-bold uppercase tracking-widest leading-loose">Syncing Provider Network...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[3px]">Identity</th>
                <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[3px]">Communication</th>
                <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[3px]">Network Status</th>
                <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[3px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {(activeTab === 'active' ? activeProviders : pendingRequests).length > 0 ? 
                (activeTab === 'active' ? activeProviders : pendingRequests).map((p, i) => (
                <tr key={p.id} className="hover:bg-[#F8FAFC] transition-all group animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="px-12 py-8 font-manrope">
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-inner ${activeTab === 'active' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                          <Briefcase className="w-5 h-5" strokeWidth={2.5}/>
                        </div>
                        <div>
                            <div className="text-[#0F172A] font-extrabold text-[17px] uppercase tracking-tight group-hover:text-[#3B82F6] transition-colors">{p.businessName || p.name || p.fullName || 'Unknown Entity'}</div>
                            <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mt-1.5 font-inter flex items-center gap-1.5">
                                <MapPin className="w-3 h-3"/> {p.location || p.businessAddress || p.address || 'Address Pending'}
                            </div>
                        </div>
                      </div>
                  </td>
                  <td className="px-12 py-8">
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-[#64748B] uppercase tracking-widest font-inter lowercase">
                           <Mail className="w-3.5 h-3.5 text-blue-500" /> {p.contactEmail || p.email || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-[#64748B] uppercase tracking-widest font-inter">
                           <Phone className="w-3.5 h-3.5 text-emerald-500" /> {p.phone || p.contactPhone || 'N/A'}
                        </div>
                     </div>
                  </td>
                  <td className="px-12 py-8 text-center sm:text-left">
                    <span className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest font-inter flex items-center gap-2 w-max ${
                        p.status === 'ACTIVE' || p.status === 'VERIFIED' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                        p.status === 'PENDING' ? 'bg-amber-50 border-amber-100 text-amber-600 animate-pulse' : 'bg-red-50 border-red-100 text-red-600'
                    }`}>
                      <Activity className="w-3 h-3" /> {p.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-12 py-8 text-right font-inter">
                      {activeTab === 'requests' ? (
                        <button 
                          onClick={() => handleApprove(p)}
                          className="px-6 py-2 rounded-xl bg-[#3B82F6] text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
                        >
                          Approve Grid Access
                        </button>
                      ) : (
                        <div className="flex flex-col items-end">
                          <div className="text-[11px] font-black text-[#0F172A] uppercase tracking-widest leading-none">NODE {p.id?.slice(-6).toUpperCase()}</div>
                          <div className="text-[9px] font-bold text-[#64748B] uppercase tracking-[2px] mt-1.5">Verified Grid Partner</div>
                        </div>
                      )}
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan="4" className="px-12 py-24 text-center text-[#94A3B8]">
                      <Briefcase className="w-12 h-12 mx-auto mb-6 opacity-20" strokeWidth={1.5} />
                      <p className="text-[12px] font-bold uppercase tracking-[5px]">
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
