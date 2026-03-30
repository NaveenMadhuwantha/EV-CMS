import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOwnerProfile } from '../firestore/ownerDb';

const ReviewConfirmForm = ({ onComplete }) => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [newsChecked, setNewsChecked] = useState(false);
  const [showTermsErr, setShowTermsErr] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fbError, setFbError] = useState('');

  useEffect(() => {
    const get = k => sessionStorage.getItem('reg_' + k) || '—';
    setData({
      email: get('email'), firstName: get('firstName'), lastName: get('lastName'), phone: get('phone'),
      nic: get('nic'), dob: get('dob'), address: get('address'), city: get('city'), district: get('district'), 
      vehicleType: get('vehicleType'), vehicleMake: get('vehicleMake'), vehicleModel: get('vehicleModel'), 
      plateNo: get('plateNo'), connectorType: get('connectorType'), batteryCapacity: get('batteryCapacity'),
      photoURL: sessionStorage.getItem('reg_photoURL') || null
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFbError('');
    if (!termsChecked) { setShowTermsErr(true); return; }
    
    const uid = sessionStorage.getItem('reg_uid');
    if (!uid) {
      setFbError('Session expired. Please start from Step 1.');
      return;
    }

    const rawData = {};
    Object.keys(sessionStorage).forEach(k => {
      if (k.startsWith('reg_')) {
        let val = sessionStorage.getItem(k);
        try { val = JSON.parse(val); } catch(e) {}
        rawData[k.replace('reg_', '')] = val;
      }
    });

    setLoading(true);
    try {
      await saveOwnerProfile(uid, rawData, newsChecked);
      setIsSuccess(true);
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('reg_')) sessionStorage.removeItem(key);
      });
      onComplete();
    } catch (error) {
      setFbError('Failed to save your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full text-center py-10 animate-fade-up font-inter">
        <div className="relative inline-block mb-10">
           <div className="w-32 h-32 rounded-[48px] bg-gradient-to-br from-[#00D4AA] to-[#4FFFB0] flex items-center justify-center text-5xl text-[#050F1C] shadow-2xl relative z-10 animate-bounce">
             ⚡
           </div>
           <div className="absolute inset-0 bg-[#00D4AA]/20 blur-3xl animate-pulse -z-10"></div>
        </div>
        
        <h2 className="font-manrope text-4xl font-extrabold text-white mb-4 tracking-tight uppercase">REGISTRATION LIVE!</h2>
        <p className="text-[#8AAFC8] text-lg font-medium max-w-sm mx-auto mb-10 leading-relaxed font-inter">
          Welcome to the grid, <span className="text-white font-extrabold">{data.firstName}</span>. Your EV journey starts now.
        </p>

        <div className="bg-white/[0.03] rounded-3xl p-8 text-left mb-12 max-w-md mx-auto border border-white/10 relative overflow-hidden shadow-sm">
           <div className="absolute top-0 right-0 w-24 h-24 bg-[#00D4AA]/5 rounded-bl-[100px] pointer-events-none"></div>
           <div className="text-[10px] font-bold uppercase tracking-widest text-[#00D4AA] mb-8 font-inter opacity-80">Digital Node Receipt</div>
           <div className="space-y-6">
              {[
                ['Node Identifier', data.firstName + ' ' + data.lastName],
                ['Network Access', data.email],
                ['System Status', '✓ OPERATIONAL'],
              ].map(([l, v], i) => (
                <div key={i} className="flex flex-col gap-1.5 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                   <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-widest">{l}</div>
                   <div className={`text-sm font-bold font-manrope ${l === 'System Status' ? 'text-[#00D4AA]' : 'text-white'}`}>{v}</div>
                </div>
              ))}
           </div>
        </div>

        <button 
           onClick={() => navigate('/login')} 
           className="w-full sm:w-auto px-12 py-5 rounded-2xl font-extrabold uppercase tracking-widest bg-[#00D4AA] text-[#050F1C] shadow-xl hover:brightness-110 active:scale-95 transition-all font-manrope text-[13px]"
        >
          ENTER ECOSYSTEM →
        </button>
      </div>
    );
  }

  const SummarySection = ({ title, color, items, icon }) => (
    <div className="bg-white/[0.02] rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative shadow-sm">
      <div className="flex items-center justify-between mb-6 px-1">
         <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 group-hover:scale-110 transition-transform`} style={{ color }}>{icon}</div>
            <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color }}>{title}</div>
         </div>
      </div>
      <div className="space-y-5 px-1">
         {items.map(([l, v], i) => (
           <div key={i} className="flex flex-col gap-1">
              <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-widest opacity-60">{l}</div>
              <div className="text-sm font-bold text-white truncate font-manrope">{v}</div>
           </div>
         ))}
      </div>
    </div>
  );

  return (
    <div className="w-full animate-fade-up font-inter">
      <div className="mb-10 p-8 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00D4AA]/10 to-transparent pointer-events-none"></div>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-3 text-[#00D4AA] opacity-80">Phase 04 · Final Review</div>
        <h2 className="font-manrope text-3xl font-extrabold text-white mb-3 tracking-tight leading-none uppercase">REVIEW & DEPLOY</h2>
        <p className="text-[15px] text-[#8AAFC8] font-medium leading-relaxed opacity-80">Check your details before completing registration on the national grid.</p>
      </div>

      {fbError && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500/20 text-rose-400 text-[12px] font-bold uppercase tracking-widest flex items-center gap-4 animate-shake shadow-lg">
          <span>❌</span> {fbError}
        </div>
      )}

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-1 gap-6 mb-10">
        <SummarySection 
           title="Account Nodes" icon="🔐" color="#00D4AA"
           items={[['Primary Node Email', data.email], ['Access Key Status', '•••••••• (Encrypted)']]}
        />
        <SummarySection 
           title="Identity Profile" icon="👤" color="#3B82F6"
           items={[['Entity Name', `${data.firstName} ${data.lastName}`], ['Mobile Contact', data.phone], ['Security NIC', data.nic]]}
        />
        <SummarySection 
           title="Hardware Config" icon="⚡" color="#F59E0B"
           items={[['Vehicle Type', `${data.vehicleMake} ${data.vehicleModel}`], ['License ID', data.plateNo || 'N/A'], ['Port Standard', data.connectorType]]}
        />
      </div>

      {/* Checkboxes */}
      <div className="space-y-4 mb-10 px-2">
         <div 
            onClick={() => !loading && setTermsChecked(!termsChecked)}
            className="flex items-start gap-4 cursor-pointer group"
         >
            <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${termsChecked ? 'bg-[#00D4AA] border-[#00D4AA] shadow-lg' : 'bg-white/5 border-white/10 group-hover:border-white/20'}`}>
               {termsChecked && <span className="text-[#050F1C] text-xs font-extrabold font-manrope">✓</span>}
            </div>
            <p className="text-[12px] font-bold text-[#8AAFC8] transition-colors group-hover:text-white leading-snug">
               I agree to the <span className="text-[#00D4AA] hover:underline font-extrabold">Terms of Service</span> & <span className="text-[#00D4AA] hover:underline font-extrabold">Privacy Policy</span> governing the national grid.
            </p>
         </div>
         {showTermsErr && <p className="ml-10 text-[10px] font-bold text-rose-400 uppercase tracking-widest animate-pulse font-inter">Agreement mandatory for deployment</p>}

         <div 
            onClick={() => !loading && setNewsChecked(!newsChecked)}
            className="flex items-start gap-4 cursor-pointer group opacity-70"
         >
            <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${newsChecked ? 'bg-blue-500 border-blue-500 shadow-lg' : 'bg-white/5 border-white/10 group-hover:border-white/20'}`}>
               {newsChecked && <span className="text-white text-xs font-extrabold">✓</span>}
            </div>
            <p className="text-[12px] font-bold text-[#4E7A96] leading-snug font-inter">
               Receive network updates & exclusive offers (optional node telemetry)
            </p>
         </div>
      </div>

      {/* Complete Button */}
      <div className="flex flex-col sm:flex-row gap-5 pt-8 font-manrope">
          <button 
            type="button" 
            onClick={() => !loading && navigate('/register/step3')} 
            className="order-2 sm:order-1 px-10 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-white/[0.03] border border-white/10 text-[#7a9bbf] hover:text-white hover:bg-white/5 shadow-sm text-[12px]"
          >
            ← MODIFY
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="order-1 sm:order-2 flex-1 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-gradient-to-r from-[#00D4AA] to-[#00A882] text-[#050F1C] hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#00D4AA]/30 group flex items-center justify-center gap-3 text-[13px]"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-[#050F1C]/20 border-t-[#050F1C] rounded-full animate-spin"></div>
            ) : (
              <>⚡ DEPLOY PROFILE <span className="group-hover:translate-x-2 transition-transform duration-300">→</span></>
            )}
          </button>
      </div>
    </div>
  );
};

export default ReviewConfirmForm;
