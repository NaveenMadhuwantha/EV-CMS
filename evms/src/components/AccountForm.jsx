import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
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

  const checkEmail = (val) => {
    setEmail(val);
    setFbError('');
    if (!val) { setEmailStatus('none'); return; }
    setEmailStatus(/\S+@\S+\.\S+/.test(val) ? 'ok' : 'err');
  };

  const checkStrength = (pw) => {
    setPassword(pw);
    if (!pw) { setStrength(0); setPassStatus('none'); return; }
    const checks = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)];
    setStrength(checks.filter(Boolean).length);
    setPassStatus(pw.length >= 8 ? 'ok' : 'err');
  };

  const checkMatch = (val) => {
    setConfirm(val);
    if (!val) { setMatchStatus('none'); return; }
    setMatchStatus(val === password ? 'ok' : 'err');
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
        onNext();
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

  const colors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-sky-400', 'bg-[#00D4AA]'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="w-full animate-fade-up font-inter">
      <div className="mb-10 p-8 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden group shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00D4AA]/10 to-transparent pointer-events-none"></div>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-3 text-[#00D4AA] opacity-80">Phase 01 · Authentication</div>
        <h2 className="font-manrope text-3xl font-extrabold text-white mb-3 tracking-tight leading-none">CREATE ACCOUNT</h2>
        <p className="text-[15px] text-[#8AAFC8] font-medium leading-relaxed opacity-80">Secure your access to Sri Lanka's premier EV ecosystem.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {fbError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[13px] font-bold animate-shake flex items-center gap-3 shadow-lg">
            <span className="text-lg">⚠</span> {fbError}
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-3">
          <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Institutional Email</label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity">📧</div>
            <input
              type="email"
              placeholder="name@example.com"
              className={`w-full py-5 px-6 pl-14 bg-white/5 border-2 rounded-2xl text-white text-[15px] font-bold outline-none transition-all duration-300
                ${emailStatus === 'err' ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/5 focus:border-[#00D4AA] focus:bg-[#00D4AA]/5 shadow-sm'}
              `}
              value={email}
              onChange={(e) => checkEmail(e.target.value)}
            />
          </div>
          {emailStatus === 'err' && <p className="ml-2 text-[11px] font-bold text-rose-400">Invalid account format</p>}
        </div>

        {/* Password Input */}
        <div className="space-y-3">
          <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Security Password</label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity">🔒</div>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Minimum 8 characters"
              className={`w-full py-5 px-6 pl-14 pr-14 bg-white/5 border-2 rounded-2xl text-white text-[15px] font-bold outline-none transition-all duration-300
                ${passStatus === 'err' ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/5 focus:border-[#00D4AA] focus:bg-[#00D4AA]/5 shadow-sm'}
              `}
              value={password}
              onChange={(e) => checkStrength(e.target.value)}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity p-2">
              {showPass ? '🙈' : '👁'}
            </button>
          </div>
          
          {password && (
            <div className="px-2 mt-4">
              <div className="flex gap-1.5 h-1.5 mb-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${i <= strength ? colors[strength] : 'bg-white/5'}`}></div>
                ))}
              </div>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${strength >= 3 ? 'text-[#00D4AA]' : 'text-[#4E7A96]'}`}>
                {labels[strength]} Security Score
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-6 font-manrope">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl text-[14px] font-extrabold uppercase tracking-widest transition-all bg-gradient-to-br from-[#00D4AA] to-[#4FFFB0] text-[#050F1C] hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#00D4AA]/20 flex items-center justify-center gap-3 relative overflow-hidden group
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            {loading ? (
              <div className="w-6 h-6 border-4 border-[#050F1C]/20 border-t-[#050F1C] rounded-full animate-spin"></div>
            ) : (
              <>Initiate Profile Setup <span className="text-xl group-hover:translate-x-2 transition-transform duration-300">→</span></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;
