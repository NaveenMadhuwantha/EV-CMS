import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProvBusinessForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fields = ['bizType', 'companyName', 'vatNo', 'contactPerson', 'phone', 'bizEmail', 'website'];
  const [formData, setFormData] = useState({
    ...fields.reduce((acc, f) => ({ ...acc, [f]: sessionStorage.getItem('prov_' + f) || '' }), {}),
    bizEmail: sessionStorage.getItem('prov_bizEmail') || sessionStorage.getItem('prov_email') || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e_s = {};
    ['bizType', 'companyName', 'contactPerson'].forEach(f => { if (!formData[f]) e_s[f] = 'Required'; });
    if (!/^0\d{9}$/.test(formData.phone)) e_s.phone = 'Invalid phone format';
    if (!/\S+@\S+\.\S+/.test(formData.bizEmail)) e_s.bizEmail = 'Invalid email format';
    setErrors(e_s);

    if (Object.keys(e_s).length === 0) {
      Object.entries(formData).forEach(([k, v]) => sessionStorage.setItem('prov_' + k, v));
      navigate('/provider/register/step3');
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="w-full animate-fade-up font-inter">
      <div className="mb-10 p-8 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none"></div>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-3 text-emerald-400 opacity-80">Phase 02 · Entity Profile</div>
        <h2 className="font-manrope text-3xl font-extrabold text-white mb-3 tracking-tight leading-none uppercase">Business Node</h2>
        <p className="text-[15px] text-[#8AAFC8] font-medium leading-relaxed opacity-80">Define your organizational structure for legal grid operations.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 pb-10">
        
        {/* Entity Type Selection */}
        <div className="space-y-4">
           <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Entity Type</label>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-manrope">
              {[
                { id: 'Private Company', icon: '🏢', label: 'Private Entity' },
                { id: 'Government', icon: '🏛', label: 'Public Sector' },
                { id: 'Individual', icon: '👤', label: 'Sole Owner' }
              ].map(t => (
                <div key={t.id} onClick={() => { setFormData({...formData, bizType: t.id}); setErrors({...errors, bizType: ''}); }}
                  className={`group relative py-7 px-4 rounded-[28px] border-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center shadow-sm
                    ${formData.bizType === t.id ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10' : 'border-white/5 bg-white/[0.02] hover:border-emerald-500/30'}
                  `}>
                  <div className={`text-3xl mb-3 transition-transform duration-300 ${formData.bizType === t.id ? 'scale-110' : 'group-hover:scale-110'}`}>{t.icon}</div>
                  <div className={`text-[11px] font-extrabold uppercase tracking-widest text-center ${formData.bizType === t.id ? 'text-emerald-400' : 'text-[#4E7A96]'}`}>{t.label}</div>
                  {formData.bizType === t.id && <div className="absolute top-3 right-3 text-[#050F1C] bg-emerald-500 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold animate-fade-in shadow-inner">✓</div>}
                </div>
              ))}
           </div>
           {errors.bizType && <p className="ml-2 text-[11px] font-bold text-red-400">Business type selection required</p>}
        </div>

        {/* Corporate Details */}
        <div className="space-y-6">
           <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Registered Legal Name</label>
              <input name="companyName" type="text" placeholder="e.g. Lanka Power Solutions PVT LTD" className={`w-full py-4.5 px-6 bg-white/5 border-2 rounded-2xl text-white font-bold outline-none transition-all ${errors.companyName ? 'border-red-500/30' : 'border-white/5 focus:border-emerald-500 focus:bg-emerald-500/5'}`} value={formData.companyName} onChange={handleChange} />
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                 <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Tax / VAT ID (Optional)</label>
                 <input name="vatNo" type="text" placeholder="TIN-XXXXXX" className="w-full py-4.5 px-6 bg-white/5 border-2 border-white/5 rounded-2xl text-white font-bold outline-none focus:border-emerald-500 transition-all font-inter" value={formData.vatNo} onChange={handleChange} />
              </div>
              <div className="space-y-3">
                 <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Chief Contact</label>
                 <input name="contactPerson" type="text" placeholder="John Wick" className={`w-full py-4.5 px-6 bg-white/5 border-2 rounded-2xl text-white font-bold outline-none transition-all ${errors.contactPerson ? 'border-red-500/30' : 'border-white/5 focus:border-emerald-500 focus:bg-emerald-500/5'}`} value={formData.contactPerson} onChange={handleChange} />
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                 <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Operational Hotline</label>
                 <input name="phone" type="tel" placeholder="071 234 5678" className={`w-full py-4.5 px-6 bg-white/5 border-2 rounded-2xl text-white font-bold outline-none transition-all ${errors.phone ? 'border-red-500/30' : 'border-white/5 focus:border-emerald-500 focus:bg-emerald-500/5'}`} value={formData.phone} onChange={handleChange} />
              </div>
              <div className="space-y-3">
                 <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Operational Email</label>
                 <input name="bizEmail" type="email" placeholder="operations@lankapower.lk" className={`w-full py-4.5 px-6 bg-white/5 border-2 rounded-2xl text-white font-bold outline-none transition-all ${errors.bizEmail ? 'border-red-500/30' : 'border-white/5 focus:border-emerald-500 focus:bg-emerald-500/5'}`} value={formData.bizEmail} onChange={handleChange} />
              </div>
           </div>

           <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Web Presence (Optional)</label>
              <input name="website" type="url" placeholder="https://www.lankapower.lk" className="w-full py-4.5 px-6 bg-white/5 border-2 border-white/5 rounded-2xl text-white font-bold outline-none focus:border-emerald-500 transition-all font-inter" value={formData.website} onChange={handleChange} />
           </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-5 pt-8 font-manrope">
           <button type="button" onClick={() => navigate('/provider/register')} className="order-2 sm:order-1 px-10 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-white/[0.03] border border-white/10 text-[#7a9bbf] hover:text-white hover:bg-white/5 shadow-sm text-[12px]">← PREV</button>
           <button type="submit" disabled={loading} className="order-1 sm:order-2 flex-1 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-gradient-to-r from-emerald-500 to-[#0A8F6A] text-[#050F1C] hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-emerald-500/20 group flex items-center justify-center gap-4 text-[13px]">
              Proceed to Station Setup <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
           </button>
        </div>
      </form>
    </div>
  );
};

export default ProvBusinessForm;
