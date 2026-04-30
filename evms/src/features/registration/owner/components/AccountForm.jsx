import React, { useState, useEffect } from 'react';
import { auth } from '../../../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const AccountForm = ({ onNext }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailStatus, setEmailStatus] = useState('none');
  const [passStatus, setPassStatus] = useState('none');
  const [matchStatus, setMatchStatus] = useState('none');
  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fbError, setFbError] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');

  const checkEmail = (val) => {
    setEmail(val);
    setFbError('');
    if (emailStatus === 'err' && /\S+@\S+\.\S+/.test(val)) {
      setEmailStatus('ok');
    }
  };

  const handleEmailBlur = () => {
    if (!email) setEmailStatus('none');
    else setEmailStatus(/\S+@\S+\.\S+/.test(email) ? 'ok' : 'err');
  };

  const checkStrength = (pw) => {
    setPassword(pw);
    if (!pw) { setStrength(0); setPassStatus('none'); return; }
    const checks = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)];
    setStrength(checks.filter(Boolean).length);
    if (passStatus === 'err' && pw.length >= 8) {
      setPassStatus('ok');
    }
  };

  const handlePassBlur = () => {
    if (!password) setPassStatus('none');
    else setPassStatus(password.length >= 8 ? 'ok' : 'err');
  };

  const checkMatch = (val) => {
    setConfirm(val);
    if (matchStatus === 'err' && val === password) {
      setMatchStatus('ok');
    }
  };

  const handleMatchBlur = () => {
    if (!confirm) setMatchStatus('none');
    else setMatchStatus(confirm === password ? 'ok' : 'err');
  };

  useEffect(() => { if (confirm) checkMatch(confirm); }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFbError('');
    let ok = true;
    if (emailStatus !== 'ok') { setEmailStatus('err'); ok = false; }
    if (passStatus !== 'ok') { setPassStatus('err'); ok = false; }
    if (matchStatus !== 'ok') { setMatchStatus('err'); ok = false; }
    
    if (ok) {
      setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        sessionStorage.setItem('reg_email', email);
        sessionStorage.setItem('reg_uid', user.uid);
        localStorage.setItem('user_role', 'owner');
        
        // Trigger Firebase Email Verification
        const { sendEmailVerification } = await import('firebase/auth');
        await sendEmailVerification(user);
        
        setShowVerification(true);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') setFbError('This email is already registered.');
        else if (error.code === 'auth/invalid-email') setFbError('Invalid email format.');
        else if (error.code === 'auth/weak-password') setFbError('Password is too weak.');
        else setFbError('Failed to create account. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const colors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-sky-400', 'bg-emerald-600'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="w-full animate-fade-up font-inter">
      <div className="mb-5 px-7 py-5 rounded-[28px] bg-white border border-slate-100 relative overflow-hidden group shadow-[0_20px_50px_-20px_rgba(15,23,42,0.1)] transition-all hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.15)]">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 blur-3xl pointer-events-none"></div>
        <div className="text-[15px] font-bold uppercase tracking-[4px] mb-4 text-blue-700 font-manrope">Phase 01 · Authentication</div>
        <h2 className="font-manrope text-3xl font-extrabold text-[#0F172A] mb-3 tracking-tighter leading-tight uppercase">CREATE ACCOUNT</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-transparent rounded-full mb-6"></div>
        <p className="text-[16px] text-slate-600 font-medium leading-relaxed max-w-sm">Secure your access to Sri Lanka's premier EV ecosystem.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-8">
        {fbError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[15px] font-bold animate-shake flex items-center gap-3 shadow-lg">
            <span className="text-lg">⚠</span> {fbError}
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Email Address</label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity">📧</div>
            <input
              type="email"
              placeholder="name@example.com"
              className={`w-full py-4 px-6 pl-14 bg-[#F8FAFC] border-2 rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none transition-all duration-300
                ${emailStatus === 'err' ? 'border-rose-500/30 bg-rose-500/5' : 'border-[#E2E8F0] focus:border-blue-500 focus:bg-blue-600/5 shadow-sm'}
              `}
              value={email}
              onChange={(e) => checkEmail(e.target.value)}
              onBlur={handleEmailBlur}
            />
          </div>
          {emailStatus === 'err' && <p className="ml-2 text-[12px] font-bold text-rose-500">Invalid email format</p>}
        </div>

        {/* Security Password - full width */}
        <div className="space-y-2">
          <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Security Password</label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity">🔒</div>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Minimum 8 characters"
              className={`w-full py-4 px-6 pl-14 pr-14 bg-[#F8FAFC] border-2 rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none transition-all duration-300
                ${passStatus === 'err' ? 'border-rose-500/30 bg-rose-500/5' : 'border-[#E2E8F0] focus:border-blue-500 focus:bg-blue-600/5 shadow-sm'}
              `}
              value={password}
              onChange={(e) => checkStrength(e.target.value)}
              onBlur={handlePassBlur}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity p-2">
              {showPass ? '🙈' : '👁'}
            </button>
          </div>
          {password && (
            <div className="flex items-center gap-3 px-2 mt-2">
              <div className="flex gap-1.5 h-1 flex-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${i <= strength ? colors[strength] : 'bg-[#E2E8F0]'}`}></div>
                ))}
              </div>
              <p className={`text-[11px] font-bold uppercase tracking-widest shrink-0 ${strength >= 3 ? 'text-blue-700' : 'text-slate-400'}`}>
                {labels[strength]}
              </p>
            </div>
          )}
        </div>

        {/* Verify Password - full width */}
        <div className="space-y-2">
          <label className="block text-[13px] font-bold uppercase tracking-widest ml-2 text-[#0F172A]">Verify Password</label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity">🛡️</div>
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat your password"
              className={`w-full py-4 px-6 pl-14 pr-14 bg-[#F8FAFC] border-2 rounded-2xl text-[#0F172A] text-[17px] font-bold outline-none transition-all duration-300
                ${matchStatus === 'err' ? 'border-rose-500/30 bg-rose-500/5' : 'border-[#E2E8F0] focus:border-blue-500 focus:bg-blue-600/5 shadow-sm'}
              `}
              value={confirm}
              onChange={(e) => checkMatch(e.target.value)}
              onBlur={handleMatchBlur}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity p-2">
              {showConfirm ? '🙈' : '👁'}
            </button>
          </div>
          {matchStatus === 'err' && confirm && <p className="ml-2 text-[12px] font-bold text-rose-500">Passwords do not match</p>}
        </div>

        {/* Action Button */}
        <div className="pt-6 font-manrope">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl text-[16px] font-extrabold uppercase tracking-widest transition-all bg-gradient-to-br from-blue-600 to-blue-500 text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 relative overflow-hidden group
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            {loading ? (
              <div className="w-6 h-6 border-4 border-[#0F172A]/20 border-t-[#0F172A] rounded-full animate-spin"></div>
            ) : (
              <>Profile Setup <span className="text-xl group-hover:translate-x-2 transition-transform duration-300">→</span></>
            )}
          </button>
        </div>
      </form>

      {/* VERIFICATION OVERLAY */}
      {showVerification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#FCFCFC]/90 backdrop-blur-xl animate-fade-in">
            <div className="w-full max-w-[500px] bg-white rounded-[40px] border border-[#E2E8F0] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 blur-[80px] -z-10"></div>
              
              <div className="text-center mb-10">
                 <div className="w-20 h-20 rounded-[28px] bg-blue-50 flex items-center justify-center text-4xl mb-6 mx-auto border border-blue-500/20 animate-pulse">⚡</div>
                 <h3 className="font-manrope text-3xl font-extrabold text-[#0F172A] mb-3 uppercase tracking-tight">Verify Station</h3>
                 <p className="text-slate-600 text-[15px] font-medium leading-relaxed">
                    We've deployed a security key to <span className="text-[#0F172A] font-bold">{email}</span>. Please authorize this node to continue.
                 </p>
                 <p className="text-[10px] text-[#3B82F6]/60 font-bold uppercase tracking-widest mt-4 italic">
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
                          ${otpError ? 'border-rose-500/30' : 'border-[#E2E8F0] focus:border-blue-500 focus:bg-blue-600/5'}`
                       }
                    />
                 ))}
              </div>

              {otpError && <p className="text-center text-rose-400 text-[11px] font-bold uppercase tracking-widest mb-8 animate-shake">Invalid Station Password</p>}

              <button 
                 onClick={() => {
                    const code = otp.join('');
                    if (code === '123456') { // Mock check
                       onNext();
                    } else {
                       setOtpError(true);
                       setTimeout(() => setOtpError(false), 2000);
                    }
                 }}
                 className="w-full py-5 rounded-2xl text-[14px] font-extrabold uppercase tracking-widest transition-all bg-blue-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/20"
              >
                 AUTHORIZE ACCESS →
              </button>

              <div className="mt-8 text-center">
                 <button 
                  onClick={() => setShowVerification(false)}
                  className="text-[11px] font-bold text-slate-600 uppercase tracking-[3px] hover:text-[#3B82F6] transition-colors"
                 >
                    ← RE-ENTER EMAIL
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AccountForm;





