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
    if (!/^0\d{9}$/.test(formData.phone)) e_s.phone = 'Invalid phone';
    if (!/\S+@\S+\.\S+/.test(formData.bizEmail)) e_s.bizEmail = 'Invalid email';
    setErrors(e_s);

    if (Object.keys(e_s).length === 0) {
      Object.entries(formData).forEach(([k, v]) => sessionStorage.setItem('prov_' + k, v));
      navigate('/provider/register/step3');
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="w-full animate-fade-up">
      <div className="mb-8 p-6 rounded-[32px] glass-panel border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none"></div>
        <div className="text-[10px] font-black uppercase tracking-[4px] mb-3 text-emerald-400 opacity-80">Phase 02 · Entity Profile</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-2 leading-none uppercase tracking-tight">Business Node</h2>
        <p className="text-sm text-[#8AAFC8] font-medium leading-relaxed">Define your organizational structure for legal grid operations.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 pb-10">
        
        {/* Industry Classification */}
        <div className="space-y-4">
           <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Entity Type</label>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'Private Company', icon: '🏢', label: 'Private Entity' },
                { id: 'Government', icon: '🏛', label: 'Public Sector' },
                { id: 'Individual', icon: '👤', label: 'Sole Owner' }
              ].map(t => (
                <div key={t.id} onClick={() => { setFormData({...formData, bizType: t.id}); setErrors({...errors, bizType: ''}); }}
                  className={`group relative py-6 px-4 rounded-[28px] border-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center 
                    ${formData.bizType === t.id ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-white/10 bg-white/5 hover:border-emerald-500/30'}
                  `}>
                  <div className={`text-3xl mb-3 transition-transform ${formData.bizType === t.id ? 'scale-110' : 'group-hover:scale-110'}`}>{t.icon}</div>
                  <div className={`text-[10px] font-black uppercase tracking-widest text-center ${formData.bizType === t.id ? 'text-emerald-400' : 'text-[#4E7A96]'}`}>{t.label}</div>
                  {formData.bizType === t.id && <div className="absolute top-3 right-3 text-[#050F1C] bg-emerald-500 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold animate-fade-in">✓</div>}
                </div>
              ))}
           </div>
           {errors.bizType && <p className="ml-4 text-[11px] font-bold text-rose-400">Selection required</p>}
        </div>

        {/* Corporate Details */}
        <div className="space-y-6">
           <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Registered Legal Name</label>
              <input name="companyName" type="text" placeholder="e.g. Lanka Power Solutions PVT LTD" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all ${errors.companyName ? 'border-rose-500/30' : 'border-white/10 focus:border-emerald-500'}`} value={formData.companyName} onChange={handleChange} />
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Tax / VAT ID (Optional)</label>
                 <input name="vatNo" type="text" placeholder="TIN-XXXXXX" className="w-full py-5 px-6 bg-white/5 border-2 border-white/10 rounded-[24px] text-white font-bold outline-none focus:border-emerald-500 transition-all" value={formData.vatNo} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Chief Contact</label>
                 <input name="contactPerson" type="text" placeholder="John Wick" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all ${errors.contactPerson ? 'border-rose-500/30' : 'border-white/10 focus:border-emerald-500'}`} value={formData.contactPerson} onChange={handleChange} />
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Operational Hotline</label>
                 <input name="phone" type="tel" placeholder="071 234 5678" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all ${errors.phone ? 'border-rose-500/30' : 'border-white/10 focus:border-emerald-500'}`} value={formData.phone} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Operational Email</label>
                 <input name="bizEmail" type="email" placeholder="operations@lankapower.lk" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all ${errors.bizEmail ? 'border-rose-500/30' : 'border-white/10 focus:border-emerald-500'}`} value={formData.bizEmail} onChange={handleChange} />
              </div>
           </div>

           <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Web Presence (Optional)</label>
              <input name="website" type="url" placeholder="https://www.lankapower.lk" className="w-full py-5 px-6 bg-white/5 border-2 border-white/10 rounded-[24px] text-white font-bold outline-none focus:border-emerald-500 transition-all" value={formData.website} onChange={handleChange} />
           </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
           <button type="button" onClick={() => navigate('/provider/register')} className="order-2 sm:order-1 px-10 py-5 rounded-[24px] font-black uppercase tracking-[2px] transition-all bg-white/5 border-2 border-white/10 text-white hover:bg-white/10">← Prev</button>
           <button type="submit" disabled={loading} className="order-1 sm:order-2 flex-1 py-5 rounded-[24px] font-black uppercase tracking-[3px] transition-all bg-gradient-to-br from-emerald-500 to-[#0A8F6A] text-[#050F1C] hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-emerald-500/20 group flex items-center justify-center gap-3">
              Proceed to Station Setup <span className="group-hover:translate-x-2 transition-transform">→</span>
           </button>
        </div>
      </form>
    </div>
  );
};

export default ProvBusinessForm;
