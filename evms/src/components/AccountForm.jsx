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
        console.error("Firebase Auth Error:", error.code);
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
  const textColors = ['', 'text-rose-500', 'text-amber-500', 'text-sky-400', 'text-[#00D4AA]'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const inputBase = "w-full py-3 px-4 pl-12 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#00D4AA]/50 focus:bg-[#00D4AA]/5 focus:ring-4 focus:ring-[#00D4AA]/10 placeholder:text-gray-500";

  return (
    <div className="w-full animate-[fadeInUp_0.4s_ease_both]">
      <div className="mb-8">
        <div className="text-[11px] font-semibold uppercase tracking-widest mb-2 text-gray-500">Step 1 of 4</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-2 text-wrap">Create Your Account</h2>
        <p className="text-sm text-gray-400">Set up your login credentials to access the VoltWay platform.</p>
      </div>

      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest pb-3 mb-6 border-b border-white/5 text-gray-500 font-dm">
        <span className="text-[#00D4AA]">📧</span> Email & Password
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {fbError && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold animate-pulse">
            ⚠ {fbError}
          </div>
        )}

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-gray-500">Email Address *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">📧</span>
            <input
              type="email"
              placeholder="your@email.com"
              className={`${inputBase} ${emailStatus === 'err' ? 'border-rose-500/50 bg-rose-500/5' : emailStatus === 'ok' ? 'border-[#00D4AA]/40' : ''}`}
              value={email}
              autoComplete="email"
              onChange={(e) => checkEmail(e.target.value)}
            />
          </div>
          {emailStatus === 'err' && <p className="text-[11px] mt-1.5 text-rose-500">⚠ Please enter a valid email address</p>}
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-gray-500">Password *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">🔒</span>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Minimum 8 characters"
              className={`${inputBase} ${passStatus === 'err' ? 'border-rose-500/50 bg-rose-500/5' : passStatus === 'ok' ? 'border-[#00D4AA]/40' : ''}`}
              value={password}
              autoComplete="new-password"
              onChange={(e) => checkStrength(e.target.value)}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-500">
              {showPass ? '🙈' : '👁'}
            </button>
          </div>
          {password && (
            <div className="mt-2 text-dm">
              <div className="flex gap-1.5 h-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : 'bg-white/10'}`}></div>
                ))}
              </div>
              <p className={`text-[11px] mt-1 font-semibold ${textColors[strength]}`}>{labels[strength]} password</p>
            </div>
          )}
          {passStatus === 'err' && <p className="text-[11px] mt-1.5 text-rose-500">⚠ Minimum 8 characters required</p>}
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-gray-500">Confirm Password *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">🔒</span>
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter password"
              className={`${inputBase} ${matchStatus === 'err' ? 'border-rose-500/50 bg-rose-500/5' : matchStatus === 'ok' ? 'border-[#00D4AA]/40' : ''}`}
              value={confirm}
              autoComplete="new-password"
              onChange={(e) => checkMatch(e.target.value)}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-500">
              {showConfirm ? '🙈' : '👁'}
            </button>
          </div>
          {matchStatus === 'ok' && <p className="text-[11px] mt-1.5 text-[#00D4AA]">✓ Passwords match</p>}
          {matchStatus === 'err' && <p className="text-[11px] mt-1.5 text-rose-500">⚠ Passwords do not match</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl text-sm font-bold transition-all font-syne shadow-[0_6px_24px_rgba(0,212,170,0.3)] bg-gradient-to-br from-[#00D4AA] to-[#00A882] text-[#050F1C] hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(0,212,170,0.4)] active:translate-y-0 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#050F1C]/30 border-t-[#050F1C] rounded-full animate-spin"></div>
              Creating Account...
            </>
          ) : (
            'Continue to Personal Info →'
          )}
        </button>
      </form>

      <p className="text-center text-sm mt-8 text-gray-500">
        Already have an account? <a href="#" className="text-[#00D4AA] font-semibold hover:underline">Sign in</a>
      </p>
    </div>
  );
};


export default AccountForm;
