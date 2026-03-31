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
    if (!formData.rateHour || parseFloat(formData.rateHour) < 100) e_s.rateHour = 'Minimum rate: 100 LKR';
    if (!formData.is247 && formData.operatingDays.length === 0) e_s.operatingDays = 'Select at least one operating day';
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
    <div className="w-full animate-fade-up font-inter">
      <div className="mb-10 p-8 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none"></div>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-3 text-purple-400 opacity-80">Phase 04 · Financial Model</div>
        <h2 className="font-manrope text-3xl font-extrabold text-white mb-3 tracking-tight leading-none uppercase">Pricing Model</h2>
        <p className="text-[15px] text-[#8AAFC8] font-medium leading-relaxed opacity-80">Establish your energy unit rates and merchant settlement preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 pb-10">
        
        {/* Market Pricing */}
        <div className="space-y-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                 <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Hourly Rate (LKR / Hr)</label>
                 <div className="relative group font-inter">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-30">💰</div>
                    <input name="rateHour" type="number" min="100" placeholder="700" className={`w-full py-4.5 px-6 pl-14 bg-white/5 border-2 rounded-2xl text-white font-bold outline-none transition-all ${errors.rateHour ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 focus:border-purple-400 focus:bg-purple-400/5 shadow-sm'}`} value={formData.rateHour} onChange={handleChange} />
                 </div>
                 {errors.rateHour && <p className="ml-2 text-[11px] font-bold text-red-400">{errors.rateHour}</p>}
              </div>
              <div className="space-y-3">
                 <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Minimum Booking</label>
                 <div className="relative group font-inter">
                    <select name="minBooking" className="w-full py-4.5 px-6 bg-white/5 border-2 border-white/5 rounded-2xl text-white font-bold outline-none appearance-none focus:border-purple-400 focus:bg-purple-400/5 transition-all" value={formData.minBooking} onChange={handleChange}>
                       <option value="0.5" className="bg-[#050F1C]">0.5 Hour Minimum</option>
                       <option value="1" className="bg-[#050F1C]">1.0 Hour Minimum</option>
                       <option value="2" className="bg-[#050F1C]">2.0 Hour Minimum</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-purple-400 text-xs">▼</div>
                 </div>
              </div>
           </div>

           {showPreview && (
              <div className="bg-purple-500/5 border border-purple-500/20 p-8 rounded-3xl animate-fade-in relative overflow-hidden group shadow-sm">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-[100px] pointer-events-none"></div>
                 <div className="text-[10px] font-bold uppercase tracking-widest mb-6 text-purple-400 opacity-80">Economic Projection Summary</div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-[14px] font-medium"><span className="text-[#8AAFC8]">Market Rate</span><span className="text-white font-bold font-manrope">LKR {rate.toFixed(0)}</span></div>
                    <div className="flex justify-between text-[14px] font-medium"><span className="text-[#8AAFC8]">Network Relay Fee (15%)</span><span className="text-red-400 font-bold font-manrope">- LKR {(rate * 0.15).toFixed(0)}</span></div>
                    <div className="h-px bg-white/5 my-4"></div>
                    <div className="flex justify-between items-center"><span className="text-[11px] font-bold uppercase tracking-widest text-[#4E7A96]">Net Profit Estimate</span><span className="text-emerald-400 font-extrabold text-xl font-manrope">LKR {(rate * 0.85).toFixed(0)}</span></div>
                 </div>
              </div>
           )}
        </div>

        {/* Operating Hours */}
        <div className="space-y-6">
           <div className="flex justify-between items-center px-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#4E7A96]">Operating Schedule</label>
              <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setFormData(p => ({ ...p, is247: !p.is247 }))}>
                 <div className={`w-12 h-6 rounded-full p-1 transition-all ${formData.is247 ? 'bg-emerald-500' : 'bg-white/10'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.is247 ? 'translate-x-6 shadow-md' : 'translate-x-0'}`}></div>
                 </div>
                 <span className={`text-[11px] font-bold uppercase tracking-widest ${formData.is247 ? 'text-emerald-400' : 'text-[#4E7A96]'}`}>24/7 Service</span>
              </div>
           </div>

           {!formData.is247 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
                 <input type="time" name="openTime" value={formData.openTime} onChange={handleChange} className="w-full py-4.5 px-6 bg-white/5 border-2 border-white/5 rounded-2xl text-white font-bold outline-none focus:border-purple-400 transition-all [color-scheme:dark]" />
                 <input type="time" name="closeTime" value={formData.closeTime} onChange={handleChange} className="w-full py-4.5 px-6 bg-white/5 border-2 border-white/5 rounded-2xl text-white font-bold outline-none focus:border-purple-400 transition-all [color-scheme:dark]" />
              </div>
           ) : (
              <div className="py-8 text-center bg-white/[0.02] border-2 border-dashed border-emerald-500/10 rounded-2xl text-[#8AAFC8] text-sm font-medium animate-pulse">Establishing continuous grid availability 24/7</div>
           )}

           <div className="flex flex-wrap gap-2.5 font-manrope">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} onClick={() => toggleArrayItem('operatingDays', day)} className={`px-5 py-3 rounded-2xl border-2 cursor-pointer transition-all text-[11px] font-extrabold uppercase tracking-widest shadow-sm ${formData.operatingDays.includes(day) || formData.is247 ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-white/5 bg-white/[0.02] text-[#4E7A96] hover:border-white/20'}`}>
                  {day}
                </div>
              ))}
           </div>
           {errors.operatingDays && <p className="ml-2 text-[11px] font-bold text-red-400">{errors.operatingDays}</p>}
        </div>

        {/* Bank Details */}
        <div className="p-8 rounded-[40px] bg-[#0a1628]/40 border-2 border-dashed border-white/5 hover:border-white/15 transition-all shadow-sm">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-xl shadow-inner">🏦</div>
              <h3 className="text-[14px] font-extrabold text-white font-manrope uppercase tracking-tight">Payer Bank Account</h3>
           </div>
           
           <div className="space-y-6 font-inter">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-3">
                    <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Bank Name</label>
                    <select name="bankName" value={formData.bankName} onChange={handleChange} className={`w-full py-4 px-6 bg-[#050F1C] border-2 rounded-2xl text-white font-bold outline-none appearance-none transition-all ${errors.bankName ? 'border-red-500/30' : 'border-white/5 focus:border-blue-400'}`}>
                       <option value="">Select Bank</option>
                       <option value="BOC">Bank of Ceylon</option>
                       <option value="People's Bank">People's Bank</option>
                       <option value="Sampath Bank">Sampath Bank</option>
                       <option value="Commercial Bank">Commercial Bank</option>
                       <option value="HNB">HNB</option>
                    </select>
                 </div>
                 <div className="space-y-3">
                    <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Account Number</label>
                    <input name="accountNo" type="text" placeholder="XXXX-XXXX-XXXX" className={`w-full py-4 px-6 bg-[#050F1C] border-2 rounded-2xl text-white font-bold outline-none transition-all ${errors.accountNo ? 'border-red-500/30' : 'border-white/5 focus:border-blue-400'}`} value={formData.accountNo} onChange={handleChange} />
                 </div>
              </div>
              <div className="space-y-3">
                 <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Account Holder Name</label>
                 <input name="accountName" type="text" placeholder="MR. J WICK" className={`w-full py-4 px-6 bg-[#050F1C] border-2 rounded-2xl text-white font-bold outline-none transition-all ${errors.accountName ? 'border-red-500/30' : 'border-white/5 focus:border-blue-400'}`} value={formData.accountName} onChange={handleChange} />
              </div>
           </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-5 pt-8 font-manrope">
           <button type="button" onClick={() => navigate('/provider/register/step3')} className="order-2 sm:order-1 px-10 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-white/[0.03] border border-white/10 text-[#7a9bbf] hover:text-white hover:bg-white/5 shadow-sm text-[12px]">← PREV</button>
           <button type="submit" className="order-1 sm:order-2 flex-1 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-purple-500/20 group flex items-center justify-center gap-4 text-[13px]">
              Proceed to Review & Submit <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
           </button>
        </div>
      </form>
    </div>
  );
};

export default ProvPricingForm;
