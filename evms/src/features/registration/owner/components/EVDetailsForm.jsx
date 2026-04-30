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
    <div className="w-full animate-fade-up font-inter">
      <div className="mb-6 p-10 rounded-[40px] bg-white border border-slate-100 relative overflow-hidden group shadow-[0_20px_50px_-20px_rgba(15,23,42,0.1)] transition-all hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.15)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-all duration-700"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/5 blur-2xl pointer-events-none"></div>
        <div className="text-[14px] font-bold uppercase tracking-[4px] mb-4 text-amber-600/60 font-manrope">Phase 03 · Charging Station</div>
        <h2 className="font-manrope text-5xl font-extrabold text-[#0F172A] mb-4 tracking-tighter leading-tight uppercase">EV ECOSYSTEM</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-transparent rounded-full mb-6"></div>
        <p className="text-[18px] text-slate-500 font-medium leading-relaxed max-w-sm">Establish your primary charging node and vehicle parameters.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 pb-10">
        
        {/* Vehicle Classification */}
        <div className="space-y-4">
          <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#64748B]">Vehicle Classification</label>
          <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
            {vehicleTypes.map(t => (
              <div key={t.id} onClick={() => selectType(t.id)} className={`group relative h-28 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 border-2 cursor-pointer shadow-sm
                ${formData.vehicleType === t.id ? 'border-amber-500 bg-amber-500/10 shadow-lg' : 'border-[#E2E8F0] bg-white/[0.02] hover:border-[#E2E8F0] hover:scale-[1.02]'}
              `}>
                <div className={`text-3xl mb-2 transition-transform duration-300 ${formData.vehicleType === t.id ? 'scale-110' : 'group-hover:scale-110'}`}>{t.icon}</div>
                <div className={`text-[10px] font-bold uppercase tracking-widest font-manrope ${formData.vehicleType === t.id ? 'text-amber-500' : 'text-[#64748B]'}`}>{t.id}</div>
              </div>
            ))}
          </div>
          {errors.vehicleType && <p className="ml-2 text-[11px] font-bold text-red-400">Please provide vehicle classification</p>}
        </div>

        {/* Technical Specifications */}
        <div className="space-y-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                 <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#64748B]">Manufacturer</label>
                 <div className="relative group">
                    <select id="vehicleMake" className={`w-full py-4.5 px-6 bg-[#F8FAFC] border-2 rounded-2xl text-[#0F172A] font-bold outline-none appearance-none transition-all ${errors.vehicleMake ? 'border-red-500/30' : 'border-[#E2E8F0] focus:border-amber-500'}`} value={formData.vehicleMake} onChange={handleInputChange}>
                       <option value="" className="bg-[#FCFCFC]">Select maker</option>
                       {brands.map(b => <option key={b} value={b} className="bg-[#FCFCFC]">{b}</option>)}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-amber-500 text-xs">▼</div>
                 </div>
              </div>
              <div className="space-y-3">
                 <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#64748B]">Model Identifier</label>
                 <input id="vehicleModel" type="text" placeholder="e.g. Model Y" className="w-full py-4.5 px-6 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl text-[#0F172A] font-bold outline-none focus:border-amber-500 transition-all font-inter" value={formData.vehicleModel} onChange={handleInputChange} />
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                 <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#64748B]">Production Year</label>
                 <div className="relative group">
                    <select id="vehicleYear" className="w-full py-4.5 px-6 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl text-[#0F172A] font-bold outline-none appearance-none focus:border-amber-500 transition-all" value={formData.vehicleYear} onChange={handleInputChange}>
                       <option value="" className="bg-[#FCFCFC]">Select year</option>
                       {years.map(y => <option key={y} value={y} className="bg-[#FCFCFC]">{y}</option>)}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-amber-500 text-xs">▼</div>
                 </div>
              </div>
              <div className="space-y-3">
                 <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#64748B]">Battery Capacity (kWh)</label>
                 <input id="batteryCapacity" type="number" step="0.1" placeholder="e.g. 75.0" className="w-full py-4.5 px-6 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl text-[#0F172A] font-bold outline-none focus:border-amber-500 transition-all font-inter" value={formData.batteryCapacity} onChange={handleInputChange} />
              </div>
           </div>

           <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#64748B]">License Plate Number</label>
              <input id="plateNo" type="text" placeholder="e.g. CBA-1234" className={`w-full py-4.5 px-6 bg-[#F8FAFC] border-2 rounded-2xl text-[#0F172A] font-bold outline-none transition-all uppercase placeholder:normal-case font-inter ${errors.plateNo ? 'border-red-500/30' : 'border-[#E2E8F0] focus:border-amber-500'}`} value={formData.plateNo} onChange={handleInputChange} />
           </div>
        </div>

        {/* Charging Connection */}
        <div className="space-y-4">
           <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#64748B]">Port Specification</label>
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {connectorTypes.map(c => (
                <div key={c.id} onClick={() => selectConnector(c.id)} className={`h-24 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 border-2 cursor-pointer bg-white/[0.02] shadow-sm
                  ${formData.connectorType === c.id ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-[#E2E8F0] hover:border-[#E2E8F0]'}
                `}>
                  <div className={`text-2xl mb-1 transition-transform duration-300 ${formData.connectorType === c.id ? 'scale-110' : ''}`}>{c.icon}</div>
                  <div className={`text-[10px] font-bold tracking-widest uppercase font-manrope ${formData.connectorType === c.id ? 'text-[#3B82F6]' : 'text-[#64748B]'}`}>{c.id}</div>
                </div>
              ))}
           </div>
           {errors.connectorType && <p className="ml-2 text-[11px] font-bold text-red-400">Port specification is required</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 font-manrope pt-8">
          <button type="button" onClick={onBack} className="order-2 sm:order-1 px-10 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-white border border-[#E2E8F0] text-[#7a9bbf] hover:text-[#0F172A] hover:bg-[#F8FAFC] shadow-sm text-[12px]">← BACK</button>
          <button type="submit" className="order-1 sm:order-2 flex-1 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/20 group text-[13px]">FINALIZE DATA <span className="group-hover:translate-x-2 transition-transform ml-2 duration-300">→</span></button>
        </div>
      </form>
    </div>
  );
};

export default EVDetailsForm;
