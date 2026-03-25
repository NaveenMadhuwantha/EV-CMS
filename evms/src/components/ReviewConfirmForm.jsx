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
      // Clear registration data
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('reg_')) sessionStorage.removeItem(key);
      });
      
      onComplete();
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Firestore Save Error:", error);
      setFbError('Failed to save your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center max-w-[500px] mx-auto animate-[fadeInUp_0.4s_ease_both] font-dm px-4">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl sm:text-5xl animate-[scaleIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_0.1s_both] bg-gradient-to-br from-[#00D4AA] to-[#00A882] text-[#050F1C] shadow-[0_0_50px_rgba(0,212,170,0.4)]">
          ✓
        </div>
        <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-white mb-3">You're All Set! ⚡</h2>
        <p className="text-sm sm:text-[15px] leading-relaxed mb-8 text-gray-400">
          Welcome to VoltWay, <strong className="text-[#00D4AA]">{data.firstName}</strong>!<br />
          Your account is live and ready. Start finding charging stations near you.
        </p>

        <div className="rounded-2xl p-5 sm:p-6 mb-8 text-left bg-[#00D4AA]/5 border border-[#00D4AA]/20">
          <div className="text-[11px] font-bold uppercase tracking-widest mb-4 text-[#00D4AA]">Registration Summary</div>
          <div className="space-y-0 text-[13px]">
            {[
              ['Full Name', `${data.firstName} ${data.lastName}`],
              ['Email', data.email],
              ['Vehicle', data.vehicleModel !== '—' ? `${data.vehicleMake} ${data.vehicleModel}` : data.vehicleType],
              ['Plate No.', data.plateNo],
              ['Connector', data.connectorType],
              ['Status', '✓ Active'],
            ].map(([lbl, val]) => val && val !== '—' && (
              <div key={lbl} className="flex justify-between py-2.5 border-b border-white/5 last:border-0">
                <span className="text-gray-500">{lbl}</span>
                <span className={`font-semibold ${lbl === 'Status' ? 'text-[#00D4AA]' : 'text-white'}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => navigate('/login')} className="w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-sm font-syne shadow-[0_6px_24px_rgba(0,212,170,0.35)] bg-gradient-to-br from-[#00D4AA] to-[#00A882] text-[#050F1C] hover:-translate-y-0.5 transition-all">
          Go to Dashboard →
        </button>
        <p className="text-[11px] mt-6 text-gray-600">Confirmation email sent to {data.email}</p>
      </div>
    );
  }

  const SummaryCard = ({ title, icon, color, onEdit, fields, items }) => (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-5 border-t-4 transition-all hover:bg-white/[0.07]`} style={{ borderTopColor: color }}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="font-syne text-[11px] font-extrabold uppercase tracking-wider" style={{ color }}>{title}</span>
        </div>
        {!loading && <button onClick={onEdit} className="text-[11px] font-bold text-gray-500 hover:text-white transition-colors">Edit ✎</button>}
      </div>
      <div className="space-y-3 font-dm">
        {items.map(([lbl, val], idx) => (
          <div key={idx} className="flex justify-between text-[13px]">
            <span className="text-gray-500">{lbl}</span>
            <span className="text-white font-medium text-right ml-4">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full animate-[fadeInUp_0.4s_ease_both]">
      <div className="mb-8">
        <div className="text-[11px] font-semibold uppercase tracking-widest mb-2 text-gray-500">Step 4 of 4</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-2">Review & Confirm</h2>
        <p className="text-sm text-gray-400">Check your details before completing registration.</p>
      </div>

      {fbError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-semibold animate-pulse">
          ⚠ {fbError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <SummaryCard 
          title="Account" icon="🔐" color="#00D4AA" onEdit={() => navigate('/register')}
          items={[['Email', data.email], ['Password', '••••••••']]}
        />
        <SummaryCard 
          title="Personal Info" icon="👤" color="#38BDF8" onEdit={() => navigate('/register/step2')}
          items={[['Name', `${data.firstName} ${data.lastName}`], ['Phone', data.phone], ['NIC', data.nic], ['Location', `${data.city}${data.district !== '—' ? `, ${data.district}` : ''}`]]}
        />
        <SummaryCard 
          title="EV Details" icon="⚡" color="#F59E0B" onEdit={() => navigate('/register/step3')}
          items={[['Vehicle', data.vehicleType], ['Make/Model', `${data.vehicleMake} ${data.vehicleModel !== '—' ? data.vehicleModel : ''}`], ['Plate', data.plateNo], ['Connector', data.connectorType], ['Battery', data.batteryCapacity !== '—' ? `${data.batteryCapacity} kWh` : '—']]}
        />
      </div>

      <div className="mt-8 space-y-4 font-dm">
        <div className="flex items-start gap-4">
          <div onClick={() => { if (!loading) { setTermsChecked(!termsChecked); setShowTermsErr(false); } }} className={`w-6 h-6 shrink-0 mt-0.5 rounded-lg border-2 border-white/10 flex items-center justify-center cursor-pointer transition-all ${termsChecked ? 'bg-[#00D4AA] border-[#00D4AA] shadow-[0_0_15px_rgba(0,212,170,0.3)]' : 'bg-white/5'}`}>
            {termsChecked && <span className="text-[#050F1C] text-sm font-bold">✓</span>}
          </div>
          <p className="text-[13px] leading-relaxed text-gray-400">
            I agree to the <a href="#" className="text-[#00D4AA] font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-[#00D4AA] font-bold hover:underline">Privacy Policy</a>.
          </p>
        </div>
        {showTermsErr && <p className="text-[11px] text-rose-500 ml-10">⚠ You must agree to continue</p>}

        <div className="flex items-start gap-4">
          <div onClick={() => !loading && setNewsChecked(!newsChecked)} className={`w-6 h-6 shrink-0 mt-0.5 rounded-lg border-2 border-white/10 flex items-center justify-center cursor-pointer transition-all ${newsChecked ? 'bg-[#38BDF8] border-[#38BDF8]' : 'bg-white/5'}`}>
            {newsChecked && <span className="text-[#050F1C] text-sm font-bold">✓</span>}
          </div>
          <p className="text-[13px] leading-relaxed text-gray-400">
            Subscribe to exclusive offers & network news <span className="text-gray-600">(Optional)</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-10 font-syne">
        <button 
          onClick={() => !loading && navigate('/register/step3')} 
          disabled={loading}
          className={`order-2 sm:order-1 px-8 py-4 rounded-xl font-bold text-sm transition-all bg-white/5 border border-white/10 text-gray-400 h-14 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#00D4AA]/30 hover:text-white'}`}
        >
          ← Back
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className={`order-1 sm:order-2 flex-1 py-4 rounded-xl font-bold text-sm transition-all shadow-[0_6px_24px_rgba(0,212,170,0.3)] bg-gradient-to-br from-[#00D4AA] to-[#00A882] text-[#050F1C] h-14 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(0,212,170,0.4)]'}`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-[#050F1C]/30 border-t-[#050F1C] rounded-full animate-spin"></div>
              Finalizing...
            </>
          ) : (
            <>⚡ Complete Registration</>
          )}
        </button>
      </div>
    </div>
  );
};


export default ReviewConfirmForm;
