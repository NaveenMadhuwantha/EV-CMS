import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProviderProfile } from '../../../../firestore/providerDb';
import { registerStation } from '../../../../firestore/stationDb';

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

    const rawData = {};
    Object.keys(sessionStorage).forEach(k => {
      if (k.startsWith('prov_')) {
        let val = sessionStorage.getItem(k);
        try { val = JSON.parse(val); } catch(e) {}
        rawData[k.replace('prov_', '')] = val;
      }
    });

    setLoading(true);
    try {
      // 1. Save provider profile
      await saveProviderProfile(uid, rawData);
      
      // 2. Create initial station in the network
      await registerStation({
        name: rawData.stationName,
        location: `${rawData.stCity}, ${rawData.stDistrict}`,
        price: parseFloat(rawData.rateHour || 0),
        type: rawData.chargeType,
        providerId: uid,
        ownerEmail: rawData.email,
        status: 'LIVE'
      });

      setIsSuccess(true);
      Object.keys(sessionStorage).forEach(k => k.startsWith('prov_') && sessionStorage.removeItem(k));
      window.scrollTo(0, 0);
    } catch (err) {
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full text-center py-10 animate-fade-up font-inter">
        <div className="relative inline-block mb-10">
           <div className="w-32 h-32 rounded-[48px] bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-5xl text-white shadow-2xl relative z-10 animate-bounce">
             ✨
           </div>
           <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse -z-10"></div>
        </div>
        
        <h2 className="font-manrope text-4xl font-extrabold text-[#0F172A] mb-4 tracking-tight uppercase">Application Submitted!</h2>
        <p className="text-[#64748B] text-lg font-medium max-w-sm mx-auto mb-12 leading-relaxed font-inter">
           Your application for <span className="text-[#0F172A] font-extrabold">{data.companyName}</span> is now being processed by our team.
        </p>

        <div className="bg-white rounded-3xl p-8 text-left mb-12 max-w-sm mx-auto border border-[#E2E8F0] relative overflow-hidden shadow-sm">
           <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-8 opacity-80 font-manrope">What Happens Next?</div>
           <div className="space-y-7 font-inter">
              {[
                { n: '1', t: 'Verification', s: 'Admin team verifying credentials', c: 'text-blue-400' },
                { n: '2', t: 'Portal Access', s: 'Access keys will be mailed', c: 'text-[#64748B]' },
                { n: '3', t: 'Go Live', s: 'Station appears on public map', c: 'text-[#64748B]' }
              ].map((s, i) => (
                <div key={i} className="flex gap-4">
                   <div className="w-8 h-8 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[11px] font-extrabold text-[#0F172A] shrink-0">{s.n}</div>
                   <div>
                      <div className={`text-[13px] font-extrabold uppercase tracking-widest font-manrope ${s.c}`}>{s.t}</div>
                      <div className="text-[10px] font-bold text-[#64748B] mt-1 uppercase opacity-60 tracking-tight">{s.s}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <button 
           onClick={() => navigate('/')} 
           className="w-full sm:w-auto px-12 py-5 rounded-2xl font-extrabold uppercase tracking-widest bg-blue-600 text-white shadow-xl hover:brightness-110 active:scale-95 transition-all font-manrope text-[13px]"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-up font-inter">
      <div className="mb-6 p-8 rounded-3xl bg-white border border-[#E2E8F0] relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none"></div>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-3 text-indigo-400 opacity-80">Phase 05 · Review & Submit</div>
        <h2 className="font-manrope text-3xl font-extrabold text-[#0F172A] mb-3 tracking-tight leading-none uppercase">Review & Submit</h2>
        <p className="text-[15px] text-[#64748B] font-medium leading-relaxed opacity-80">Review your station details and submit for approval.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 font-inter">
        
        {/* Business Details */}
        <div className="bg-white/[0.02] rounded-[32px] p-8 border border-[#E2E8F0] font-inter">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-inner group">🏢</div>
              <h3 className="text-[11px] font-bold uppercase tracking-[4px] text-[#0F172A] font-manrope">Business Details</h3>
           </div>
           <div className="space-y-6">
              {[
                { l: 'Business Name', v: data.companyName },
                { l: 'Merchant Type', v: data.bizType },
                { l: 'Chief Contact', v: data.contact, c: 'text-[#64748B]' }
              ].map(i => (
                <div key={i.l} className="border-b border-[#E2E8F0] pb-4 last:border-none">
                   <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1 opacity-70">{i.l}</div>
                   <div className={`text-[15px] font-extrabold text-[#0F172A] truncate font-manrope ${i.c || ''}`}>{i.v}</div>
                </div>
              ))}
           </div>
        </div>

        {/* Station Details */}
        <div className="bg-white/[0.02] rounded-[32px] p-8 border border-[#E2E8F0] font-inter">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-inner group">⚡</div>
              <h3 className="text-[11px] font-bold uppercase tracking-[4px] text-[#0F172A] font-manrope">Station Details</h3>
           </div>
           <div className="space-y-6">
              {[
                { l: 'Station Name', v: data.stationName },
                { l: 'Station Slots', v: data.slots },
                { l: 'Station Type', v: data.chargeType, c: 'text-[#64748B]' }
              ].map(i => (
                <div key={i.l} className="border-b border-[#E2E8F0] pb-4 last:border-none">
                   <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1 opacity-70">{i.l}</div>
                   <div className={`text-[15px] font-extrabold text-[#0F172A] truncate font-manrope ${i.c || ''}`}>{i.v}</div>
                </div>
              ))}
           </div>
        </div>

        {/* Pricing & Schedule */}
        <div className="bg-white/[0.02] rounded-[32px] p-8 border border-[#E2E8F0] font-inter md:col-span-2">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner group">💰</div>
              <h3 className="text-[11px] font-bold uppercase tracking-[4px] text-[#0F172A] font-manrope">Pricing & Schedule</h3>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { l: 'Base Unit Rate', v: `Rs. ${data.rate} / Hr`, c: 'text-emerald-400' },
                { l: 'Operating Schedule', v: data.schedule },
                { l: 'Settlement Bank', v: data.bank, c: 'text-blue-400' }
              ].map(i => (
                <div key={i.l} className="pb-4 last:border-none font-inter">
                   <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1 opacity-70">{i.l}</div>
                   <div className={`text-[15px] font-extrabold text-[#0F172A] truncate font-manrope ${i.c || ''}`}>{i.v}</div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className={`p-8 rounded-[32px] border-2 border-dashed transition-all font-inter mb-10 ${terms ? 'border-emerald-500/20 bg-emerald-500/5' : error ? 'border-red-500/40 bg-red-500/5' : 'border-[#E2E8F0] bg-white/[0.02]'}`}>
         <div className="flex items-center gap-6 cursor-pointer select-none" onClick={() => { setTerms(!terms); setError(false); }}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${terms ? 'bg-emerald-500 text-[#0F172A]' : 'bg-[#F8FAFC] text-[#64748B]'}`}>
               {terms ? '✓' : ''}
            </div>
            <div className="flex-1">
               <h4 className="text-[14px] font-extrabold text-[#0F172A] font-manrope uppercase tracking-tight">Terms & Conditions</h4>
               <p className="text-[11px] text-[#64748B] font-medium leading-relaxed mt-1">I verify that all station node parameters provided above are accurate and operational.</p>
            </div>
         </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 font-manrope">
         <button type="button" onClick={() => navigate('/provider/register/step4')} className="order-2 sm:order-1 px-10 py-5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-white border border-[#E2E8F0] text-[#7a9bbf] hover:text-[#0F172A] hover:bg-[#F8FAFC] shadow-sm text-[12px]">← Back</button>
         <button 
           onClick={handleSubmit} 
           disabled={loading}
           className={`order-1 sm:order-2 flex-1 py-5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/20 group flex items-center justify-center gap-4 text-[13px]
              ${loading ? 'opacity-50 cursor-wait' : ''}
           `}
         >
            {loading ? 'Establishing Station...' : 'Submit Registration'}
            <span className="group-hover:translate-x-2 transition-transform duration-300">⚡</span>
         </button>
      </div>
    </div>
  );
};

export default ProvReviewForm;
