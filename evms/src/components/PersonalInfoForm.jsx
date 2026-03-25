import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
        alert("Failed to upload photo. Please try again.");
      } finally {
        setUploading(false);
      }
    } else if (!uid) {
      alert("Session expired. Please start from Step 1.");
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

  const inputBase = "w-full py-3 px-4 pl-12 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#38BDF8]/50 focus:bg-[#38BDF8]/5 placeholder:text-gray-500";
  const labelBase = "block text-[11px] font-semibold uppercase tracking-wider mb-2 text-gray-500";
  const sectionBase = "flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest pb-3 mb-5 border-b border-white/5 text-gray-500 font-dm";

  return (
    <div className="w-full animate-[fadeInUp_0.4s_ease_both]">
      <div className="mb-8">
        <div className="text-[11px] font-semibold uppercase tracking-widest mb-2 text-gray-500">Step 2 of 4</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-2">Personal Information</h2>
        <p className="text-sm text-gray-400">Tell us about yourself to personalize your experience.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Photo */}
        <div>
          <div className={sectionBase}><span className="text-[#38BDF8]">📸</span> Profile Photo</div>
          <div 
            onClick={() => !uploading && document.getElementById('photo-inp').click()} 
            className={`border-2 border-dashed border-white/10 rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-[#00D4AA]/40 hover:bg-[#00D4AA]/5 ${uploading ? 'opacity-50 cursor-wait' : ''}`}
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-[#00D4AA]/20 border-t-[#00D4AA] rounded-full animate-spin mb-2"></div>
                <div className="text-sm text-gray-400 font-semibold">Uploading...</div>
              </div>
            ) : !photoPreview ? (
              <>
                <div className="text-4xl mb-2">📸</div>
                <div className="text-sm font-semibold text-white mb-1">Upload Profile Photo</div>
                <div className="text-[11px] text-gray-500">PNG, JPG, WEBP · Max 5MB</div>
              </>
            ) : (
              <>
                <img src={photoPreview} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-[#00D4AA] shadow-[0_0_16px_rgba(0,212,170,0.3)]" alt="Preview" />
                <div className="text-sm font-semibold text-white">Photo uploaded ✓</div>
                <div className="text-[11px] mt-1 text-[#00D4AA]">Click to change</div>
              </>
            )}
            <input id="photo-inp" type="file" accept="image/*" className="hidden" onChange={handlePhoto} disabled={uploading} />
          </div>
        </div>

        {/* Details */}
        <div>
          <div className={sectionBase}><span className="text-[#38BDF8]">👤</span> Basic Details</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelBase}>First Name *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">👤</span>
                <input id="firstName" type="text" placeholder="First name" className={`${inputBase} ${errors.firstName ? 'border-rose-500/50 bg-rose-500/5' : ''}`} value={formData.firstName} onChange={handleInputChange} />
              </div>
            </div>
            <div>
              <label className={labelBase}>Last Name *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">👤</span>
                <input id="lastName" type="text" placeholder="Last name" className={`${inputBase} ${errors.lastName ? 'border-rose-500/50 bg-rose-500/5' : ''}`} value={formData.lastName} onChange={handleInputChange} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelBase}>Phone Number *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">📱</span>
                <input id="phone" type="tel" placeholder="07X XXX XXXX" className={`${inputBase} ${errors.phone ? 'border-rose-500/50 bg-rose-500/5' : ''}`} value={formData.phone} onChange={handleInputChange} />
              </div>
            </div>
            <div>
              <label className={labelBase}>Date of Birth</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none z-10">🎂</span>
                <input id="dob" type="date" className={`${inputBase} [color-scheme:dark]`} value={formData.dob} onChange={handleInputChange} />
              </div>
            </div>
          </div>
          <div>
            <label className={labelBase}>NIC Number *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">🪪</span>
              <input id="nic" type="text" placeholder="e.g. 200012345678" className={`${inputBase} ${errors.nic ? 'border-rose-500/50 bg-rose-500/5' : ''}`} value={formData.nic} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <div className={sectionBase}><span className="text-[#38BDF8]">📍</span> Address Details</div>
          <div className="mb-4">
            <label className={labelBase}>Street Address (Optional)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">🏠</span>
              <input id="address" type="text" placeholder="No. 12, Main Street" className={inputBase} value={formData.address} onChange={handleInputChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelBase}>City</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">🌆</span>
                <input id="city" type="text" placeholder="e.g. Colombo" className={inputBase} value={formData.city} onChange={handleInputChange} />
              </div>
            </div>
            <div>
              <label className={labelBase}>District</label>
              <div className="relative font-dm">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none z-10">📌</span>
                <select id="district" className={`${inputBase} appearance-none pr-10`} value={formData.district} onChange={handleInputChange}>
                  <option value="" className="bg-[#050F1C]">Select district</option>
                  {districts.map(d => <option key={d} value={d} className="bg-[#050F1C]">{d}</option>)}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs pointer-events-none text-gray-500">▾</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2 font-syne">
          <button type="button" onClick={onBack} className="order-2 sm:order-1 px-8 py-4 rounded-xl font-bold text-sm transition-all bg-white/5 border border-white/10 text-gray-400 hover:border-[#00D4AA]/30 hover:text-white">← Back</button>
          <button type="submit" className="order-1 sm:order-2 flex-1 py-4 rounded-xl font-bold text-sm transition-all shadow-[0_6px_24px_rgba(0,212,170,0.3)] bg-gradient-to-br from-[#00D4AA] to-[#00A882] text-[#050F1C] hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(0,212,170,0.4)]">Continue to EV Details →</button>
        </div>
      </form>
    </div>
  );
};


export default PersonalInfoForm;
