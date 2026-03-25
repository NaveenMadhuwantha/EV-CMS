import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EVDetailsForm = ({ onNext, onBack }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicleType: sessionStorage.getItem('reg_vehicleType') || '',
    vehicleMake: sessionStorage.getItem('reg_vehicleMake') || '',
    vehicleModel: sessionStorage.getItem('reg_vehicleModel') || '',
    vehicleYear: sessionStorage.getItem('reg_vehicleYear') || '',
    batteryCapacity: sessionStorage.getItem('reg_batteryCapacity') || '',
    plateNo: sessionStorage.getItem('reg_plateNo') || '',
    connectorType: sessionStorage.getItem('reg_connectorType') || '',
  });

  const [errors, setErrors] = useState({});

  const vehicleTypes = [
    { id: 'Sedan', icon: '🚗' }, { id: 'SUV', icon: '🚙' }, { id: 'Van', icon: '🚐' },
    { id: 'Motorcycle', icon: '🏍' }, { id: 'Pickup', icon: '🛻' }, { id: 'Bus', icon: '🚌' }
  ];

  const connectorTypes = [
    { id: 'Type 2', icon: '⚡' }, { id: 'CCS2', icon: '🔌' },
    { id: 'CHAdeMO', icon: '🔋' }, { id: 'Type 1', icon: '🔆' }
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: false }));
  };

  const selectType = (id) => {
    setFormData(prev => ({ ...prev, vehicleType: id }));
    if (errors.vehicleType) setErrors(prev => ({ ...prev, vehicleType: false }));
  };

  const selectConnector = (id) => {
    setFormData(prev => ({ ...prev, connectorType: id }));
    if (errors.connectorType) setErrors(prev => ({ ...prev, connectorType: false }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.vehicleType) newErrors.vehicleType = true;
    if (!formData.vehicleMake) newErrors.vehicleMake = true;
    if (!formData.plateNo.trim()) newErrors.plateNo = true;
    if (!formData.connectorType) newErrors.connectorType = true;
    if (formData.batteryCapacity && parseFloat(formData.batteryCapacity) <= 0) newErrors.batteryCapacity = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      Object.entries(formData).forEach(([k, v]) => sessionStorage.setItem(`reg_${k}`, v));
      navigate('/register/step4');
    }
  };

  const brands = ["Tesla", "BYD", "Nissan", "Hyundai", "Kia", "Toyota", "BMW", "Audi", "Volkswagen", "MG", "Tata", "Chery", "Other"];
  const years = Array.from({ length: 11 }, (_, i) => 2025 - i);

  const inputBase = "w-full py-3 px-4 pl-12 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-amber-500/50 focus:bg-amber-500/5 placeholder:text-gray-500";
  const labelBase = "block text-[11px] font-semibold uppercase tracking-wider mb-2 text-gray-500";
  const sectionBase = "flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest pb-3 mb-5 border-b border-white/5 text-gray-500 font-dm";

  return (
    <div className="w-full animate-[fadeInUp_0.4s_ease_both]">
      <div className="mb-8">
        <div className="text-[11px] font-semibold uppercase tracking-widest mb-2 text-gray-500">Step 3 of 4</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-2">Your EV Details</h2>
        <p className="text-sm text-gray-400">Register your electric vehicle for the correct charging setup.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Type */}
        <div>
          <div className={sectionBase}><span className="text-amber-500">🚗</span> Vehicle Type *</div>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
            {vehicleTypes.map(t => (
              <div key={t.id} onClick={() => selectType(t.id)} className={`border rounded-2xl p-4 text-center cursor-pointer transition-all bg-white/5 hover:border-[#00D4AA]/40 hover:bg-[#00D4AA]/5 ${formData.vehicleType === t.id ? 'border-[#00D4AA] bg-[#00D4AA]/10 shadow-[0_0_20px_rgba(0,212,170,0.15)]' : 'border-white/10'}`}>
                <div className="text-3xl mb-1">{t.icon}</div>
                <div className="text-[10px] font-bold uppercase text-white/70">{t.id}</div>
              </div>
            ))}
          </div>
          {errors.vehicleType && <p className="text-[11px] mt-2 text-rose-500">⚠ Please select a vehicle type</p>}
        </div>

        {/* Details */}
        <div>
          <div className={sectionBase}><span className="text-amber-500">⚙</span> Vehicle Details</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 font-dm">
            <div>
              <label className={labelBase}>Make / Brand *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none z-10">🏭</span>
                <select id="vehicleMake" className={`${inputBase} appearance-none pr-10 ${errors.vehicleMake ? 'border-rose-500/50 bg-rose-500/5' : ''}`} value={formData.vehicleMake} onChange={handleInputChange}>
                  <option value="" className="bg-[#050F1C]">Select brand</option>
                  {brands.map(b => <option key={b} value={b} className="bg-[#050F1C]">{b}</option>)}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs pointer-events-none text-gray-500">▾</span>
              </div>
            </div>
            <div>
              <label className={labelBase}>Model</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">🚘</span>
                <input id="vehicleModel" type="text" placeholder="e.g. Model 3" className={inputBase} value={formData.vehicleModel} onChange={handleInputChange} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="font-dm">
              <label className={labelBase}>Year</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none z-10">📅</span>
                <select id="vehicleYear" className={`${inputBase} appearance-none pr-10`} value={formData.vehicleYear} onChange={handleInputChange}>
                  <option value="" className="bg-[#050F1C]">Select year</option>
                  {years.map(y => <option key={y} value={y} className="bg-[#050F1C]">{y}</option>)}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs pointer-events-none text-gray-500">▾</span>
              </div>
            </div>
            <div>
              <label className={labelBase}>Battery Capacity (kWh)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">🔋</span>
                <input id="batteryCapacity" type="number" step="0.1" min="0" placeholder="e.g. 60" className={`${inputBase} ${errors.batteryCapacity ? 'border-rose-500/50 bg-rose-500/5' : ''}`} value={formData.batteryCapacity} onChange={handleInputChange} />
              </div>
            </div>
          </div>
          <div>
            <label className={labelBase}>Number Plate *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">🔢</span>
              <input id="plateNo" type="text" placeholder="e.g. CAB 1234" className={`${inputBase} uppercase ${errors.plateNo ? 'border-rose-500/50 bg-rose-500/5' : ''}`} value={formData.plateNo} onChange={handleInputChange} />
            </div>
            {errors.plateNo && <p className="text-[11px] mt-1.5 text-rose-500">⚠ Number plate required</p>}
          </div>
        </div>

        {/* Connector */}
        <div>
          <div className={sectionBase}><span className="text-amber-500">🔌</span> Connector Type *</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {connectorTypes.map(c => (
              <div key={c.id} onClick={() => selectConnector(c.id)} className={`border rounded-2xl p-4 text-center cursor-pointer transition-all bg-white/5 hover:border-[#00D4AA]/40 hover:bg-[#00D4AA]/5 ${formData.connectorType === c.id ? 'border-[#00D4AA] bg-[#00D4AA]/10' : 'border-white/10'}`}>
                <div className="text-2xl mb-1">{c.icon}</div>
                <div className={`text-[10px] font-bold transition-colors ${formData.connectorType === c.id ? 'text-[#00D4AA]' : 'text-white/50'}`}>{c.id}</div>
              </div>
            ))}
          </div>
          {errors.connectorType && <p className="text-[11px] mt-2 text-rose-500">⚠ Please select a connector type</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2 font-syne">
          <button type="button" onClick={onBack} className="order-2 sm:order-1 px-8 py-4 rounded-xl font-bold text-sm transition-all bg-white/5 border border-white/10 text-gray-400 hover:border-[#00D4AA]/30 hover:text-white">← Back</button>
          <button type="submit" className="order-1 sm:order-2 flex-1 py-4 rounded-xl font-bold text-sm transition-all shadow-[0_6px_24px_rgba(0,212,170,0.3)] bg-gradient-to-br from-[#00D4AA] to-[#00A882] text-[#050F1C] hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(0,212,170,0.4)]">Review & Confirm →</button>
        </div>
      </form>
    </div>
  );
};


export default EVDetailsForm;
