import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProvPricingForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    if (!formData.rateHour || parseFloat(formData.rateHour) < 100) e_s.rateHour = 'Rate required (Min 100)';
    if (!formData.is247 && formData.operatingDays.length === 0) e_s.operatingDays = 'Select at least one operating day';
    ['bankName', 'accountNo', 'accountName'].forEach(f => { if (!formData[f]) e_s[f] = 'Required'; });

    setErrors(e_s);

    if (Object.keys(e_s).length === 0) {
      Object.entries(formData).forEach(([k, v]) => sessionStorage.setItem('prov_' + k, typeof v === 'object' ? JSON.stringify(v) : v));
      navigate('/provider/register/step5');
      window.scrollTo(0, 0);
    }
  };

  const renderSection = (icon, title, optional = false) => (
    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest pb-3 mb-4 text-[#475569] border-b border-white/7">
      <span className="text-[#A78BFA]">{icon}</span> {title} {!optional && <span className="text-rose-500">*</span>}
    </div>
  );

  const rate = parseFloat(formData.rateHour);
  const showPreview = !isNaN(rate) && rate >= 100;

  return (
    <div className="w-full font-dm animate-[fadeUp_0.4s_ease_both]">
      <div className="mb-7">
        <div className="text-[11px] font-semibold uppercase tracking-widest mb-2 text-[#475569]">Step 4 of 5</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-2">Pricing & Schedule</h2>
        <p className="text-sm text-[#64748B]">Set your charging rates and operating hours.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          {renderSection('💰', 'Charging Rates')}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[#475569]">Rate per Hour (LKR) <span className="text-rose-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">💰</span>
                <input name="rateHour" type="number" min="100" placeholder="e.g. 700" value={formData.rateHour} onChange={handleChange} className={`w-full py-3 px-4 pl-10 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#A78BFA]/60 focus:bg-[#A78BFA]/5 ${errors.rateHour ? 'border-rose-500/50 bg-rose-500/5' : formData.rateHour ? 'border-[#A78BFA]/45' : ''}`}/>
              </div>
              {errors.rateHour && <div className="text-[11px] mt-1 text-rose-500">⚠ {errors.rateHour}</div>}
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[#475569]">Min. Booking (hrs) <span className="text-rose-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none z-10">⏱</span>
                <select name="minBooking" value={formData.minBooking} onChange={handleChange} className="w-full py-3 px-4 pl-10 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none appearance-none transition-all focus:border-[#A78BFA]/60 focus:bg-[#A78BFA]/5">
                  <option value="0.5" className="bg-[#0A0F1E]">0.5 hour</option>
                  <option value="1" className="bg-[#0A0F1E]">1 hour</option>
                  <option value="1.5" className="bg-[#0A0F1E]">1.5 hours</option>
                  <option value="2" className="bg-[#0A0F1E]">2 hours</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#475569] pointer-events-none">▾</span>
              </div>
            </div>
          </div>

          {showPreview && (
            <div className="rounded-xl p-4 mb-4 bg-[#A78BFA]/10 border border-[#A78BFA]/20 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="text-[11px] font-bold uppercase tracking-wider mb-3 text-[#A78BFA]">Estimated Earnings Preview</div>
              <div className="flex justify-between text-sm mb-1.5"><span className="text-[#94A3B8]">Rate per hour</span><span className="text-white font-semibold">LKR {rate.toFixed(0)}/hr</span></div>
              <div className="flex justify-between text-sm mb-1.5"><span className="text-[#94A3B8]">Platform commission (15%)</span><span className="text-rose-400 font-semibold">− LKR {(rate * 0.15).toFixed(0)}</span></div>
              <div className="h-[1px] bg-white/10 my-2"></div>
              <div className="flex justify-between text-sm"><span className="text-white font-semibold">Your hourly payout</span><span className="text-emerald-400 font-bold text-base">LKR {(rate * 0.85).toFixed(0)}/hr</span></div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[#475569]">Payment Methods Accepted</label>
            <div className="flex flex-wrap gap-2">
              {['Card', 'Mobile Pay', 'Cash', 'Online'].map(m => (
                <div key={m} onClick={() => toggleArrayItem('paymentMethods', m)} className={`border-[1.5px] rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all ${formData.paymentMethods.includes(m) ? 'border-[#A78BFA] bg-[#A78BFA]/15 text-[#A78BFA] shadow-[0_0_12px_rgba(167,139,250,0.18)]' : 'border-white/10 bg-white/3 text-[#94A3B8] hover:border-[#A78BFA]/35 hover:text-[#EFF6FF]'}`}>
                  {m === 'Card' ? '💳' : m === 'Mobile Pay' ? '📱' : m === 'Cash' ? '💵' : '🌐'} {m}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          {renderSection('📅', 'Operating Days')}
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} onClick={() => toggleArrayItem('operatingDays', d)} className={`border-[1.5px] rounded-lg py-2 text-center text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all ${formData.operatingDays.includes(d) ? 'border-[#A78BFA] bg-[#A78BFA]/15 text-[#A78BFA] shadow-[0_0_12px_rgba(167,139,250,0.18)]' : 'border-white/10 bg-white/3 text-[#94A3B8] hover:border-[#A78BFA]/35 hover:text-[#EFF6FF]'}`}>
                {d}
              </div>
            ))}
          </div>
          {errors.operatingDays && <div className="text-[11px] mb-3 text-rose-500">⚠ {errors.operatingDays}</div>}

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[#475569]">Opening Time <span className="text-rose-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">🌅</span>
                <input name="openTime" type="time" value={formData.openTime} onChange={handleChange} disabled={formData.is247} className={`w-full py-3 px-4 pl-10 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#A78BFA]/60 focus:bg-[#A78BFA]/5 ${formData.is247 ? 'opacity-50' : ''}`} style={{ colorScheme: 'dark' }}/>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[#475569]">Closing Time <span className="text-rose-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">🌙</span>
                <input name="closeTime" type="time" value={formData.closeTime} onChange={handleChange} disabled={formData.is247} className={`w-full py-3 px-4 pl-10 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#A78BFA]/60 focus:bg-[#A78BFA]/5 ${formData.is247 ? 'opacity-50' : ''}`} style={{ colorScheme: 'dark' }}/>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer" onClick={() => setFormData(p => ({ ...p, is247: !p.is247 }))}>
            <div className={`w-[22px] h-[22px] min-w-[22px] rounded-md border-[1.5px] flex items-center justify-center transition-all ${formData.is247 ? 'bg-[#A78BFA] border-[#A78BFA] shadow-[0_0_10px_rgba(167,139,250,0.4)]' : 'bg-white/5 border-white/15'}`}>
              {formData.is247 && <span className="text-[#0A0F1E] text-xs font-bold leading-none">✓</span>}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Open 24/7</div>
              <div className="text-xs text-[#475569]">Station is available around the clock, all days</div>
            </div>
          </div>
        </div>

        <div>
          {renderSection('🏦', 'Bank Account (for Payouts)')}
          <div className="rounded-xl p-3 mb-4 flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-sm mt-0.5">🔒</span>
            <div className="text-[12px] text-[#94A3B8]">Bank details are encrypted and used only for transferring your earnings.</div>
          </div>
          <div className="mb-4">
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[#475569]">Bank Name <span className="text-rose-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none z-10">🏦</span>
              <select name="bankName" value={formData.bankName} onChange={handleChange} className={`w-full py-3 px-4 pl-10 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none appearance-none transition-all focus:border-[#A78BFA]/60 focus:bg-[#A78BFA]/5 ${errors.bankName ? 'border-rose-500/50 bg-rose-500/5' : formData.bankName ? 'border-[#A78BFA]/45' : ''}`}>
                <option value="" className="bg-[#0A0F1E]">Select bank</option>
                {["Bank of Ceylon", "People's Bank", "Commercial Bank", "Sampath Bank", "HNB", "NSB", "Seylan Bank", "Nations Trust Bank", "Pan Asia Bank", "Union Bank"].map(b => <option key={b} value={b} className="bg-[#0A0F1E]">{b}</option>)}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#475569] pointer-events-none">▾</span>
            </div>
            {errors.bankName && <div className="text-[11px] mt-1 text-rose-500">⚠ Required</div>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[#475569]">Account Number <span className="text-rose-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">🔢</span>
                <input name="accountNo" type="text" placeholder="e.g. 1234567890" value={formData.accountNo} onChange={handleChange} className={`w-full py-3 px-4 pl-10 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#A78BFA]/60 focus:bg-[#A78BFA]/5 ${errors.accountNo ? 'border-rose-500/50 bg-rose-500/5' : formData.accountNo ? 'border-[#A78BFA]/45' : ''}`}/>
              </div>
              {errors.accountNo && <div className="text-[11px] mt-1 text-rose-500">⚠ Required</div>}
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[#475569]">Account Name <span className="text-rose-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">👤</span>
                <input name="accountName" type="text" placeholder="Holder name" value={formData.accountName} onChange={handleChange} className={`w-full py-3 px-4 pl-10 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#A78BFA]/60 focus:bg-[#A78BFA]/5 ${errors.accountName ? 'border-rose-500/50 bg-rose-500/5' : formData.accountName ? 'border-[#A78BFA]/45' : ''}`}/>
              </div>
              {errors.accountName && <div className="text-[11px] mt-1 text-rose-500">⚠ Required</div>}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 font-syne">
          <button type="button" onClick={() => navigate('/provider/register/step3')} className="px-8 py-3 rounded-xl font-semibold text-sm bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white transition-all">← Back</button>
          <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl font-bold text-[15px] bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white shadow-[0_6px_24px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 transition-all">Review & Submit →</button>
        </div>
      </form>
    </div>
  );
};

export default ProvPricingForm;
