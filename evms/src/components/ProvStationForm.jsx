import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProvStationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const fields = ['stationName', 'slots', 'description', 'chargeType', 'stAddress', 'stCity', 'stDistrict', 'lat', 'lng', 'stPhotoUrl'];
  const [formData, setFormData] = useState({
    ...fields.reduce((acc, f) => ({ ...acc, [f]: sessionStorage.getItem('prov_' + f) || '' }), {}),
    connectors: JSON.parse(sessionStorage.getItem('prov_connectors') || '[]'),
    amenities: JSON.parse(sessionStorage.getItem('prov_amenities') || '[]')
  });

  const districts = ["Colombo", "Gampaha", "Kandy", "Galle", "Matara", "Kurunegala", "Ratnapura", "Badulla", "Anuradhapura", "Polonnaruwa", "Trincomalee", "Batticaloa", "Jaffna", "Nuwara Eliya", "Kegalle", "Hambantota", "Kalutara", "Monaragala", "Puttalam", "Ampara"];

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const uid = sessionStorage.getItem('prov_uid') || 'anonymous';
      const storageRef = ref(storage, `station_photos/${uid}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(p => ({ ...p, stPhotoUrl: url }));
      sessionStorage.setItem('prov_stPhotoUrl', url);
    } catch (err) { alert("Upload failed."); } finally { setPhotoUploading(false); }
  };

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
    ['stationName', 'slots', 'chargeType', 'stAddress', 'stCity', 'stDistrict'].forEach(f => { if (!formData[f]) e_s[f] = 'Required'; });
    if (formData.connectors.length === 0) e_s.connectors = 'Select at least one';
    setErrors(e_s);

    if (Object.keys(e_s).length === 0) {
      Object.entries(formData).forEach(([k, v]) => sessionStorage.setItem('prov_' + k, typeof v === 'object' ? JSON.stringify(v) : v));
      navigate('/provider/register/step4');
      window.scrollTo(0, 0);
    }
  };

  const renderSection = (icon, title, optional = false, sub = '') => (
    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest pb-3 mb-4 text-[#475569] border-b border-white/7">
      <span className="text-[#FBBF24]">{icon}</span> {title} {optional && <span className="font-normal normal-case text-[10px] opacity-60 ml-1">(Optional)</span>} {!optional && <span className="text-rose-500">*</span>} {sub && <span className="font-normal normal-case text-[10px] ml-1">{sub}</span>}
    </div>
  );

  const renderInput = (name, label, icon, placeholder, type = "text", optional = false, extra = '') => (
    <div className="mb-4">
      <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[#475569]">{label} {!optional && <span className="text-rose-500">*</span>} {optional && <span className="font-normal normal-case text-[10px]">(Optional)</span>}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">{icon}</span>
        {type === 'textarea' ? (
          <textarea name={name} placeholder={placeholder} rows="3" value={formData[name]} onChange={handleChange} className={`w-full py-3 px-4 pl-12 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#FBBF24]/60 focus:bg-[#FBBF24]/5 placeholder:text-slate-600 resize-none ${errors[name] ? 'border-rose-500/50 bg-rose-500/5' : formData[name] ? 'border-[#FBBF24]/45' : ''}`} />
        ) : (
          <input name={name} type={type} placeholder={placeholder} value={formData[name]} onChange={handleChange} min={type === 'number' ? 1 : undefined} className={`w-full py-3 px-4 pl-12 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#FBBF24]/60 focus:bg-[#FBBF24]/5 placeholder:text-slate-600 ${errors[name] ? 'border-rose-500/50 bg-rose-500/5' : formData[name] ? 'border-[#FBBF24]/45' : ''}`} />
        )}
      </div>
      {extra && <div className="text-[11px] mt-1 text-[#475569]">{extra}</div>}
      {errors[name] && <p className="text-[11px] mt-1 text-rose-500">⚠ {errors[name]}</p>}
    </div>
  );

  return (
    <div className="w-full font-dm">
      <div className="mb-7">
        <div className="text-[11px] font-semibold uppercase tracking-widest mb-2 text-[#475569]">Step 3 of 5</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-2">Charging Station Details</h2>
        <p className="text-sm text-[#64748B]">Provide details about your first charging station. You can add more later.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          {renderSection('⚡', 'Station Information')}
          {renderInput('stationName', 'Station Name', '⚡', 'e.g. Colombo Central EV Hub')}
          {renderInput('slots', 'Total Charging Slots', '🔢', 'e.g. 8', 'number', false, 'Total number of vehicles that can charge simultaneously')}
          {renderInput('description', 'Station Description', '📝', 'Describe your station...', 'textarea', true)}
        </div>

        <div>
          {renderSection('🔌', 'Charging Type')}
          <div className="grid grid-cols-3 gap-3">
            {[{ id: 'DC Fast', icon: '⚡', l1: 'DC Fast', l2: '50–350 kW' }, { id: 'AC Level 2', icon: '🔌', l1: 'AC Level 2', l2: '7–22 kW' }, { id: 'AC Level 1', icon: '🔋', l1: 'AC Level 1', l2: '2.3–7 kW' }].map(t => (
              <div key={t.id} onClick={() => { setFormData({...formData, chargeType: t.id}); setErrors({...errors, chargeType: ''}); }}
                className={`border-2 rounded-xl p-3 text-center cursor-pointer transition-all ${formData.chargeType === t.id ? 'border-[#FBBF24] bg-[#FBBF24]/12 shadow-[0_0_16px_rgba(251,191,36,0.18)]' : 'border-white/10 bg-white/3 hover:border-[#FBBF24]/35 hover:bg-[#FBBF24]/5'}`}>
                <div className="text-3xl mb-2">{t.icon}</div>
                <div className="text-[12px] font-bold text-white">{t.l1}</div>
                <div className="text-[10px] mt-1 text-[#64748B]">{t.l2}</div>
              </div>
            ))}
          </div>
          {errors.chargeType && <p className="text-[11px] mt-1.5 text-rose-500">⚠ Select charging type</p>}
        </div>

        <div>
          {renderSection('🔗', 'Available Connectors')}
          <div className="flex flex-wrap gap-2">
            {[{ id: 'Type 2', icon: '⚡' }, { id: 'CCS2', icon: '🔌' }, { id: 'CHAdeMO', icon: '🔋' }, { id: 'Type 1', icon: '🔆' }, { id: 'GBT', icon: '🔷' }].map(c => (
              <div key={c.id} onClick={() => toggleArrayItem('connectors', c.id)} className={`border-[1.5px] rounded-full px-3.5 py-1.5 cursor-pointer transition-all text-xs font-semibold flex items-center gap-1.5 ${formData.connectors.includes(c.id) ? 'border-[#FBBF24] bg-[#FBBF24]/12 text-[#FBBF24]' : 'border-white/10 bg-white/3 text-[#94A3B8] hover:border-[#FBBF24]/35 hover:text-[#EFF6FF]'}`}>
                {c.icon} {c.id}
              </div>
            ))}
          </div>
          {errors.connectors && <p className="text-[11px] mt-1.5 text-rose-500">⚠ Select at least one connector</p>}
        </div>

        <div>
          {renderSection('📍', 'Station Location')}
          <div className="space-y-4">
            {renderInput('stAddress', 'Street Address', '🏠', 'Station street address')}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[#475569]">City <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">🌆</span>
                  <input name="stCity" type="text" placeholder="e.g. Colombo" value={formData.stCity} onChange={handleChange} className={`w-full py-3 px-4 pl-10 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#FBBF24]/60 focus:bg-[#FBBF24]/5 ${errors.stCity ? 'border-rose-500/50' : formData.stCity ? 'border-[#FBBF24]/45' : ''}`} />
                </div>
                {errors.stCity && <p className="text-[11px] mt-1 text-rose-500">⚠ Required</p>}
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[#475569]">District <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none z-10">📌</span>
                  <select name="stDistrict" value={formData.stDistrict} onChange={handleChange} className={`w-full py-3 px-4 pl-10 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none appearance-none transition-all focus:border-[#FBBF24]/60 focus:bg-[#FBBF24]/5 ${errors.stDistrict ? 'border-rose-500/50' : formData.stDistrict ? 'border-[#FBBF24]/45' : ''}`}>
                    <option value="" className="bg-[#0A0F1E]">Select district</option>
                    {districts.map(d => <option key={d} value={d} className="bg-[#0A0F1E]">{d}</option>)}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#475569]">▾</span>
                </div>
                {errors.stDistrict && <p className="text-[11px] mt-1 text-rose-500">⚠ Required</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[#475569]">GPS Latitude <span className="font-normal normal-case text-[10px]">(Optional)</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">🌐</span>
                  <input name="lat" type="number" step="any" placeholder="e.g. 6.9271" value={formData.lat} onChange={handleChange} className={`w-full py-3 px-4 pl-10 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#FBBF24]/60 focus:bg-[#FBBF24]/5 ${formData.lat ? 'border-[#FBBF24]/45' : ''}`} />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[#475569]">GPS Longitude <span className="font-normal normal-case text-[10px]">(Optional)</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">🌐</span>
                  <input name="lng" type="number" step="any" placeholder="e.g. 79.8612" value={formData.lng} onChange={handleChange} className={`w-full py-3 px-4 pl-10 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#FBBF24]/60 focus:bg-[#FBBF24]/5 ${formData.lng ? 'border-[#FBBF24]/45' : ''}`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
           {renderSection('🌟', 'Amenities', true, '(Select all that apply)')}
          <div className="flex flex-wrap gap-2">
            {[{ id: 'WiFi', icon: '📶' }, { id: 'Parking', icon: '🅿' }, { id: 'Restrooms', icon: '🚻' }, { id: 'CCTV', icon: '📷' }, { id: 'Café', icon: '☕' }, { id: '24/7', icon: '🕐' }, { id: 'Covered', icon: '🏗' }, { id: 'Disabled Access', icon: '♿' }].map(a => (
              <div key={a.id} onClick={() => toggleArrayItem('amenities', a.id)} className={`border-[1.5px] rounded-full px-3.5 py-1.5 cursor-pointer transition-all text-xs font-semibold flex items-center gap-1.5 ${formData.amenities.includes(a.id) ? 'border-[#FBBF24] bg-[#FBBF24]/12 text-[#FBBF24]' : 'border-white/10 bg-white/3 text-[#94A3B8] hover:border-[#FBBF24]/35 hover:text-[#EFF6FF]'}`}>
                {a.icon} {a.id}
              </div>
            ))}
          </div>
        </div>

        <div>
          {renderSection('📸', 'Station Photo', true)}
          <div onClick={() => document.getElementById('stphoto-inp').click()} className="border-2 border-dashed border-white/15 rounded-2xl p-6 text-center cursor-pointer hover:border-[#FBBF24]/40 hover:bg-[#FBBF24]/4 transition-all">
            {photoUploading ? <div className="py-2"><div className="w-8 h-8 border-2 border-[#FBBF24]/30 border-t-[#FBBF24] rounded-full animate-spin mx-auto"></div></div> : formData.stPhotoUrl ? 
              <div className="animate-in fade-in zoom-in duration-300">
                <img src={formData.stPhotoUrl} className="w-full max-h-36 rounded-xl mx-auto mb-3 object-cover border-2 border-[#FBBF24]" alt="Photo"/>
                <div className="text-xs text-[#FBBF24]">Photo uploaded ✓</div>
              </div> : <div><div className="text-3xl mb-1">📸</div><div className="text-sm font-semibold text-white">Upload Station Photo</div><div className="text-[10px] text-[#475569]">Max 5MB</div></div>}
            <input id="stphoto-inp" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload}/>
          </div>
        </div>

        <div className="flex gap-4 pt-4 font-syne">
          <button type="button" onClick={() => navigate('/provider/register/step2')} className="px-8 py-3 rounded-xl font-semibold text-sm bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white transition-all">← Back</button>
          <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl font-bold text-[15px] bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white shadow-[0_6px_24px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 transition-all">Continue to Pricing →</button>
        </div>
      </form>
    </div>
  );
};

export default ProvStationForm;
