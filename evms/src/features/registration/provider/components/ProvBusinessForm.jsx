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
    if (!/^0\d{9}$/.test(formData.phone.replace(/\s/g, ''))) e_s.phone = 'Invalid phone format';
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
      <div className="mb-5 px-7 py-5 rounded-[28px] bg-white border border-slate-100 relative overflow-hidden group shadow-[0_20px_50px_-20px_rgba(15,23,42,0.1)] transition-all hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.15)]">
        <div className="text-[15px] font-bold uppercase tracking-[4px] mb-4 text-emerald-600 font-manrope">Phase 02 · Entity Profile</div>
        <h2 className="font-manrope text-3xl font-extrabold text-[#0F172A] mb-3 tracking-tighter leading-tight uppercase">Business Station</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-transparent rounded-full mb-6"></div>
        <p className="text-[16px] text-slate-600 font-medium leading-relaxed max-w-sm">Define your corporate organizational structure for legal Sri Lankan grid integration.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-8">
        
        {/* Entity Type Selection */}
        <div className="space-y-3">
           <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Entity Type</label>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-manrope">
              {[
                { id: 'Private Company', icon: '🏢', label: 'Private Entity' },
                { id: 'Government', icon: '🏛', label: 'Public Sector' },
                { id: 'Individual', icon: '👤', label: 'Sole Owner' }
              ].map(t => (
                 <div key={t.id} onClick={() => { setFormData({...formData, bizType: t.id}); setErrors({...errors, bizType: ''}); }}
                  className={`group relative py-7 px-4 rounded-[28px] border-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center shadow-sm
                    ${formData.bizType === t.id ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10' : 'border-[#E2E8F0] bg-white/[0.02] hover:border-emerald-500/30'}
                  `}>
                  <div className={`text-3xl mb-3 transition-transform duration-300 ${formData.bizType === t.id ? 'scale-110' : 'group-hover:scale-110'}`}>{t.icon}</div>
                  <div className={`text-[13px] font-extrabold uppercase tracking-widest text-center ${formData.bizType === t.id ? 'text-emerald-600' : 'text-slate-500'}`}>{t.label}</div>
                  {formData.bizType === t.id && <div className="absolute top-3 right-3 text-white bg-emerald-500 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold animate-fade-in shadow-inner">✓</div>}
                </div>
              ))}
           </div>
           {errors.bizType && <p className="ml-2 text-[12px] font-bold text-rose-500">Business type selection required</p>}
        </div>

        <div className="space-y-2">
              <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Registered Legal Name</label>
              <input name="companyName" type="text" placeholder="e.g. Lanka Power Solutions PVT LTD" className={`w-full py-3.5 px-6 bg-[#F8FAFC] border-2 rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none transition-all ${errors.companyName ? 'border-red-500/30' : 'border-[#E2E8F0] focus:border-emerald-500 focus:bg-emerald-500/5'}`} value={formData.companyName} onChange={handleChange} />
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Tax / VAT ID (Optional)</label>
                 <input name="vatNo" type="text" placeholder="TIN-XXXXXX" className="w-full py-3.5 px-6 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none focus:border-emerald-500 transition-all font-inter" value={formData.vatNo} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                 <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Chief Contact</label>
                 <input name="contactPerson" type="text" placeholder="John Wick" className={`w-full py-3.5 px-6 bg-[#F8FAFC] border-2 rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none transition-all ${errors.contactPerson ? 'border-red-500/30' : 'border-[#E2E8F0] focus:border-emerald-500 focus:bg-emerald-500/5'}`} value={formData.contactPerson} onChange={handleChange} />
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Operational Hotline</label>
                 <input name="phone" type="tel" placeholder="071 234 5678" className={`w-full py-3.5 px-6 bg-[#F8FAFC] border-2 rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none transition-all ${errors.phone ? 'border-red-500/30' : 'border-[#E2E8F0] focus:border-emerald-500 focus:bg-emerald-500/5'}`} value={formData.phone} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                 <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Operational Email</label>
                 <input name="bizEmail" type="email" placeholder="operations@lankapower.lk" className={`w-full py-3.5 px-6 bg-[#F8FAFC] border-2 rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none transition-all ${errors.bizEmail ? 'border-red-500/30' : 'border-[#E2E8F0] focus:border-emerald-500 focus:bg-emerald-500/5'}`} value={formData.bizEmail} onChange={handleChange} />
              </div>
           </div>

           <div className="space-y-2">
              <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Web Presence (Optional)</label>
              <input name="website" type="url" placeholder="https://www.lankapower.lk" className="w-full py-3.5 px-6 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none focus:border-blue-500 transition-all font-inter" value={formData.website} onChange={handleChange} />
           </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-5 pt-8 font-manrope">
           <button type="button" onClick={() => navigate('/provider/register')} className="order-2 sm:order-1 px-10 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-white border border-[#E2E8F0] text-[#7a9bbf] hover:text-[#0F172A] hover:bg-[#F8FAFC] shadow-sm text-[14px]">← PREV</button>
           <button type="submit" disabled={loading} className="order-1 sm:order-2 flex-1 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/30 group flex items-center justify-center gap-4 text-[16px]">
              Proceed to Station Setup <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
           </button>
        </div>
      </form>
    </div>
  );
};

export default ProvBusinessForm;





