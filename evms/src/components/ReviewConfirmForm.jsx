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

    setLoading(true);
    try {
      await saveOwnerProfile(uid, data, newsChecked);
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
      <div className="w-full text-center py-10 animate-scale-up">
        <div className="relative inline-block mb-10">
           <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-[#00D4AA] to-[#4FFFB0] flex items-center justify-center text-5xl text-[#050F1C] shadow-[0_0_60px_rgba(0,212,170,0.4)] relative z-10 animate-bounce">
             ⚡
           </div>
           <div className="absolute inset-0 bg-[#00D4AA]/20 blur-2xl animate-pulse -z-10"></div>
        </div>
        
        <h2 className="font-syne text-4xl font-extrabold text-white mb-4 tracking-tight uppercase">Registration Live!</h2>
        <p className="text-[#8AAFC8] text-lg font-medium max-w-sm mx-auto mb-10 leading-relaxed">
          Welcome to the grid, <span className="text-white font-black">{data.firstName}</span>. Your EV journey starts now.
        </p>

        <div className="glass-panel rounded-[32px] p-8 text-left mb-10 max-w-sm mx-auto border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-[#00D4AA]/5 rounded-bl-[100px]"></div>
           <div className="text-[10px] font-black uppercase tracking-[4px] text-[#00D4AA] mb-6">Digital Receipt</div>
           <div className="space-y-4">
              {[
                ['Node Identifier', data.firstName + ' ' + data.lastName],
                ['Network Access', data.email],
                ['System Status', '✓ OPERATIONAL'],
              ].map(([l, v], i) => (
                <div key={i} className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                   <div className="text-[9px] font-bold text-[#4E7A96] uppercase tracking-[2px]">{l}</div>
                   <div className={`text-sm font-bold ${l === 'System Status' ? 'text-[#00D4AA]' : 'text-white'}`}>{v}</div>
                </div>
              ))}
           </div>
        </div>

        <button 
           onClick={() => navigate('/login')} 
           className="w-full sm:w-auto px-12 py-5 rounded-[24px] font-black uppercase tracking-[3px] bg-gradient-to-r from-[#00D4AA] via-[#4FFFB0] to-[#00D4AA] bg-[length:200%_auto] text-[#050F1C] shadow-2xl shadow-[#00D4AA]/30 hover:bg-right transition-all duration-700 animate-fade-in"
        >
          Enter Ecosystem →
        </button>
      </div>
    );
  }

  const SummarySection = ({ title, color, items, icon }) => (
    <div className="glass-panel rounded-[28px] p-6 border-white/5 hover:border-white/20 transition-all group overflow-hidden relative">
      <div className="flex items-center justify-between mb-5">
         <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 group-hover:scale-110 transition-transform`} style={{ color }}>{icon}</div>
            <div className="text-[10px] font-black uppercase tracking-[3px]" style={{ color }}>{title}</div>
         </div>
      </div>
      <div className="space-y-4">
         {items.map(([l, v], i) => (
           <div key={i} className="flex flex-col gap-1">
              <div className="text-[9px] font-bold text-[#4E7A96] uppercase tracking-[2px]">{l}</div>
              <div className="text-sm font-bold text-white truncate">{v}</div>
           </div>
         ))}
      </div>
    </div>
  );

  return (
    <div className="w-full animate-fade-up">
      <div className="mb-10 p-6 rounded-[32px] glass-panel border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00D4AA]/10 to-transparent pointer-events-none"></div>
        <div className="text-[10px] font-black uppercase tracking-[4px] mb-3 text-[#00D4AA] opacity-80">Phase 04 · Final Review</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-2 leading-none uppercase tracking-tight">Review & Deploy</h2>
        <p className="text-sm text-[#8AAFC8] font-medium leading-relaxed">Check your details before completing registration.</p>
      </div>

      {fbError && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-widest flex items-center gap-4 animate-shake">
          <span>❌</span> {fbError}
        </div>
      )}

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-1 gap-6 mb-10">
        <SummarySection 
           title="Account Nodes" icon="🔐" color="#00D4AA"
           items={[['Primary Node', data.email], ['Access Key', '••••••••']]}
        />
        <SummarySection 
           title="Identity Profile" icon="👤" color="#3B82F6"
           items={[['Entity', `${data.firstName} ${data.lastName}`], ['Mobile', data.phone], ['NIC', data.nic]]}
        />
        <SummarySection 
           title="Hardware config" icon="⚡" color="#F59E0B"
           items={[['Vehicle', `${data.vehicleMake} ${data.vehicleModel}`], ['License', data.plateNo], ['Port', data.connectorType]]}
        />
      </div>

      {/* Checkboxes */}
      <div className="space-y-4 mb-10 px-4">
         <div 
            onClick={() => !loading && setTermsChecked(!termsChecked)}
            className="flex items-center gap-4 cursor-pointer group"
         >
            <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${termsChecked ? 'bg-[#00D4AA] border-[#00D4AA] shadow-[0_0_15px_rgba(0,212,170,0.3)]' : 'bg-white/5 border-white/10 group-hover:border-white/30'}`}>
               {termsChecked && <span className="text-[#050F1C] text-sm font-bold">✓</span>}
            </div>
            <p className="text-[12px] font-bold text-[#8AAFC8] transition-colors group-hover:text-white leading-tight">
               I agree to the <span className="text-[#00D4AA] hover:underline">Terms of Service</span> & <span className="text-[#00D4AA] hover:underline">Privacy Policy</span>.
            </p>
         </div>
         {showTermsErr && <p className="ml-11 text-[10px] font-black text-rose-400 uppercase tracking-widest animate-pulse">Required field</p>}

         <div 
            onClick={() => !loading && setNewsChecked(!newsChecked)}
            className="flex items-center gap-4 cursor-pointer group opacity-80"
         >
            <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${newsChecked ? 'bg-blue-500 border-blue-500' : 'bg-white/5 border-white/10 group-hover:border-white/30'}`}>
               {newsChecked && <span className="text-white text-sm font-bold">✓</span>}
            </div>
            <p className="text-[12px] font-bold text-[#4E7A96] leading-tight">
               Receive network updates & exclusive offers (optional)
            </p>
         </div>
      </div>

      {/* Complete Button */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            type="button" 
            onClick={() => !loading && navigate('/register/step3')} 
            className="order-2 sm:order-1 px-10 py-5 rounded-[24px] font-black uppercase tracking-[2px] transition-all bg-white/5 border-2 border-white/10 text-white hover:bg-white/10"
          >
            ← Modify
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="order-1 sm:order-2 flex-1 py-5 rounded-[24px] font-black uppercase tracking-[3px] transition-all bg-gradient-to-br from-[#00D4AA] to-[#00A882] text-[#050F1C] hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-[#00D4AA]/30 group flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-5 h-5 border-3 border-[#050F1C]/30 border-t-[#050F1C] rounded-full animate-spin"></div>
            ) : (
              <>⚡ Deploy Profile <span className="group-hover:translate-x-2 transition-transform">→</span></>
            )}
          </button>
      </div>
    </div>
  );
};

export default ReviewConfirmForm;
