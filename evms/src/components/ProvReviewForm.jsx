import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProviderProfile } from '../firestore/providerDb';

const ProvReviewForm = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const get = (k, def = '—') => sessionStorage.getItem('prov_' + k) || def;
    setData({
      email: get('email'),
      companyName: get('companyName'),
      bizType: get('bizType'),
      contact: `${get('contactPerson')} · ${get('phone')}`,
      bizLoc: [get('stCity'), get('stDistrict')].filter(v => v !== '—').join(', ') || '—',
      stationName: get('stationName'),
      chargeType: get('chargeType'),
      connectors: get('connectors').replace(/[\[\]"]/g, ''),
      slots: `${get('slots')} slots`,
      rate: parseFloat(get('rateHour') || 0),
      schedule: get('is247') === 'true' ? '24/7' : `${get('openTime')} - ${get('closeTime')}`,
      bank: get('bankName')
    });
  }, []);

  const handleSubmit = async () => {
    if (!terms) return setError(true);
    setError(false);
    
    const uid = sessionStorage.getItem('prov_uid');
    if (!uid) { alert('Session expired. Please start over.'); return; }

    setLoading(true);
    try {
      await saveProviderProfile(uid, data);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full text-center py-10 animate-scale-up">
        <div className="relative inline-block mb-10">
           <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-5xl text-white shadow-[0_0_60px_rgba(59,130,246,0.4)] relative z-10 animate-bounce">
             🏢
           </div>
           <div className="absolute inset-0 bg-blue-500/20 blur-2xl animate-pulse -z-10"></div>
        </div>
        
        <h2 className="font-syne text-4xl font-extrabold text-white mb-4 tracking-tight uppercase">System Deployed!</h2>
        <p className="text-[#8AAFC8] text-lg font-medium max-w-sm mx-auto mb-10 leading-relaxed">
           Application for <span className="text-white font-black">{data.companyName}</span> is now in the verification queue.
        </p>

        <div className="glass-panel rounded-[32px] p-8 text-left mb-10 max-w-sm mx-auto border-white/5 relative overflow-hidden">
           <div className="text-[10px] font-black uppercase tracking-[4px] text-blue-400 mb-6">Verification Pipeline</div>
           <div className="space-y-6">
              {[
                { n: '1', t: 'Entity Audit', s: 'Admin team verifying credentials', c: 'text-blue-400' },
                { n: '2', t: 'Access Unlock', s: 'Portal access keys will be mailed', c: 'text-[#4E7A96]' },
                { n: '3', t: 'Node Live', s: 'Station appears on public map', c: 'text-[#4E7A96]' }
              ].map((s, i) => (
                <div key={i} className="flex gap-4">
                   <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-white shrink-0">{s.n}</div>
                   <div>
                      <div className={`text-sm font-black uppercase tracking-widest ${s.c}`}>{s.t}</div>
                      <div className="text-[10px] font-bold text-[#4E7A96]">{s.s}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <button 
           onClick={() => navigate('/login')} 
           className="w-full sm:w-auto px-12 py-5 rounded-[24px] font-black uppercase tracking-[3px] bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-500 bg-[length:200%_auto] text-white shadow-2xl shadow-blue-500/30 hover:bg-right transition-all duration-700"
        >
          Exit Setup →
        </button>
      </div>
    );
  }

  const SummaryNode = ({ title, color, items, icon }) => (
    <div className="glass-panel rounded-[28px] p-6 border-white/5 group relative overflow-hidden transition-all hover:border-white/20">
       <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-lg" style={{ color }}>{icon}</div>
          <div className="text-[10px] font-black uppercase tracking-[3px]" style={{ color }}>{title}</div>
       </div>
       <div className="space-y-4">
          {items.map(([l, v], i) => (
            <div key={i} className="flex flex-col gap-1">
               <div className="text-[9px] font-bold text-[#4E7A96] uppercase tracking-[2px]">{l}</div>
               <div className="text-[13px] font-bold text-white truncate">{v}</div>
            </div>
          ))}
       </div>
    </div>
  );

  return (
    <div className="w-full animate-fade-up">
      <div className="mb-10 p-6 rounded-[32px] glass-panel border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none"></div>
        <div className="text-[10px] font-black uppercase tracking-[4px] mb-3 text-blue-400 opacity-80">Phase 05 · Core Audit</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-2 leading-none uppercase tracking-tight">System Review</h2>
        <p className="text-sm text-[#8AAFC8] font-medium leading-relaxed">Perform a final audit of your node configuration before deployment.</p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 mb-10">
         <SummaryNode 
            title="Corporate Node" icon="🏢" color="#10B981"
            items={[['Identity', data.companyName], ['Domain', data.bizType]]}
         />
         <SummaryNode 
            title="Hardware Node" icon="⚡" color="#F59E0B"
            items={[['Alias', data.stationName], ['Energy', data.chargeType]]}
         />
         <SummaryNode 
            title="Yield Intel" icon="💰" color="#8B5CF6"
            items={[['Market Rate', `LKR ${data.rate}/hr`], ['Payout', `LKR ${(data.rate * 0.85).toFixed(0)}`]]}
         />
         <SummaryNode 
            title="Grid Access" icon="🗓️" color="#3B82F6"
            items={[['Uptime', data.schedule], ['Settlement', data.bank]]}
         />
      </div>

      <div className="space-y-4 mb-10 px-4">
         <div 
            onClick={() => !loading && setTerms(!terms)}
            className="flex items-center gap-4 cursor-pointer group"
         >
            <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${terms ? 'bg-blue-500 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/5 border-white/10 group-hover:border-white/30'}`}>
               {terms && <span className="text-white text-sm font-bold">✓</span>}
            </div>
            <p className="text-[12px] font-bold text-[#8AAFC8] transition-colors group-hover:text-white leading-tight">
               I certify that all node data is accurate and agree to the <span className="text-blue-400 hover:underline">Provider Agreement</span>.
            </p>
         </div>
         {error && <p className="ml-11 text-[10px] font-black text-rose-400 uppercase tracking-widest animate-pulse">Required for deployment</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            type="button" 
            onClick={() => !loading && navigate('/provider/register/step4')} 
            className="order-2 sm:order-1 px-10 py-5 rounded-[24px] font-black uppercase tracking-[2px] transition-all bg-white/5 border-2 border-white/10 text-white hover:bg-white/10"
          >
            ← Modify
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="order-1 sm:order-2 flex-1 py-5 rounded-[24px] font-black uppercase tracking-[3px] transition-all bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-blue-500/30 group flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>🚀 Deploy Application <span className="group-hover:translate-x-2 transition-transform">→</span></>
            )}
          </button>
      </div>
    </div>
  );
};

export default ProvReviewForm;
