import React, { useState } from 'react';
import { auth } from '../../../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ProvAccountForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fbError, setFbError] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');

  const validate = (name, val) => {
    let err = '';
    if (name === 'email' && errors.email) err = /\S+@\S+\.\S+/.test(val) ? '' : 'Invalid email format';
    if (name === 'password' && errors.password) err = val.length >= 8 ? '' : 'Min 8 characters required';
    if (name === 'confirm' && errors.confirm) err = val === formData.password ? '' : 'Passwords do not match';
    if (err !== '') setErrors(prev => ({ ...prev, [name]: err }));
    else setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    let err = '';
    if (id === 'email') err = /\S+@\S+\.\S+/.test(value) ? '' : 'Invalid email format';
    if (id === 'password') err = value.length >= 8 ? '' : 'Min 8 characters required';
    if (id === 'confirm') err = value === formData.password ? '' : 'Passwords do not match';
    setErrors(prev => ({ ...prev, [id]: err }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const name = id;
    setFormData(prev => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFbError('');
    const newErrors = {
      email: /\S+@\S+\.\S+/.test(formData.email) ? '' : 'Invalid email format',
      password: formData.password.length >= 8 ? '' : 'Min 8 characters required',
      confirm: formData.confirm === formData.password ? '' : 'Passwords do not match'
    };
    setErrors(newErrors);

    if (!Object.values(newErrors).some(x => x)) {
      setLoading(true);
      try {
        const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        sessionStorage.setItem('prov_email', formData.email);
        sessionStorage.setItem('prov_uid', user.uid);
        localStorage.setItem('user_role', 'provider');
        
        // Trigger Firebase Email Verification
        const { sendEmailVerification } = await import('firebase/auth');
        await sendEmailVerification(user);
        
        setShowVerification(true);
      } catch (error) {
        setFbError(error.code === 'auth/email-already-in-use' ? 'Email already registered.' : 'Failed to create account.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStrength = (pw) => [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
  const strength = getStrength(formData.password);
  const levels = [
    { c: 'bg-white/10', t: 'text-gray-500', l: '' },
    { c: 'bg-rose-500', t: 'text-rose-500', l: 'Weak' },
    { c: 'bg-amber-500', t: 'text-amber-500', l: 'Fair' },
    { c: 'bg-sky-400', t: 'text-sky-400', l: 'Good' },
    { c: 'bg-blue-500', t: 'text-blue-500', l: 'Strong' }
  ];

  return (
    <div className="w-full animate-fade-up font-inter">
      <div className="mb-5 px-7 py-5 rounded-[28px] bg-white border border-slate-100 relative overflow-hidden group shadow-[0_20px_50px_-20px_rgba(15,23,42,0.1)] transition-all hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.15)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-all duration-700"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/5 blur-2xl pointer-events-none"></div>
        <div className="text-[15px] font-bold uppercase tracking-[4px] mb-4 text-blue-600 font-manrope">Phase 01 · Provider Authentication</div>
        <h2 className="font-manrope text-3xl font-extrabold text-[#0F172A] mb-3 tracking-tighter leading-tight uppercase">ACCESS GATE</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-transparent rounded-full mb-6"></div>
        <p className="text-[16px] text-slate-600 font-medium leading-relaxed max-w-sm">Secure your portal to Sri Lanka's largest electric infrastructure network.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-8">
        {fbError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500/20 text-rose-400 text-[15px] font-bold animate-shake flex items-center gap-3 shadow-lg">
            <span className="text-lg">❌</span> {fbError}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Corporate Entity Email</label>
          <div className="relative group font-inter">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity">🏢</div>
            <input
              id="email" type="email" placeholder="company@voltway.lk"
              className={`w-full py-3.5 px-6 pl-14 bg-[#F8FAFC] border-2 rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none transition-all duration-300
                ${errors.email ? 'border-red-500/30 bg-red-500/5' : 'border-[#E2E8F0] focus:border-blue-400 focus:bg-blue-400/5 shadow-sm'}
              `}
              value={formData.email} onChange={handleChange} onBlur={handleBlur}
            />
          </div>
          {errors.email && <p className="ml-2 text-[12px] font-bold text-rose-500">{errors.email}</p>}
        </div>

        {/* Master Password - full width */}
        <div className="space-y-2">
          <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Master Password</label>
          <div className="relative group font-inter">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity">🔒</div>
            <input
              id="password" type={showPass ? 'text' : 'password'} placeholder="Minimum 8 characters"
              className={`w-full py-3.5 px-6 pl-14 pr-14 bg-[#F8FAFC] border-2 rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none transition-all duration-300
                ${errors.password ? 'border-red-500/30 bg-red-500/5' : 'border-[#E2E8F0] focus:border-blue-400 focus:bg-blue-400/5 shadow-sm'}
              `}
              value={formData.password} onChange={handleChange} onBlur={handleBlur}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-all p-2 text-xl">
              {showPass ? '🙈' : '👁'}
            </button>
          </div>
          {formData.password && !errors.password && (
            <div className="flex items-center gap-3 px-2 mt-2">
              <div className="flex gap-1.5 h-1 flex-1">
                {[1, 2, 3, 4].map(i => <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${i <= strength ? levels[strength].c : 'bg-[#E2E8F0]'}`}></div>)}
              </div>
              <p className={`text-[10px] font-bold uppercase tracking-widest shrink-0 ${levels[strength].t}`}>{levels[strength].l} Entropy</p>
            </div>
          )}
          {errors.password && <p className="ml-2 text-[12px] font-bold text-rose-500">{errors.password}</p>}
        </div>

        {/* Verify Password - full width */}
        <div className="space-y-2">
          <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Verify Password</label>
          <div className="relative group font-inter">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity">🛡️</div>
            <input
              id="confirm" type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password"
              className={`w-full py-3.5 px-6 pl-14 pr-14 bg-[#F8FAFC] border-2 rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none transition-all duration-300
                ${errors.confirm ? 'border-red-500/30 bg-red-500/5' : 'border-[#E2E8F0] focus:border-blue-400 focus:bg-blue-400/5 shadow-sm'}
              `}
              value={formData.confirm} onChange={handleChange} onBlur={handleBlur}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-all p-2 text-xl">
              {showConfirm ? '🙈' : '👁'}
            </button>
          </div>
          {errors.confirm && <p className="ml-2 text-[12px] font-bold text-rose-500">{errors.confirm}</p>}
        </div>

        <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-4 animate-fade-in shadow-sm">
           <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl shrink-0">🤝</div>
           <p className="text-[12px] font-bold text-slate-600 leading-relaxed italic opacity-80">
             Provider entities undergo a rigorous <span className="text-[#0F172A] font-bold opacity-100">24-hour verification</span> cycle to maintain the integrity of the Sri Lankan EV Network ecosystem.
           </p>
        </div>

        <div className="pt-6 font-manrope">
          <button type="submit" disabled={loading} className="w-full py-5 rounded-2xl text-[16px] font-extrabold uppercase tracking-widest transition-all bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/30 group flex items-center justify-center gap-4">
            {loading ? (
               <div className="w-6 h-6 border-4 border-[#E2E8F0] border-t-white rounded-full animate-spin"></div>
            ) : (
               <>REGISTER ENTITY <span className="group-hover:translate-x-2 transition-transform duration-300">→</span></>
            )}
          </button>
        </div>
      </form>

      {/* VERIFICATION OVERLAY */}
      {showVerification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#FCFCFC]/95 backdrop-blur-2xl animate-fade-in">
           <div className="w-full max-w-[500px] bg-white rounded-[40px] border border-blue-500/20 p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[80px] -z-10"></div>
              
              <div className="text-center mb-10">
                 <div className="w-20 h-20 rounded-[28px] bg-blue-500/10 flex items-center justify-center text-4xl mb-6 mx-auto border border-blue-500/20 animate-pulse">🏛️</div>
                 <h3 className="font-manrope text-3xl font-extrabold text-[#0F172A] mb-3 uppercase tracking-tight">ENTITY AUTH</h3>
                 <p className="text-slate-600 text-[15px] font-medium leading-relaxed">
                    A security key has been dispatched to <span className="text-[#0F172A] font-bold">{formData.email}</span>. Authorize this entity to establish Charging Stations.
                 </p>
                 <p className="text-[10px] text-blue-400/60 font-bold uppercase tracking-widest mt-4 italic">
                    Development Bypass Key: 123456
                 </p>
              </div>

              <div className="flex justify-between gap-3 mb-8">
                 {otp.map((digit, i) => (
                    <input
                       key={i}
                       type="text"
                       maxLength="1"
                       value={digit}
                       onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          const newOtp = [...otp];
                          newOtp[i] = val;
                          setOtp(newOtp);
                          if (val && e.target.nextSibling) e.target.nextSibling.focus();
                       }}
                       onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !otp[i] && e.target.previousSibling) {
                             e.target.previousSibling.focus();
                          }
                       }}
                       className={`w-full aspect-square bg-[#F8FAFC] border-2 rounded-2xl text-center text-2xl font-black text-[#0F172A] outline-none transition-all
                          ${otpError ? 'border-rose-500/30' : 'border-[#E2E8F0] focus:border-blue-400 focus:bg-blue-400/5'}`
                       }
                    />
                 ))}
              </div>

              {otpError && <p className="text-center text-rose-400 text-[11px] font-bold uppercase tracking-widest mb-8 animate-shake">Invalid Entity Password</p>}

              <button 
                 onClick={() => {
                    const code = otp.join('');
                    if (code === '123456') { // Mock check
                       navigate('/provider/register/step2');
                       window.scrollTo(0, 0);
                    } else {
                       setOtpError(true);
                       setTimeout(() => setOtpError(false), 2000);
                    }
                 }}
                 className="w-full py-5 rounded-2xl text-[14px] font-extrabold uppercase tracking-widest transition-all bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/30"
              >
                 ESTABLISH AUTHORITY →
              </button>

              <div className="mt-8 text-center">
                 <button 
                  onClick={() => setShowVerification(false)}
                  className="text-[11px] font-bold text-slate-600 uppercase tracking-[3px] hover:text-blue-400 transition-colors"
                 >
                    ← RE-ENTER DOMAIN
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProvAccountForm;





