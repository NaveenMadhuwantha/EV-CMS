import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOwnerProfile } from '../../../../firestore/ownerDb';
import { notificationDb } from '../../../../firestore/notificationDb';

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
      
      // Send Welcome Notification
      await notificationDb.send({
        recipientId: uid,
        title: 'Registration Successful!',
        message: 'Welcome to VoltWay! Your profile is now live and you can explore the network.',
        type: 'success',
        actionUrl: '/owner/dashboard'
      });

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
           <div className="w-32 h-32 rounded-[48px] bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-5xl text-[#0F172A] shadow-2xl relative z-10 animate-bounce">
             ⚡
           </div>
           <div className="absolute inset-0 bg-emerald-600/20 blur-3xl animate-pulse -z-10"></div>
        </div>
        
        <h2 className="font-manrope text-4xl font-extrabold text-[#0F172A] mb-4 tracking-tight uppercase">REGISTRATION LIVE!</h2>
        <p className="text-[#64748B] text-lg font-medium max-w-sm mx-auto mb-10 leading-relaxed font-inter">
          Welcome to the grid, <span className="text-[#0F172A] font-extrabold">{data.firstName}</span>. Your EV journey starts now.
        </p>

        <div className="bg-white rounded-3xl p-8 text-left mb-12 max-w-md mx-auto border border-[#E2E8F0] relative overflow-hidden shadow-sm">
           <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/5 rounded-bl-[100px] pointer-events-none"></div>
           <div className="text-[10px] font-bold uppercase tracking-widest text-[#059669] mb-8 font-inter opacity-80">Digital Station Receipt</div>
           <div className="space-y-5">
              {[
                ['Station Identifier', data.firstName + ' ' + data.lastName],
                ['Network Access', data.email],
                ['System Status', '✓ OPERATIONAL'],
              ].map(([l, v], i) => (
                <div key={i} className="flex flex-col gap-1.5 border-b border-[#E2E8F0] pb-4 last:border-0 last:pb-0">
                   <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">{l}</div>
                   <div className={`text-sm font-bold font-manrope ${l === 'System Status' ? 'text-[#059669]' : 'text-[#0F172A]'}`}>{v}</div>
                </div>
              ))}
           </div>
        </div>

        <button 
           onClick={() => navigate('/')} 
           className="w-full sm:w-auto px-12 py-5 rounded-2xl font-extrabold uppercase tracking-widest bg-blue-600 text-white shadow-xl hover:brightness-110 active:scale-95 transition-all font-manrope text-[13px]"
        >
          ENTER ECOSYSTEM →
        </button>
      </div>
    );
  }

  const SummarySection = ({ title, color, items, icon }) => (
    <div className="bg-white/[0.02] rounded-3xl p-6 border border-[#E2E8F0] hover:border-[#E2E8F0] transition-all group overflow-hidden relative shadow-sm">
      <div className="flex items-center justify-between mb-6 px-1">
         <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-[#F8FAFC] group-hover:scale-110 transition-transform`} style={{ color }}>{icon}</div>
            <div className="text-[13px] font-bold uppercase tracking-widest" style={{ color }}>{title}</div>
         </div>
      </div>
      <div className="space-y-5 px-1">
         {items.map(([l, v], i) => (
           <div key={i} className="flex flex-col gap-1">
              <div className="text-[12px] font-bold text-[#64748B] uppercase tracking-widest opacity-80">{l}</div>
              <div className="text-[16px] font-bold text-[#0F172A] truncate font-manrope">{v}</div>
           </div>
         ))}
      </div>
    </div>
  );

  return (
    <div className="w-full animate-fade-up font-inter">
      <div className="mb-5 px-7 py-5 rounded-[28px] bg-white border border-[#E2E8F0] relative overflow-hidden shadow-sm">
        <div className="text-[15px] font-bold uppercase tracking-[4px] mb-4 text-[#3B82F6] font-manrope">Phase 05 · Final Review</div>
        <h2 className="font-manrope text-3xl font-extrabold text-[#0F172A] mb-3 tracking-tighter leading-tight uppercase">REVIEW & DEPLOY</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-transparent rounded-full mb-6"></div>
        <p className="text-[16px] text-slate-600 font-medium leading-relaxed max-w-sm">Check your details before completing registration on the national grid.</p>
      </div>

      {fbError && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500/20 text-rose-400 text-[12px] font-bold uppercase tracking-widest flex items-center gap-4 animate-shake shadow-lg">
          <span>❌</span> {fbError}
        </div>
      )}

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-1 gap-6 mb-10">
        <SummarySection 
           title="Account Stations" icon="🔐" color="#00D4AA"
           items={[['Primary Station Email', data.email], ['Password Status', '•••••••• (Encrypted)']]}
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
            <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${termsChecked ? 'bg-emerald-600 border-emerald-500 shadow-lg' : 'bg-[#F8FAFC] border-[#E2E8F0] group-hover:border-[#3B82F6]/30'}`}>
               {termsChecked && <span className="text-[#0F172A] text-xs font-extrabold font-manrope">✓</span>}
            </div>
            <p className="text-[14px] font-bold text-slate-700 transition-colors group-hover:text-[#0F172A] leading-snug">
               I agree to the <span className="text-[#059669] hover:underline font-extrabold">Terms of Service</span> & <span className="text-[#059669] hover:underline font-extrabold">Privacy Policy</span> governing the national grid.
            </p>
         </div>
         {showTermsErr && <p className="ml-10 text-[10px] font-bold text-rose-400 uppercase tracking-widest animate-pulse font-inter">Agreement mandatory for deployment</p>}

         <div 
            onClick={() => !loading && setNewsChecked(!newsChecked)}
            className="flex items-start gap-4 cursor-pointer group opacity-70"
         >
            <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${newsChecked ? 'bg-blue-500 border-blue-500 shadow-lg' : 'bg-[#F8FAFC] border-[#E2E8F0] group-hover:border-[#3B82F6]/30'}`}>
               {newsChecked && <span className="text-[#0F172A] text-xs font-extrabold">✓</span>}
            </div>
            <p className="text-[14px] font-bold text-slate-700 leading-snug font-inter">
               Receive network updates & exclusive offers (optional node telemetry)
            </p>
         </div>
      </div>

      {/* Complete Button */}
      <div className="flex flex-col sm:flex-row gap-5 pt-8 font-manrope">
          <button 
            type="button" 
            onClick={() => !loading && navigate('/register/step3')} 
            className="order-2 sm:order-1 px-10 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-white border border-[#E2E8F0] text-[#7a9bbf] hover:text-[#0F172A] hover:bg-[#F8FAFC] shadow-sm text-[14px]"
          >
            ← MODIFY
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="order-1 sm:order-2 flex-1 py-4.5 rounded-2xl font-extrabold uppercase tracking-widest transition-all bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/30 group flex items-center justify-center gap-3 text-[16px]"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>⚡ DEPLOY PROFILE <span className="group-hover:translate-x-2 transition-transform duration-300">→</span></>
            )}
          </button>
      </div>
    </div>
  );
};

export default ReviewConfirmForm;





