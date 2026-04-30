import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProvStationForm = () => {
  const navigate = useNavigate();
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
    } catch (err) { console.error(err); } finally { setPhotoUploading(false); }
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
    if (formData.connectors.length === 0) e_s.connectors = 'Select one Standard';
    setErrors(e_s);

    if (Object.keys(e_s).length === 0) {
      Object.entries(formData).forEach(([k, v]) => sessionStorage.setItem('prov_' + k, typeof v === 'object' ? JSON.stringify(v) : v));
      navigate('/provider/register/step4');
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="w-full animate-fade-up font-inter">
      <div className="mb-5 px-7 py-5 rounded-[28px] bg-white border border-slate-100 relative overflow-hidden group shadow-[0_20px_50px_-20px_rgba(15,23,42,0.1)] transition-all hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.15)]">
        <div className="text-[15px] font-bold uppercase tracking-[4px] mb-4 text-amber-600 font-manrope">Phase 03 · Infrastructure Station</div>
        <h2 className="font-manrope text-3xl font-extrabold text-[#0F172A] mb-3 tracking-tighter leading-tight uppercase">Station Setup</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-transparent rounded-full mb-6"></div>
        <p className="text-[16px] text-slate-600 font-medium leading-relaxed max-w-sm">Define your physical charging location and hardware specifications.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-8">
        
        {/* Basic Identity */}
        <div className="space-y-5">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Station Name</label>
                 <input name="stationName" type="text" placeholder="e.g. Wattala Super Station" className={`w-full py-3.5 px-6 bg-[#F8FAFC] border-2 rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none transition-all ${errors.stationName ? 'border-red-500/30 bg-red-500/5' : 'border-[#E2E8F0] focus:border-amber-500 focus:bg-amber-500/5'}`} value={formData.stationName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                 <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Charging Slots</label>
                 <input name="slots" type="number" placeholder="4" className={`w-full py-3.5 px-6 bg-[#F8FAFC] border-2 rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none transition-all ${errors.slots ? 'border-red-500/30 bg-red-500/5' : 'border-[#E2E8F0] focus:border-amber-500 focus:bg-amber-500/5'}`} value={formData.slots} onChange={handleChange} />
              </div>
           </div>

           <div className="space-y-2">
              <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Station Description</label>
              <textarea name="description" placeholder="Describe accessibility, security, and unique features of your hub..." rows="3" className="w-full py-3.5 px-6 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-3xl text-[#0F172A] text-[17px] font-bold outline-none focus:border-amber-500 transition-all resize-none font-inter" value={formData.description} onChange={handleChange} />
           </div>
        </div>

        {/* Energy Architecture */}
        <div className="space-y-3">
           <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Station Type</label>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-manrope">
              {[
                { id: 'DC Fast', icon: '⚡', l: 'DC Fast Charging', s: '25-150kW' },
                { id: 'AC Level 2', icon: '🔌', l: 'AC Fast (Level 2)', s: '7-22kW' },
                { id: 'AC Level 1', icon: '🔋', l: 'Standard AC', s: '2.3-3.6kW' }
              ].map(t => (
                <div key={t.id} onClick={() => { setFormData({...formData, chargeType: t.id}); setErrors({...errors, chargeType: ''}); }}
                  className={`py-6 px-4 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center shadow-sm
                    ${formData.chargeType === t.id ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10' : 'border-[#E2E8F0] bg-white/[0.02] hover:border-amber-500/30'}
                  `}>
                  <div className="text-3xl mb-3">{t.icon}</div>
                  <div className="text-[13px] font-extrabold uppercase tracking-widest text-[#0F172A] leading-tight mb-1.5">{t.l}</div>
                  <div className="text-[11px] font-bold text-slate-600 tracking-tight">{t.s}</div>
                </div>
              ))}
           </div>
           {errors.chargeType && <p className="ml-2 text-[12px] font-bold text-rose-500">Station type selection required</p>}
        </div>

        {/* Port Standards */}
        <div className="space-y-3">
           <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Connectors Available</label>
           <div className="flex flex-wrap gap-2.5 font-manrope">
              {[{ id: 'Type 2', icon: '⚡' }, { id: 'CCS2', icon: '🔌' }, { id: 'CHAdeMO', icon: '🔋' }, { id: 'Type 1', icon: '🔆' }, { id: 'GBT', icon: '🔷' }, { id: 'Other', icon: '🔌'}].map(c => (
                <div key={c.id} onClick={() => toggleArrayItem('connectors', c.id)} className={`px-6 py-3.5 rounded-2xl border-2 cursor-pointer transition-all text-[13px] font-extrabold uppercase tracking-widest flex items-center gap-3 shadow-sm ${formData.connectors.includes(c.id) ? 'border-amber-500 bg-amber-500/15 text-amber-500' : 'border-[#E2E8F0] bg-white/[0.02] text-slate-600 hover:border-[#3B82F6]/30'}`}>
                  <span className="text-sm">{c.icon}</span> {c.id}
                </div>
              ))}
           </div>
           {errors.connectors && <p className="ml-2 text-[12px] font-bold text-rose-500">Select at least one connector</p>}
        </div>

        {/* Geospatial Setup */}
        <div className="space-y-5">
           <div className="space-y-2">
              <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Station Address</label>
              <input name="stAddress" type="text" placeholder="No.45, Galle Road, Colombo 03" className={`w-full py-3.5 px-6 bg-[#F8FAFC] border-2 rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none transition-all ${errors.stAddress ? 'border-red-500/30 bg-red-500/5' : 'border-[#E2E8F0] focus:border-amber-500 focus:bg-amber-500/5'}`} value={formData.stAddress} onChange={handleChange} />
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">City</label>
                 <input name="stCity" type="text" placeholder="Colombo" className={`w-full py-3.5 px-6 bg-[#F8FAFC] border-2 rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none transition-all ${errors.stCity ? 'border-red-500/30 bg-red-500/5' : 'border-[#E2E8F0] focus:border-amber-500 focus:bg-amber-500/5'}`} value={formData.stCity} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                 <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">District</label>
                 <div className="relative group font-inter">
                    <select name="stDistrict" className={`w-full py-3.5 px-6 bg-[#F8FAFC] border-2 rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none appearance-none transition-all ${errors.stDistrict ? 'border-red-500/30 bg-red-500/5' : 'border-[#E2E8F0] focus:border-amber-500 focus:bg-amber-500/5'}`} value={formData.stDistrict} onChange={handleChange}>
                       <option value="" className="bg-[#FCFCFC]">Select District</option>
                       {districts.map(d => <option key={d} value={d} className="bg-[#FCFCFC]">{d}</option>)}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-amber-500 text-xs">▼</div>
                 </div>
              </div>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Latitude (Optional)</label>
                 <input name="lat" type="text" placeholder="6.9271" className="w-full py-3.5 px-6 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none focus:border-amber-500 transition-all font-inter" value={formData.lat} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                 <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Longitude (Optional)</label>
                 <input name="lng" type="text" placeholder="79.8612" className="w-full py-3.5 px-6 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none focus:border-amber-500 transition-all font-inter" value={formData.lng} onChange={handleChange} />
              </div>
           </div>
        </div>

        {/* Visual Verification */}
        <div className="space-y-3">
           <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Station Photo</label>
           <div className="relative h-64 rounded-3xl border-2 border-dashed border-[#E2E8F0] bg-white/[0.02] flex flex-col items-center justify-center overflow-hidden hover:border-amber-500/30 transition-all group font-manrope">
              {formData.stPhotoUrl ? (
                 <>
                    <img src={formData.stPhotoUrl} alt="Station" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <p className="text-[#0F172A] text-[11px] font-extrabold uppercase tracking-widest">Update Station Visual</p>
                    </div>
                 </>
              ) : (
                 <div className="text-center p-10">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📸</div>
                    <p className="text-[12px] font-bold text-slate-600 uppercase tracking-widest mb-1 group-hover:text-[#0F172A] transition-colors">Upload Station Photo</p>
                    <p className="text-[10px] text-slate-600/60 font-medium font-inter">JPG, PNG up to 10MB</p>
                 </div>
              )}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              {photoUploading && (
                 <div className="absolute inset-0 bg-[#FCFCFC]/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
                    <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(245,158,11,0.3)]"></div>
                    <p className="text-[#0F172A] text-[11px] font-extrabold uppercase tracking-widest animate-pulse">Uploading Visual...</p>
                 </div>
              )}
           </div>
        </div>

        {/* Amenities */}
        <div className="space-y-3">
           <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Station Amenities</label>
           <div className="flex flex-wrap gap-2.5 font-manrope">
              {[{ id: 'Washroom', icon: '🚻' }, { id: 'Cafe', icon: '☕' }, { id: 'Wifi', icon: '📶' }, { id: 'Shopping', icon: '🛍' }, { id: 'CCTV', icon: '📹' }].map(a => (
                <div key={a.id} onClick={() => toggleArrayItem('amenities', a.id)} className={`px-6 py-3 rounded-2xl border-2 cursor-pointer transition-all text-[13px] font-extrabold uppercase tracking-widest flex items-center gap-3 shadow-sm ${formData.amenities.includes(a.id) ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-[#E2E8F0] bg-white/[0.02] text-slate-600 hover:border-[#3B82F6]/30'}`}>
                  <span>{a.icon}</span> {a.id}
                </div>
              ))}
           </div>
        </div>

        {/* Actions */}
         <div className="flex flex-col sm:flex-row gap-5 pt-8 font-manrope">
            <button type="button" onClick={() => navigate('/provider/register/step2')} className="order-2 sm:order-1 px-10 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-white border border-[#E2E8F0] text-[#7a9bbf] hover:text-[#0F172A] hover:bg-[#F8FAFC] shadow-sm text-[14px]">← PREV</button>
            <button type="submit" className="order-1 sm:order-2 flex-1 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/30 group flex items-center justify-center gap-4 text-[16px]">
               Proceed to Pricing Model <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </button>
         </div>
      </form>
    </div>
  );
};

export default ProvStationForm;





