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
    <div className="w-full animate-fade-up">
      <div className="mb-8 p-6 rounded-[32px] glass-panel border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00D4AA]/10 to-transparent pointer-events-none"></div>
        <div className="text-[10px] font-black uppercase tracking-[4px] mb-3 text-[#00D4AA] opacity-80">Phase 01 · Auth</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-2 leading-none uppercase tracking-tight">Create Account</h2>
        <p className="text-sm text-[#8AAFC8] font-medium leading-relaxed">Secure your access to Sri Lanka\'s premier EV ecosystem.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {fbError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold animate-pulse flex items-center gap-3">
            <span className="text-lg">⚠</span> {fbError}
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Institutional Email</label>
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-40 group-focus-within:opacity-100 transition-opacity">📧</div>
            <input
              type="email"
              placeholder="name@example.com"
              className={`w-full py-5 px-6 pl-14 bg-white/5 border-2 rounded-[24px] text-white text-[15px] font-bold outline-none transition-all duration-300
                ${emailStatus === 'err' ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/10 focus:border-[#00D4AA] focus:bg-[#00D4AA]/5 focus:shadow-[0_0_20px_rgba(0,212,170,0.15)]'}
              `}
              value={email}
              onChange={(e) => checkEmail(e.target.value)}
            />
          </div>
          {emailStatus === 'err' && <p className="ml-4 text-[11px] font-bold text-rose-400">Invalid account format</p>}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Security Password</label>
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-40 group-focus-within:opacity-100 transition-opacity">🔒</div>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Minimum 8 characters"
              className={`w-full py-5 px-6 pl-14 pr-14 bg-white/5 border-2 rounded-[24px] text-white text-[15px] font-bold outline-none transition-all duration-300
                ${passStatus === 'err' ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/10 focus:border-[#00D4AA] focus:bg-[#00D4AA]/5 focus:shadow-[0_0_20px_rgba(0,212,170,0.15)]'}
              `}
              value={password}
              onChange={(e) => checkStrength(e.target.value)}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity p-2">
              {showPass ? '🙈' : '👁'}
            </button>
          </div>
          
          {password && (
            <div className="px-4 mt-3">
              <div className="flex gap-1.5 h-1.5 mb-2">
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
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-[24px] text-[15px] font-black uppercase tracking-[3px] transition-all bg-gradient-to-br from-[#00D4AA] to-[#4FFFB0] text-[#050F1C] hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-[#00D4AA]/20 flex items-center justify-center gap-3 relative overflow-hidden group
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            {loading ? (
              <div className="w-5 h-5 border-3 border-[#050F1C]/30 border-t-[#050F1C] rounded-full animate-spin"></div>
            ) : (
              <>Initiate Profile Setup <span className="text-xl group-hover:translate-x-2 transition-transform">→</span></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;
