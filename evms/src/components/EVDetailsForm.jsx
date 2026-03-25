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

  return (
    <div className="w-full animate-fade-up">
      <div className="mb-8 p-6 rounded-[32px] glass-panel border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none"></div>
        <div className="text-[10px] font-black uppercase tracking-[4px] mb-3 text-amber-500 opacity-80">Phase 03 · Hardware</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-2 leading-none uppercase tracking-tight">EV Ecosystem</h2>
        <p className="text-sm text-[#8AAFC8] font-medium leading-relaxed">Register your electric vehicle for the correct charging setup.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 pb-10">
        
        {/* Vehicle Classification */}
        <div className="space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Vehicle Class</label>
          <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
            {vehicleTypes.map(t => (
              <div key={t.id} onClick={() => selectType(t.id)} className={`group relative h-28 rounded-[28px] flex flex-col items-center justify-center transition-all duration-300 border-2 cursor-pointer
                ${formData.vehicleType === t.id ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-white/10 bg-white/5 hover:border-white/20 hover:scale-[1.02]'}
              `}>
                <div className={`text-3xl mb-2 transition-transform duration-300 ${formData.vehicleType === t.id ? 'scale-110' : 'group-hover:scale-110'}`}>{t.icon}</div>
                <div className={`text-[10px] font-black uppercase tracking-widest ${formData.vehicleType === t.id ? 'text-amber-500' : 'text-[#4E7A96]'}`}>{t.id}</div>
              </div>
            ))}
          </div>
          {errors.vehicleType && <p className="ml-4 text-[11px] font-bold text-rose-400">Please select a class</p>}
        </div>

        {/* Technical Specifications */}
        <div className="space-y-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Manufacturer</label>
                 <div className="relative group">
                    <select id="vehicleMake" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none appearance-none transition-all ${errors.vehicleMake ? 'border-rose-500/30' : 'border-white/10 focus:border-amber-500'}`} value={formData.vehicleMake} onChange={handleInputChange}>
                       <option value="" className="bg-[#050F1C]">Select maker</option>
                       {brands.map(b => <option key={b} value={b} className="bg-[#050F1C]">{b}</option>)}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-amber-500">▼</div>
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Model Identifier</label>
                 <input id="vehicleModel" type="text" placeholder="e.g. Model Y" className="w-full py-5 px-6 bg-white/5 border-2 border-white/10 rounded-[24px] text-white font-bold outline-none focus:border-amber-500 transition-all" value={formData.vehicleModel} onChange={handleInputChange} />
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Production Year</label>
                 <div className="relative group">
                    <select id="vehicleYear" className="w-full py-5 px-6 bg-white/5 border-2 border-white/10 rounded-[24px] text-white font-bold outline-none appearance-none focus:border-amber-500 transition-all font-dm" value={formData.vehicleYear} onChange={handleInputChange}>
                       <option value="" className="bg-[#050F1C]">Select year</option>
                       {years.map(y => <option key={y} value={y} className="bg-[#050F1C]">{y}</option>)}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-amber-500">▼</div>
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Battery Capacity (kWh)</label>
                 <input id="batteryCapacity" type="number" step="0.1" placeholder="e.g. 75.0" className="w-full py-5 px-6 bg-white/5 border-2 border-white/10 rounded-[24px] text-white font-bold outline-none focus:border-amber-500 transition-all" value={formData.batteryCapacity} onChange={handleInputChange} />
              </div>
           </div>

           <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Vehicle License Plate</label>
              <input id="plateNo" type="text" placeholder="e.g. CBA-1234" className={`w-full py-5 px-6 bg-white/5 border-2 rounded-[24px] text-white font-bold outline-none transition-all uppercase placeholder:normal-case ${errors.plateNo ? 'border-rose-500/30' : 'border-white/10 focus:border-amber-500'}`} value={formData.plateNo} onChange={handleInputChange} />
           </div>
        </div>

        {/* Charging Connection */}
        <div className="space-y-4">
           <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Port Standard</label>
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {connectorTypes.map(c => (
                <div key={c.id} onClick={() => selectConnector(c.id)} className={`h-24 rounded-[24px] flex flex-col items-center justify-center transition-all duration-300 border-2 cursor-pointer bg-white/5
                  ${formData.connectorType === c.id ? 'border-[#00D4AA] bg-[#00D4AA]/10 shadow-[0_0_20px_rgba(0,212,170,0.15)]' : 'border-white/10 hover:border-white/20'}
                `}>
                  <div className={`text-2xl mb-1 transition-transform ${formData.connectorType === c.id ? 'scale-110' : ''}`}>{c.icon}</div>
                  <div className={`text-[10px] font-black tracking-widest uppercase ${formData.connectorType === c.id ? 'text-[#00D4AA]' : 'text-[#4E7A96]'}`}>{c.id}</div>
                </div>
              ))}
           </div>
           {errors.connectorType && <p className="ml-4 text-[11px] font-bold text-rose-400">Port specification required</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button type="button" onClick={onBack} className="order-2 sm:order-1 px-10 py-5 rounded-[24px] font-black uppercase tracking-[2px] transition-all bg-white/5 border-2 border-white/10 text-white hover:bg-white/10">← Back</button>
          <button type="submit" className="order-1 sm:order-2 flex-1 py-5 rounded-[24px] font-black uppercase tracking-[3px] transition-all bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-amber-500/20 group">Finalize Data <span className="group-hover:translate-x-2 transition-transform ml-1">→</span></button>
        </div>
      </form>
    </div>
  );
};

export default EVDetailsForm;
