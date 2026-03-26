import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../config/firebase';
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
      <div className="mb-10 p-8 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none"></div>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-3 text-amber-500 opacity-80">Phase 03 · Infrastructure Hub</div>
        <h2 className="font-manrope text-3xl font-extrabold text-white mb-3 tracking-tight leading-none uppercase">Station Setup</h2>
        <p className="text-[15px] text-[#8AAFC8] font-medium leading-relaxed opacity-80">Define your physical charging location and hardware specifications.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 pb-10">
        
        {/* Basic Identity */}
        <div className="space-y-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                 <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Station Name</label>
                 <input name="stationName" type="text" placeholder="e.g. Wattala Super Hub" className={`w-full py-4.5 px-6 bg-white/5 border-2 rounded-2xl text-white font-bold outline-none transition-all ${errors.stationName ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 focus:border-amber-500 focus:bg-amber-500/5'}`} value={formData.stationName} onChange={handleChange} />
              </div>
              <div className="space-y-3">
                 <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Charging Slots</label>
                 <input name="slots" type="number" placeholder="4" className={`w-full py-4.5 px-6 bg-white/5 border-2 rounded-2xl text-white font-bold outline-none transition-all ${errors.slots ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 focus:border-amber-500 focus:bg-amber-500/5'}`} value={formData.slots} onChange={handleChange} />
              </div>
           </div>

           <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Station Description</label>
              <textarea name="description" placeholder="Describe accessibility, security, and unique features of your hub..." rows="3" className="w-full py-4.5 px-6 bg-white/5 border-2 border-white/5 rounded-3xl text-white font-bold outline-none focus:border-amber-500 transition-all resize-none font-inter" value={formData.description} onChange={handleChange} />
           </div>
        </div>

        {/* Energy Architecture */}
        <div className="space-y-4">
           <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Station Type</label>
           <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 font-manrope">
              {[
                { id: 'DC Fast', icon: '⚡', l: 'Public DC Fast', s: '50-350kW' },
                { id: 'AC Level 2', icon: '🔌', l: 'AC Level 2', s: '7-22kW' },
                { id: 'AC Level 1', icon: '🔋', l: 'AC Level 1', s: '2.3-7kW' }
              ].map(t => (
                <div key={t.id} onClick={() => { setFormData({...formData, chargeType: t.id}); setErrors({...errors, chargeType: ''}); }}
                  className={`py-6 px-4 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center shadow-sm
                    ${formData.chargeType === t.id ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10' : 'border-white/5 bg-white/[0.02] hover:border-amber-500/30'}
                  `}>
                  <div className="text-3xl mb-3">{t.icon}</div>
                  <div className="text-[11px] font-extrabold uppercase tracking-widest text-white leading-tight mb-1.5">{t.l}</div>
                  <div className="text-[10px] font-bold text-[#4E7A96] tracking-tight">{t.s}</div>
                </div>
              ))}
           </div>
           {errors.chargeType && <p className="ml-2 text-[11px] font-bold text-red-400">Station type selection required</p>}
        </div>

        {/* Port Standards */}
        <div className="space-y-4">
           <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Connectors Available</label>
           <div className="flex flex-wrap gap-2.5 font-manrope">
              {[{ id: 'Type 2', icon: '⚡' }, { id: 'CCS2', icon: '🔌' }, { id: 'CHAdeMO', icon: '🔋' }, { id: 'Type 1', icon: '🔆' }, { id: 'GBT', icon: '🔷' }].map(c => (
                <div key={c.id} onClick={() => toggleArrayItem('connectors', c.id)} className={`px-6 py-3.5 rounded-2xl border-2 cursor-pointer transition-all text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-3 shadow-sm ${formData.connectors.includes(c.id) ? 'border-amber-500 bg-amber-500/15 text-amber-500' : 'border-white/5 bg-white/[0.02] text-[#4E7A96] hover:border-white/20'}`}>
                  <span className="text-sm">{c.icon}</span> {c.id}
                </div>
              ))}
           </div>
           {errors.connectors && <p className="ml-2 text-[11px] font-bold text-red-400">Select at least one connector</p>}
        </div>

        {/* Geospatial Deployment */}
        <div className="space-y-6">
           <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Station Address</label>
              <input name="stAddress" type="text" placeholder="No.45, Galle Road, Colombo 03" className={`w-full py-4.5 px-6 bg-white/5 border-2 rounded-2xl text-white font-bold outline-none transition-all ${errors.stAddress ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 focus:border-amber-500 focus:bg-amber-500/5'}`} value={formData.stAddress} onChange={handleChange} />
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                 <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">City</label>
                 <input name="stCity" type="text" placeholder="Colombo" className={`w-full py-4.5 px-6 bg-white/5 border-2 rounded-2xl text-white font-bold outline-none transition-all ${errors.stCity ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 focus:border-amber-500 focus:bg-amber-500/5'}`} value={formData.stCity} onChange={handleChange} />
              </div>
              <div className="space-y-3">
                 <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">District</label>
                 <div className="relative group font-inter">
                    <select name="stDistrict" className={`w-full py-4.5 px-6 bg-white/5 border-2 rounded-2xl text-white font-bold outline-none appearance-none transition-all ${errors.stDistrict ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 focus:border-amber-500 focus:bg-amber-500/5'}`} value={formData.stDistrict} onChange={handleChange}>
                       <option value="" className="bg-[#050F1C]">Select District</option>
                       {districts.map(d => <option key={d} value={d} className="bg-[#050F1C]">{d}</option>)}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-amber-500 text-xs">▼</div>
                 </div>
              </div>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                 <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Latitude (Optional)</label>
                 <input name="lat" type="text" placeholder="6.9271" className="w-full py-4.5 px-6 bg-white/5 border-2 border-white/5 rounded-2xl text-white font-bold outline-none focus:border-amber-500 transition-all font-inter" value={formData.lat} onChange={handleChange} />
              </div>
              <div className="space-y-3">
                 <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Longitude (Optional)</label>
                 <input name="lng" type="text" placeholder="79.8612" className="w-full py-4.5 px-6 bg-white/5 border-2 border-white/5 rounded-2xl text-white font-bold outline-none focus:border-amber-500 transition-all font-inter" value={formData.lng} onChange={handleChange} />
              </div>
           </div>
        </div>

        {/* Visual Verification */}
        <div className="space-y-4">
           <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Station Photo</label>
           <div className="relative h-64 rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center overflow-hidden hover:border-amber-500/30 transition-all group font-manrope">
              {formData.stPhotoUrl ? (
                 <>
                    <img src={formData.stPhotoUrl} alt="Station" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <p className="text-white text-[11px] font-extrabold uppercase tracking-widest">Update Station Visual</p>
                    </div>
                 </>
              ) : (
                 <div className="text-center p-10">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📸</div>
                    <p className="text-[12px] font-bold text-[#4E7A96] uppercase tracking-widest mb-1 group-hover:text-white transition-colors">Upload Station Photo</p>
                    <p className="text-[10px] text-[#4E7A96]/60 font-medium font-inter">JPG, PNG up to 10MB</p>
                 </div>
              )}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              {photoUploading && (
                 <div className="absolute inset-0 bg-[#050F1C]/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
                    <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(245,158,11,0.3)]"></div>
                    <p className="text-white text-[11px] font-extrabold uppercase tracking-widest animate-pulse">Uploading Visual...</p>
                 </div>
              )}
           </div>
        </div>

        {/* Amenities */}
        <div className="space-y-4">
           <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Station Amenities</label>
           <div className="flex flex-wrap gap-2.5 font-manrope">
              {[{ id: 'Washroom', icon: '🚻' }, { id: 'Cafe', icon: '☕' }, { id: 'Wifi', icon: '📶' }, { id: 'Shopping', icon: '🛍' }, { id: 'CCTV', icon: '📹' }].map(a => (
                <div key={a.id} onClick={() => toggleArrayItem('amenities', a.id)} className={`px-6 py-3 rounded-2xl border-2 cursor-pointer transition-all text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-3 shadow-sm ${formData.amenities.includes(a.id) ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/5 bg-white/[0.02] text-[#4E7A96] hover:border-white/20'}`}>
                  <span>{a.icon}</span> {a.id}
                </div>
              ))}
           </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-5 pt-8 font-manrope">
           <button type="button" onClick={() => navigate('/provider/register/step2')} className="order-2 sm:order-1 px-10 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-white/[0.03] border border-white/10 text-[#7a9bbf] hover:text-white hover:bg-white/5 shadow-sm text-[12px]">← PREV</button>
           <button type="submit" className="order-1 sm:order-2 flex-1 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-gradient-to-r from-amber-500 to-orange-500 text-[#050F1C] hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amber-500/20 group flex items-center justify-center gap-4 text-[13px]">
              Proceed to Pricing Model <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
           </button>
        </div>
      </form>
    </div>
  );
};

export default ProvStationForm;
