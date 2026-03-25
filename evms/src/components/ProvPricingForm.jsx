import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProvPricingForm = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const fields = ['rateHour', 'minBooking', 'openTime', 'closeTime', 'bankName', 'accountNo', 'accountName'];
  const [formData, setFormData] = useState({
    ...fields.reduce((acc, f) => ({ ...acc, [f]: sessionStorage.getItem('prov_' + f) || '' }), {}),
    minBooking: sessionStorage.getItem('prov_minBooking') || '1',
    openTime: sessionStorage.getItem('prov_openTime') || '08:00',
    closeTime: sessionStorage.getItem('prov_closeTime') || '22:00',
    is247: sessionStorage.getItem('prov_is247') === 'true',
    paymentMethods: JSON.parse(sessionStorage.getItem('prov_paymentMethods') || '["Mobile Pay", "Online"]'),
    operatingDays: JSON.parse(sessionStorage.getItem('prov_operatingDays') || '[]')
  });

  useEffect(() => {
    if (formData.is247) setFormData(p => ({ ...p, openTime: '00:00', closeTime: '23:59' }));
  }, [formData.is247]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const toggleArrayItem = (field, item) => {
    setFormData(p => {
      const arr = p[field];
      const next = arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
      return { ...p, [field]: next };
    });
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e_s = {};
    if (!formData.rateHour || parseFloat(formData.rateHour) < 100) e_s.rateHour = 'Min rate: 100 LKR';
    if (!formData.is247 && formData.operatingDays.length === 0) e_s.operatingDays = 'Select operating days';
    ['bankName', 'accountNo', 'accountName'].forEach(f => { if (!formData[f]) e_s[f] = 'Required'; });

    setErrors(e_s);

    if (Object.keys(e_s).length === 0) {
      Object.entries(formData).forEach(([k, v]) => sessionStorage.setItem('prov_' + k, typeof v === 'object' ? JSON.stringify(v) : v));
      navigate('/provider/register/step5');
      window.scrollTo(0, 0);
    }
  };

  const rate = parseFloat(formData.rateHour);
  const showPreview = !isNaN(rate) && rate >= 100;

  return (
    <div className="w-full animate-fade-up">
      <div className="mb-8 p-6 rounded-[32px] glass-panel border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none"></div>
        <div className="text-[10px] font-black uppercase tracking-[4px] mb-3 text-purple-400 opacity-80">Phase 04 · Economics</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-2 leading-none uppercase tracking-tight">Financial Hub</h2>
        <p className="text-sm text-[#8AAFC8] font-medium leading-relaxed">Establish your pricing model and secure payout gateway.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 pb-10">
        
        {/* Market Pricing */}
        <div className="space-y-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Rate (LKR / Hour)</label>
                 <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-40">💰</div>
                    <input name="rateHour" type="number" min="100" placeholder="700" className={`w-full py-5 px-6 pl-14 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all ${errors.rateHour ? 'border-rose-500/30' : 'border-white/10 focus:border-purple-400'}`} value={formData.rateHour} onChange={handleChange} />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Booking Threshold</label>
                 <div className="relative group">
                    <select name="minBooking" className="w-full py-5 px-6 bg-white/5 border-2 border-white/10 rounded-[24px] text-white font-bold outline-none appearance-none focus:border-purple-400 transition-all" value={formData.minBooking} onChange={handleChange}>
                       <option value="0.5" className="bg-[#050F1C]">0.5 Hour Min</option>
                       <option value="1" className="bg-[#050F1C]">1 Hour Min</option>
                       <option value="2" className="bg-[#050F1C]">2 Hour Min</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▼</div>
                 </div>
              </div>
           </div>

           {showPreview && (
              <div className="glass-panel p-6 rounded-[32px] border-purple-500/20 animate-fade-in relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-[100px]"></div>
                 <div className="text-[10px] font-black uppercase tracking-[3px] mb-4 text-purple-400">Profit Projection</div>
                 <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-[#8AAFC8]">Market Rate</span><span className="text-white font-bold">LKR {rate.toFixed(0)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#8AAFC8]">Network Fee (15%)</span><span className="text-rose-400 font-bold">- LKR {(rate * 0.15).toFixed(0)}</span></div>
                    <div className="h-px bg-white/5 my-2"></div>
                    <div className="flex justify-between text-sm font-black"><span className="text-white">Hourly Yield</span><span className="text-emerald-400 text-lg">LKR {(rate * 0.85).toFixed(0)}</span></div>
                 </div>
              </div>
           )}

           <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Supported Protocols</label>
              <div className="flex flex-wrap gap-2">
                 {['Card', 'Mobile Pay', 'Cash', 'Online'].map(m => (
                   <div key={m} onClick={() => toggleArrayItem('paymentMethods', m)} className={`px-5 py-3 rounded-full border-2 cursor-pointer transition-all text-[11px] font-black tracking-widest uppercase ${formData.paymentMethods.includes(m) ? 'border-purple-400 bg-purple-400/10 text-purple-400 shadow-[0_0_20px_rgba(167,139,250,0.1)]' : 'border-white/10 bg-white/5 text-[#4E7A96] hover:border-white/30'}`}>
                      {m}
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Operational Availability */}
        <div className="space-y-6">
           <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Grid Presence (Days)</label>
              <div className="grid grid-cols-4 xs:grid-cols-7 gap-2">
                 {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                   <div key={d} onClick={() => toggleArrayItem('operatingDays', d)} className={`py-3 rounded-xl border-2 text-center text-[10px] font-black uppercase tracking-tighter cursor-pointer transition-all ${formData.operatingDays.includes(d) ? 'border-purple-400 bg-purple-400/10 text-purple-400' : 'border-white/10 bg-white/5 text-[#4E7A96] hover:border-white/20'}`}>
                      {d}
                   </div>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Start Cycle</label>
                 <input name="openTime" type="time" value={formData.openTime} onChange={handleChange} disabled={formData.is247} className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all [color-scheme:dark] ${formData.is247 ? 'opacity-30' : 'border-white/10 focus:border-purple-400'}`} />
              </div>
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">End Cycle</label>
                 <input name="closeTime" type="time" value={formData.closeTime} onChange={handleChange} disabled={formData.is247} className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all [color-scheme:dark] ${formData.is247 ? 'opacity-30' : 'border-white/10 focus:border-purple-400'}`} />
              </div>
           </div>

           <div onClick={() => setFormData(p => ({ ...p, is247: !p.is247 }))} className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all flex items-center gap-5 ${formData.is247 ? 'border-blue-400 bg-blue-400/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
              <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${formData.is247 ? 'bg-blue-400 border-blue-400 text-[#050F1C]' : 'border-white/10'}`}>
                 {formData.is247 && <span className="font-black">✓</span>}
              </div>
              <div>
                 <div className="text-sm font-black text-white uppercase tracking-widest">Constant Uplink (24/7)</div>
                 <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-wider">Operational throughout all cycles</div>
              </div>
           </div>
        </div>

        {/* Financial Gateway */}
        <div className="space-y-6">
           <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Payout Settlement Entity</label>
              <div className="relative group">
                 <select name="bankName" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none appearance-none transition-all ${errors.bankName ? 'border-rose-500/30' : 'border-white/10 focus:border-purple-400'}`} value={formData.bankName} onChange={handleChange}>
                    <option value="" className="bg-[#050F1C]">Select Payout Node</option>
                    {["Bank of Ceylon", "People's Bank", "Commercial Bank", "Sampath Bank", "HNB", "NSB", "Seylan Bank", "Nations Trust Bank", "Pan Asia Bank", "Union Bank"].map(b => <option key={b} value={b} className="bg-[#050F1C]">{b}</option>)}
                 </select>
                 <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▼</div>
              </div>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Network Interface ID (Account)</label>
                 <input name="accountNo" type="text" placeholder="Settlement ID" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all ${errors.accountNo ? 'border-rose-500/30' : 'border-white/10 focus:border-purple-400'}`} value={formData.accountNo} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Account Holder Key</label>
                 <input name="accountName" type="text" placeholder="Entity Name" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all ${errors.accountName ? 'border-rose-500/30' : 'border-white/10 focus:border-purple-400'}`} value={formData.accountName} onChange={handleChange} />
              </div>
           </div>
           
           <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[2px]">Encrypted Financial Layer Active 🛡️</p>
           </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
           <button type="button" onClick={() => navigate('/provider/register/step3')} className="order-2 sm:order-1 px-10 py-5 rounded-[24px] font-black uppercase tracking-[2px] transition-all bg-white/5 border-2 border-white/10 text-white hover:bg-white/10">← Prev</button>
           <button type="submit" className="order-1 sm:order-2 flex-1 py-5 rounded-[24px] font-black uppercase tracking-[3px] transition-all bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-purple-500/20 group flex items-center justify-center gap-3">
              Final System Audit <span className="group-hover:translate-x-2 transition-transform">→</span>
           </button>
        </div>
      </form>
    </div>
  );
};

export default ProvPricingForm;
