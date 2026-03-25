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
    if (formData.connectors.length === 0) e_s.connectors = 'Select one';
    setErrors(e_s);

    if (Object.keys(e_s).length === 0) {
      Object.entries(formData).forEach(([k, v]) => sessionStorage.setItem('prov_' + k, typeof v === 'object' ? JSON.stringify(v) : v));
      navigate('/provider/register/step4');
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="w-full animate-fade-up">
      <div className="mb-8 p-6 rounded-[32px] glass-panel border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none"></div>
        <div className="text-[10px] font-black uppercase tracking-[4px] mb-3 text-amber-500 opacity-80">Phase 03 · Hardware Nodes</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-2 leading-none uppercase tracking-tight">Station Core</h2>
        <p className="text-sm text-[#8AAFC8] font-medium leading-relaxed">Establish your primary charging hub on the national grid.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 pb-10">
        
        {/* Basic Identity */}
        <div className="space-y-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Public Alias</label>
                 <input name="stationName" type="text" placeholder="e.g. Wattala Super Hub" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all ${errors.stationName ? 'border-rose-500/30' : 'border-white/10 focus:border-amber-500'}`} value={formData.stationName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Charging Hubs (Slots)</label>
                 <input name="slots" type="number" placeholder="4" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all ${errors.slots ? 'border-rose-500/30' : 'border-white/10 focus:border-amber-500'}`} value={formData.slots} onChange={handleChange} />
              </div>
           </div>

           <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Station Intel (Bio)</label>
              <textarea name="description" placeholder="Describe the accessibility and features of your station..." rows="3" className="w-full py-5 px-6 bg-white/5 border-2 border-white/10 rounded-[28px] text-white font-bold outline-none focus:border-amber-500 transition-all resize-none" value={formData.description} onChange={handleChange} />
           </div>
        </div>

        {/* Energy Architecture */}
        <div className="space-y-4">
           <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Energy Standard</label>
           <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
              {[
                { id: 'DC Fast', icon: '⚡', l: 'Hyper Charge', s: '50-350kW' },
                { id: 'AC Level 2', icon: '🔌', l: 'Standard Pod', s: '7-22kW' },
                { id: 'AC Level 1', icon: '🔋', l: 'Eco Dock', s: '2.3-7kW' }
              ].map(t => (
                <div key={t.id} onClick={() => { setFormData({...formData, chargeType: t.id}); setErrors({...errors, chargeType: ''}); }}
                  className={`py-5 px-4 rounded-[28px] border-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center
                    ${formData.chargeType === t.id ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 bg-white/5 hover:border-amber-500/30'}
                  `}>
                  <div className="text-2xl mb-2">{t.icon}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white leading-tight mb-1">{t.l}</div>
                  <div className="text-[9px] font-bold text-[#4E7A96]">{t.s}</div>
                </div>
              ))}
           </div>
        </div>

        {/* Port Standards */}
        <div className="space-y-4">
           <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Hardware Connectors</label>
           <div className="flex flex-wrap gap-2">
              {[{ id: 'Type 2', icon: '⚡' }, { id: 'CCS2', icon: '🔌' }, { id: 'CHAdeMO', icon: '🔋' }, { id: 'Type 1', icon: '🔆' }, { id: 'GBT', icon: '🔷' }].map(c => (
                <div key={c.id} onClick={() => toggleArrayItem('connectors', c.id)} className={`px-5 py-3 rounded-full border-2 cursor-pointer transition-all text-[11px] font-black uppercase tracking-widest flex items-center gap-2 ${formData.connectors.includes(c.id) ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-white/10 bg-white/5 text-[#4E7A96] hover:border-white/30'}`}>
                  <span>{c.icon}</span> {c.id}
                </div>
              ))}
           </div>
           {errors.connectors && <p className="ml-4 text-[11px] font-bold text-rose-400">Specify at least one port</p>}
        </div>

        {/* Geospatial Deployment */}
        <div className="space-y-6">
           <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Precise Address</label>
              <input name="stAddress" type="text" placeholder="No.45, Galle Road, Colombo 03" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all ${errors.stAddress ? 'border-rose-500/30' : 'border-white/10 focus:border-amber-500'}`} value={formData.stAddress} onChange={handleChange} />
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">City</label>
                 <input name="stCity" type="text" placeholder="Colombo" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all ${errors.stCity ? 'border-rose-500/30' : 'border-white/10 focus:border-amber-500'}`} value={formData.stCity} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">District</label>
                 <div className="relative group">
                    <select name="stDistrict" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none appearance-none transition-all font-dm ${errors.stDistrict ? 'border-rose-500/30' : 'border-white/10 focus:border-amber-500'}`} value={formData.stDistrict} onChange={handleChange}>
                       <option value="" className="bg-[#050F1C]">Select Zone</option>
                       {districts.map(d => <option key={d} value={d} className="bg-[#050F1C]">{d}</option>)}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-amber-500">▼</div>
                 </div>
              </div>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">GPS LAT (Optional)</label>
                  <input name="lat" type="number" step="any" placeholder="6.9271" className="w-full py-5 px-6 bg-white/5 border-2 border-white/10 rounded-[24px] text-white font-bold outline-none focus:border-amber-500 transition-all font-dm" value={formData.lat} onChange={handleChange} />
               </div>
               <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">GPS LNG (Optional)</label>
                  <input name="lng" type="number" step="any" placeholder="79.8612" className="w-full py-5 px-6 bg-white/5 border-2 border-white/10 rounded-[24px] text-white font-bold outline-none focus:border-amber-500 transition-all font-dm" value={formData.lng} onChange={handleChange} />
               </div>
           </div>
        </div>

        {/* Amenities Selection */}
        <div className="space-y-4">
           <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Station Amenities</label>
           <div className="flex flex-wrap gap-2">
              {[{ id: 'WiFi', icon: '📶' }, { id: 'Parking', icon: '🅿' }, { id: 'Restrooms', icon: '🚻' }, { id: 'CCTV', icon: '📷' }, { id: 'Café', icon: '☕' }, { id: '24/7', icon: '🕐' }, { id: 'Covered', icon: '🏗' }, { id: 'Disabled Access', icon: '♿' }].map(a => (
                <div key={a.id} onClick={() => toggleArrayItem('amenities', a.id)} className={`px-5 py-3 rounded-full border-2 cursor-pointer transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${formData.amenities.includes(a.id) ? 'border-blue-400 bg-blue-400/10 text-blue-400' : 'border-white/10 bg-white/5 text-[#4E7A96] hover:border-white/30'}`}>
                   {a.icon} {a.id}
                </div>
              ))}
           </div>
        </div>

        {/* Visual Documentation */}
        <div className="space-y-4">
           <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Visual Verification</label>
           <div 
             onClick={() => !photoUploading && document.getElementById('stphoto-inp').click()} 
             className={`h-48 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#FBBF24]/5 group ${photoUploading ? 'opacity-50 cursor-wait' : ''} ${formData.stPhotoUrl ? 'border-[#FBBF24]/40' : 'border-white/10 hover:border-[#FBBF24]/40'}`}
           >
              {photoUploading ? (
                 <div className="flex flex-col items-center animate-fade-in">
                    <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-3"></div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-amber-500">Uploading Hub Photo...</div>
                 </div>
              ) : formData.stPhotoUrl ? (
                 <div className="relative w-full h-full p-4 overflow-hidden rounded-[30px]">
                    <img src={formData.stPhotoUrl} className="w-full h-full object-cover rounded-[20px] transition-transform duration-700 group-hover:scale-105" alt="Hub"/>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                       <span className="px-6 py-2 glass-pill text-[10px] font-black text-white uppercase tracking-widest">Swap Visual</span>
                    </div>
                 </div>
              ) : (
                 <div className="flex flex-col items-center text-center animate-fade-in">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📸</div>
                    <div className="text-xs font-black text-white mb-1 uppercase tracking-[2px]">Capture Station Exterior</div>
                    <div className="text-[10px] text-[#4E7A96] font-bold">Recommended for verification status</div>
                 </div>
              )}
              <input id="stphoto-inp" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload}/>
           </div>
        </div>

        {/* Submission */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
           <button type="button" onClick={() => navigate('/provider/register/step2')} className="order-2 sm:order-1 px-10 py-5 rounded-[24px] font-black uppercase tracking-[2px] transition-all bg-white/5 border-2 border-white/10 text-white hover:bg-white/10">← Prev</button>
           <button type="submit" className="order-1 sm:order-2 flex-1 py-5 rounded-[24px] font-black uppercase tracking-[3px] transition-all bg-gradient-to-br from-amber-500 to-orange-600 text-[#050F1C] hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-amber-500/20 group flex items-center justify-center gap-3">
              Configure Economics <span className="group-hover:translate-x-2 transition-transform">→</span>
           </button>
        </div>
      </form>
    </div>
  );
};

export default ProvStationForm;
