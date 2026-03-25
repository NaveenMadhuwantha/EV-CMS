import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProvBusinessForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
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

  const renderSection = (icon, title, optional = false) => (
    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest pb-3 mb-6 text-[#475569] border-b border-white/7">
      <span className="text-[#34D399]">{icon}</span> {title} {optional && <span className="text-[10px] normal-case opacity-60 ml-1">(Optional)</span>} {!optional && <span className="text-rose-500">*</span>}
    </div>
  );

  const renderInput = (name, label, icon, placeholder, type = "text", optional = false) => (
    <div className={name === 'companyName' || name === 'bizEmail' || name === 'website' ? 'w-full' : 'flex-1'}>
      <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[#475569]">{label} {!optional && <span className="text-rose-500">*</span>}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">{icon}</span>
        <input 
          name={name} type={type} placeholder={placeholder} value={formData[name]} onChange={handleChange}
          className={`w-full py-3 px-4 pl-12 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#34D399]/60 focus:bg-[#34D399]/5 placeholder:text-slate-600 ${errors[name] ? 'border-rose-500/50 bg-rose-500/5' : formData[name] ? 'border-[#34D399]/45' : ''}`}
        />
      </div>
      {errors[name] && <p className="text-[11px] mt-1.5 text-rose-500">⚠ {errors[name]}</p>}
    </div>
  );

  return (
    <div className="w-full font-dm">
      <div className="mb-7">
        <div className="text-[11px] font-semibold uppercase tracking-widest mb-2 text-[#475569]">Step 2 of 5</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-2">Business Information</h2>
        <p className="text-sm text-[#64748B]">Tell us about your company and organization type.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          {renderSection('🏢', 'Organization Type')}
          <div className="grid grid-cols-3 gap-3">
            {[{ id: 'Private Company', icon: '🏢', label: 'Private\nCompany' }, { id: 'Government', icon: '🏛', label: 'Government\nEntity' }, { id: 'Individual', icon: '👤', label: 'Individual\nOwner' }].map(t => (
              <div key={t.id} onClick={() => { setFormData({...formData, bizType: t.id}); setErrors({...errors, bizType: ''}); }}
                className={`border-2 rounded-2xl p-4 text-center cursor-pointer transition-all ${formData.bizType === t.id ? 'border-[#34D399] bg-[#34D399]/12' : 'border-white/10 bg-white/3 hover:border-[#34D399]/35'}`}>
                <div className="text-3xl mb-2">{t.icon}</div>
                <div className="text-[12px] font-semibold text-white whitespace-pre-line leading-tight">{t.label}</div>
              </div>
            ))}
          </div>
          {errors.bizType && <p className="text-[11px] mt-1.5 text-rose-500">⚠ Select type</p>}
        </div>

        <div>
          {renderSection('📋', 'Company Details')}
          <div className="space-y-4">
            {renderInput('companyName', 'Company / Business Name', '🏢', 'e.g. Lanka EV Solutions')}
            {renderInput('vatNo', 'VAT / TIN Number', '🔢', 'Optional', 'text', true)}
            <div className="flex gap-4">{renderInput('contactPerson', 'Contact Person', '👤', 'Full name')} {renderInput('phone', 'Phone Number', '📱', '07X XXX XXXX', 'tel')}</div>
            {renderInput('bizEmail', 'Business Email Address', '📧', 'info@company.lk', 'email')}
            {renderInput('website', 'Official Website', '🌐', 'https://www.company.lk', 'url', true)}
          </div>
        </div>

        <div className="flex gap-4 pt-4 font-syne">
          <button type="button" onClick={() => navigate('/provider/register')} className="px-8 py-3 rounded-xl font-semibold text-sm bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white transition-all">← Back</button>
          <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl font-bold text-[15px] bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white shadow-[0_6px_24px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 transition-all">Continue to Station Details →</button>
        </div>
      </form>
    </div>
  );
};

export default ProvBusinessForm;
