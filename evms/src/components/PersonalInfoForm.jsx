import React, { useState } from 'react';
import { storage } from '../config/firebase';
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
    <div className="w-full animate-fade-up">
      <div className="mb-8 p-6 rounded-[32px] glass-panel border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none"></div>
        <div className="text-[10px] font-black uppercase tracking-[4px] mb-3 text-blue-400 opacity-80">Phase 02 · Identity</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-2 leading-none uppercase tracking-tight">Personal Info</h2>
        <p className="text-sm text-[#8AAFC8] font-medium leading-relaxed">Tell us about yourself to personalize your experience.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-10">
        {/* Photo Upload Component */}
        <div className="space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Biometric Identity</label>
          <div 
            onClick={() => !uploading && document.getElementById('photo-inp').click()} 
            className={`relative h-40 rounded-[32px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-[#00D4AA]/40 hover:bg-[#00D4AA]/5 group ${uploading ? 'opacity-50 cursor-wait' : ''}`}
          >
            {uploading ? (
              <div className="flex flex-col items-center animate-fade-in">
                <div className="w-12 h-12 border-4 border-[#00D4AA]/20 border-t-[#00D4AA] rounded-full animate-spin mb-3"></div>
                <div className="text-[11px] font-black uppercase tracking-widest text-[#00D4AA]">Processing...</div>
              </div>
            ) : photoPreview ? (
              <div className="relative group/img h-full w-full p-4 overflow-hidden rounded-[30px]">
                <img src={photoPreview} className="w-full h-full object-cover rounded-[20px] shadow-2xl transition-transform duration-500 group-hover/img:scale-105" alt="Preview" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                   <div className="px-5 py-2 glass-pill text-[10px] font-black text-white uppercase tracking-widest">Replace Photo</div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center animate-fade-in">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👤</div>
                <div className="text-xs font-bold text-white mb-1 uppercase tracking-widest">Upload Portrait</div>
                <div className="text-[10px] text-[#4E7A96] font-medium">PNG, JPG, WEBP (Max 5MB)</div>
              </div>
            )}
            <input id="photo-inp" type="file" accept="image/*" className="hidden" onChange={handlePhoto} disabled={uploading} />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">First Name</label>
               <input id="firstName" type="text" placeholder="John" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all ${errors.firstName ? 'border-rose-500/30' : 'border-white/10 focus:border-blue-400 focus:bg-blue-400/5'}`} value={formData.firstName} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
               <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Last Name</label>
               <input id="lastName" type="text" placeholder="Doe" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all ${errors.lastName ? 'border-rose-500/30' : 'border-white/10 focus:border-blue-400 focus:bg-blue-400/5'}`} value={formData.lastName} onChange={handleInputChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Phone Contact</label>
               <input id="phone" type="tel" placeholder="07X XXX XXXX" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all ${errors.phone ? 'border-rose-500/30' : 'border-white/10 focus:border-blue-400 focus:bg-blue-400/5'}`} value={formData.phone} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
               <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Date of Birth</label>
               <input id="dob" type="date" className="w-full py-5 px-6 bg-white/5 border-2 border-white/10 rounded-[24px] text-white font-bold outline-none focus:border-blue-400 [color-scheme:dark]" value={formData.dob} onChange={handleInputChange} />
            </div>
          </div>

          <div className="space-y-2">
             <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">NIC / National ID</label>
             <input id="nic" type="text" placeholder="e.g. 200012345678" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all ${errors.nic ? 'border-rose-500/30' : 'border-white/10 focus:border-blue-400 focus:bg-blue-400/5'}`} value={formData.nic} onChange={handleInputChange} />
          </div>

          <div className="space-y-2">
             <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Resident District</label>
             <div className="relative group">
                <select id="district" className="w-full py-5 px-6 bg-white/5 border-2 border-white/10 rounded-[24px] text-white font-bold outline-none appearance-none focus:border-blue-400 transition-all" value={formData.district} onChange={handleInputChange}>
                   <option value="" className="bg-[#050F1C]">Choose your district</option>
                   {districts.map(d => <option key={d} value={d} className="bg-[#050F1C] font-dm">{d}</option>)}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-blue-400">▼</div>
             </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button 
            type="button" 
            onClick={onBack} 
            className="order-2 sm:order-1 px-10 py-5 rounded-[24px] font-black uppercase tracking-[2px] transition-all bg-white/5 border-2 border-white/10 text-white hover:bg-white/10 shadow-lg"
          >
            ← Previous
          </button>
          <button 
            type="submit" 
            className="order-1 sm:order-2 flex-1 py-5 rounded-[24px] font-black uppercase tracking-[3px] transition-all bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-blue-500/20 group"
          >
            Confirm & Proceed <span className="group-hover:translate-x-2 transition-transform ml-1">→</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
