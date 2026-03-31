import React, { useState } from 'react';
import { storage } from '../../../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PersonalInfoForm = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: sessionStorage.getItem('reg_firstName') || '',
    lastName: sessionStorage.getItem('reg_lastName') || '',
    phone: sessionStorage.getItem('reg_phone') || '',
    dob: sessionStorage.getItem('reg_dob') || '',
    nic: sessionStorage.getItem('reg_nic') || '',
    address: sessionStorage.getItem('reg_address') || '',
    city: sessionStorage.getItem('reg_city') || '',
    district: sessionStorage.getItem('reg_district') || '',
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(sessionStorage.getItem('reg_photoURL') || null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: false }));
  };

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    const uid = sessionStorage.getItem('reg_uid');
    
    if (file && uid) {
      setUploading(true);
      try {
        const storageRef = ref(storage, `profile_photos/${uid}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setPhotoPreview(url);
        sessionStorage.setItem('reg_photoURL', url);
      } catch (error) {
        console.error("Photo upload error:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = true;
    if (!formData.lastName.trim()) newErrors.lastName = true;
    if (!formData.nic.trim()) newErrors.nic = true;
    if (!/^0\d{9}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      Object.entries(formData).forEach(([k, v]) => sessionStorage.setItem(`reg_${k}`, v));
      onNext();
    }
  };

  const districts = ["Colombo", "Gampaha", "Kandy", "Galle", "Matara", "Kurunegala", "Ratnapura", "Badulla", "Anuradhapura", "Polonnaruwa", "Trincomalee", "Batticaloa", "Jaffna", "Nuwara Eliya", "Kegalle", "Hambantota", "Kalutara", "Monaragala", "Puttalam", "Ampara", "Mannar", "Vavuniya", "Mullaitivu", "Kilinochchi"];

  return (
    <div className="w-full animate-fade-up font-inter">
      <div className="mb-10 p-8 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none"></div>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-3 text-blue-400 opacity-80">Phase 02 · Identity Registry</div>
        <h2 className="font-manrope text-3xl font-extrabold text-white mb-3 tracking-tight leading-none uppercase">PERSONAL INFO</h2>
        <p className="text-[15px] text-[#8AAFC8] font-medium leading-relaxed opacity-80">Tell us about yourself to personalize your experience across the grid.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-10">
        {/* Photo Upload */}
        <div className="space-y-3">
          <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Entity Portrait</label>
          <div 
            onClick={() => !uploading && document.getElementById('photo-inp').click()} 
            className={`relative h-44 rounded-3xl bg-white/[0.02] border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-blue-400/40 hover:bg-blue-400/5 group shadow-sm ${uploading ? 'opacity-50 cursor-wait' : ''}`}
          >
            {uploading ? (
              <div className="flex flex-col items-center animate-fade-in font-inter">
                <div className="w-10 h-10 border-4 border-blue-400/20 border-t-blue-400 rounded-full animate-spin mb-4"></div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-blue-400">Processing Station...</div>
              </div>
            ) : photoPreview ? (
              <div className="relative group/img h-full w-full p-4 overflow-hidden rounded-3xl shadow-inner">
                <img src={photoPreview} className="w-full h-full object-cover rounded-2xl shadow-xl transition-transform duration-500 group-hover/img:scale-105" alt="Preview" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                   <div className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-xl text-[11px] font-bold text-white uppercase tracking-widest border border-white/10">Replace Identity Data</div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center animate-fade-in font-inter">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">👤</div>
                <div className="text-[13px] font-bold text-white mb-1.5 uppercase tracking-wide">Upload Identity Portrait</div>
                <div className="text-[10px] text-[#4E7A96] font-bold uppercase opacity-60">PNG, JPG, WEBP (Max 5MB)</div>
              </div>
            )}
            <input id="photo-inp" type="file" accept="image/*" className="hidden" onChange={handlePhoto} disabled={uploading} />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
               <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">First Name</label>
               <input id="firstName" type="text" placeholder="e.g. John" className={`w-full py-4.5 px-6 bg-white/5 border-2 rounded-2xl text-white font-bold outline-none transition-all ${errors.firstName ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 focus:border-blue-400 focus:bg-blue-400/5'}`} value={formData.firstName} onChange={handleInputChange} />
            </div>
            <div className="space-y-3">
               <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Last Name</label>
               <input id="lastName" type="text" placeholder="e.g. Doe" className={`w-full py-4.5 px-6 bg-white/5 border-2 rounded-2xl text-white font-bold outline-none transition-all ${errors.lastName ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 focus:border-blue-400 focus:bg-blue-400/5'}`} value={formData.lastName} onChange={handleInputChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
               <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Phone Contact</label>
               <input id="phone" type="tel" placeholder="07X XXX XXXX" className={`w-full py-4.5 px-6 bg-white/5 border-2 rounded-2xl text-white font-bold outline-none transition-all ${errors.phone ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 focus:border-blue-400 focus:bg-blue-400/5'}`} value={formData.phone} onChange={handleInputChange} />
            </div>
            <div className="space-y-3">
               <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Date of Birth</label>
               <input id="dob" type="date" className="w-full py-4.5 px-6 bg-white/5 border-2 border-white/5 rounded-2xl text-white font-bold outline-none focus:border-blue-400 [color-scheme:dark] transition-all" value={formData.dob} onChange={handleInputChange} />
            </div>
          </div>

          <div className="space-y-3">
             <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">NIC / Security Identifier</label>
             <input id="nic" type="text" placeholder="e.g. 200012345678" className={`w-full py-4.5 px-6 bg-white/5 border-2 rounded-2xl text-white font-bold outline-none transition-all ${errors.nic ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 focus:border-blue-400 focus:bg-blue-400/5'}`} value={formData.nic} onChange={handleInputChange} />
          </div>

          <div className="space-y-3">
             <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Resident District</label>
             <div className="relative group">
                <select id="district" className="w-full py-4.5 px-6 bg-white/5 border-2 border-white/5 rounded-2xl text-white font-bold outline-none appearance-none focus:border-blue-400 transition-all font-inter" value={formData.district} onChange={handleInputChange}>
                   <option value="" className="bg-[#050F1C]">Choose your district</option>
                   {districts.map(d => <option key={d} value={d} className="bg-[#050F1C]">{d}</option>)}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-blue-400 text-xs">▼</div>
             </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 pt-8 font-manrope">
          <button 
            type="button" 
            onClick={onBack} 
            className="order-2 sm:order-1 px-10 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-white/[0.03] border border-white/10 text-[#7a9bbf] hover:text-white hover:bg-white/5 shadow-sm text-[12px]"
          >
            ← PREVIOUS
          </button>
          <button 
            type="submit" 
            className="order-1 sm:order-2 flex-1 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/20 group text-[13px]"
          >
            CONFIRM & PROCEED <span className="group-hover:translate-x-2 transition-transform ml-2 duration-300">→</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
