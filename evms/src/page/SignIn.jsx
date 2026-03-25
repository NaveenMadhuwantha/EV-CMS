import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle, loginWithMicrosoft, resetPassword } from '../services/authService';
import { getUserProfile } from '../firestore/authDb';

const ROLES = {
  owner:    { label: 'EV Owner', icon: '🚗', sub: 'Book & charge',    ac: '#00D4AA', rgb: '0,212,170',   dark: '#00A882', bar: 'linear-gradient(90deg,#00D4AA,#4FFFB0)', hint: 'owner@ev.lk' },
  provider: { label: 'Provider', icon: '⚡', sub: 'Manage stations',  ac: '#60A5FA', rgb: '59,130,246',  dark: '#2563EB', bar: 'linear-gradient(90deg,#3B82F6,#60A5FA)', hint: 'provider@ev.lk' },
  admin:    { label: 'Admin',    icon: '🛡', sub: 'Full control',     ac: '#A78BFA', rgb: '167,139,250', dark: '#7C3AED', bar: 'linear-gradient(90deg,#7C3AED,#A78BFA)', hint: 'admin@ev.lk' },
};

const STATS = [
  { icon: '⚡', val: '142', lbl: 'EV Owners',     col: '#00D4AA', bg: '0,212,170' },
  { icon: '🔋', val: '23',  lbl: 'Live Sessions', col: '#60A5FA', bg: '59,130,246' },
  { icon: '🗺', val: '6',   lbl: 'Stations',      col: '#FBBF24', bg: '251,191,36' },
  { icon: '📊', val: '184', lbl: 'Bookings',      col: '#A78BFA', bg: '167,139,250' },
];

const Toast = ({ msg, color, show }) => !show ? null : (
  <div className="animate-[toast-in_0.35s_cubic-bezier(0.34,1.56,0.64,1)_both] fixed bottom-7 left-1/2 z-50 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap"
       style={{ background: 'rgba(9,24,37,.96)', border: `1px solid ${color}40`, color, backdropFilter: 'blur(12px)' }}>
    {msg}
  </div>
);

const ForgotModal = ({ prefill, onClose, onSend }) => {
  const [em, setEm] = useState(prefill || '');
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4"
         style={{ background: 'rgba(0,0,0,.78)', backdropFilter: 'blur(6px)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="animate-[fadeUp_0.4s_ease_both] w-full max-w-md rounded-2xl p-8"
           style={{ background: 'linear-gradient(135deg,#0D2137,#091825)', border: '1px solid rgba(0,212,170,.3)', boxShadow: '0 40px 80px rgba(0,0,0,.6)' }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="font-syne text-xl font-extrabold text-white">Reset Password</div>
            <div className="text-xs mt-1" style={{ color: '#4E7A96' }}>We'll send a reset link to your email</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg text-sm flex items-center justify-center hover:bg-white/10 transition-all font-bold"
                  style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', color: '#8AAFC8' }}>✕</button>
        </div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#4E7A96' }}>Email Address</label>
        <div className="relative mb-5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">📧</span>
          <input type="email" value={em} onChange={e => setEm(e.target.value)} placeholder="your@email.com"
                 className="w-full py-3 pr-3 pl-10 bg-white/5 border-[1.5px] border-white/10 rounded-xl text-[#EFF6FF] text-sm font-dm outline-none focus:border-[#00D4AA] focus:bg-[#00D4AA]/5 transition-all focus:shadow-[0_0_0_3px_rgba(0,212,170,0.12)]"/>
        </div>
        <button onClick={() => onSend(em)} className="w-full py-3 rounded-xl font-bold text-[15px] transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg,#00D4AA,#00A882)', color: '#050F1C', fontFamily: 'Syne,sans-serif', boxShadow: '0 6px 24px rgba(0,212,170,.35)' }}>
          Send Reset Link →
        </button>
      </div>
    </div>
  );
};

export default function SignIn() {
  const navigate = useNavigate();
  const [role, setRole] = useState('owner');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemem] = useState(false);
  const [loading, setLoad] = useState(false);
  const [errors, setErrs] = useState({});
  const [alert, setAlert] = useState('');
  const [shaking, setShake] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [toast, setToast] = useState({ msg: '', color: '', show: false });

  const cfg = ROLES[role];

  const showToast = (msg, color) => {
    setToast({ msg, color, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  useEffect(() => {
    const timeOutUrlOptions = [
      setTimeout(() => showToast(`💡 Tip: Check out the new Provider Dashboard!`, '#8AAFC8'), 1000)
    ];
    return () => timeOutUrlOptions.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Enter') handleLogin();
      if (e.key === 'Escape') setForgot(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [email, pass, role]);

  const handleLogin = async () => {
    const errs = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email required';
    if (!pass) errs.pass = 'Password required';
    if (Object.keys(errs).length) { setErrs(errs); triggerShake(); return; }

    setLoad(true); setAlert(''); setErrs({});
    try {
      // 1. Authenticate with Firebase Auth
      const user = await loginWithEmail(email, pass);
      
      // 2. Fetch User Profile from Firestore
      const dbProfile = await getUserProfile(user.uid, role);
      if (!dbProfile && role !== 'admin') {
        throw new Error("firestore/missing-profile");
      }

      showToast(`✅ Welcome Back! Authenticated as ${cfg.label}`, cfg.ac);
      setTimeout(() => { 
        navigate('/'); // Update based on real backend routing later
      }, 1000);
    } catch (error) {
      setLoad(false);
      // Map Firebase Errors to friendly messages
      let msg = 'Invalid email or password.';
      if (error.code === 'auth/user-not-found') msg = 'No account found with this email.';
      if (error.code === 'auth/wrong-password') msg = 'Incorrect password. Try again.';
      if (error.code === 'auth/too-many-requests') msg = 'Too many attempts. Try again later.';
      if (error.code === 'auth/invalid-credential') msg = 'Invalid credentials provided.';
      if (error.message === 'firestore/missing-profile') msg = 'Profile not found in database for this role.';
      
      setAlert(msg);
      triggerShake();
    }
  };

  const handleGoogleLogin = async () => {
    setAlert('');
    try {
      showToast(`🔄 Connecting to Google…`, '#8AAFC8');
      
      // 1. Authenticate with Firebase Auth
      const user = await loginWithGoogle();
      
      // 2. Connect to Firestore to check profile
      const dbProfile = await getUserProfile(user.uid, role);
      
      showToast(`✅ Google Sign-In Successful!`, cfg.ac);
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      let msg = 'Failed to sign in with Google.';
      if (error.code === 'auth/popup-closed-by-user') msg = 'Google sign-in was cancelled.';
      setAlert(msg);
      triggerShake();
    }
  };

  const handleMicrosoftLogin = async () => {
    setAlert('');
    try {
      showToast(`🔄 Connecting to Microsoft…`, '#8AAFC8');
      
      // 1. Authenticate with Firebase Auth
      const user = await loginWithMicrosoft();
      
      // 2. Connect to Firestore to check profile
      const dbProfile = await getUserProfile(user.uid, role);
      
      showToast(`✅ Microsoft Sign-In Successful!`, cfg.ac);
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      let msg = 'Failed to sign in with Microsoft.';
      if (error.code === 'auth/popup-closed-by-user') msg = 'Microsoft sign-in was cancelled.';
      setAlert(msg);
      triggerShake();
    }
  };

  const handlePasswordReset = async (em) => {
    if (em && /\S+@\S+\.\S+/.test(em)) {
      try {
        await resetPassword(em);
        setForgot(false);
        showToast(`📧 Reset link sent to ${em}`, '#00D4AA');
      } catch (error) {
        let msg = 'Failed to send reset link.';
        if (error.code === 'auth/user-not-found') msg = 'No account found with this email.';
        alert(msg);
      }
    }
  };

  const emailOk = email && /\S+@\S+\.\S+/.test(email);

  return (
    <div className="flex min-h-screen bg-[#050F1C] font-dm text-[#EFF6FF] overflow-hidden">
      
      {/* ─── LEFT PANEL ─── */}
      <div className="hidden lg:flex w-[460px] shrink-0 relative flex-col overflow-hidden bg-[#060D1A]">
        <img src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&q=80"
             className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Background" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(5,15,28,.97),rgba(8,18,34,.88) 55%,rgba(0,30,40,.7))' }} />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,212,170,.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        
        {/* Glow orbs */}
        <div className="absolute rounded-full pointer-events-none w-[360px] h-[360px] -bottom-[60px] -right-[80px]" style={{ background: 'radial-gradient(circle,rgba(0,212,170,.13) 0%,transparent 70%)' }} />
        <div className="absolute rounded-full pointer-events-none w-[200px] h-[200px] top-[80px] -left-[40px]" style={{ background: 'radial-gradient(circle,rgba(59,130,246,.1) 0%,transparent 70%)' }} />

        <div className="relative flex flex-col h-full p-10 justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/login')}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl relative overflow-hidden"
                 style={{ background: 'linear-gradient(135deg,#00D4AA,#4FFFB0)', boxShadow: '0 0 26px rgba(0,212,170,.38)' }}>
              ⚡
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,transparent 40%,rgba(255,255,255,.2))' }} />
            </div>
            <div>
              <div className="font-syne text-xl font-extrabold text-white">VoltWay</div>
              <div className="text-[10px] uppercase tracking-widest text-[#4E7A96]">Charge Management</div>
            </div>
          </div>

          <div className="mt-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-[11px] font-semibold tracking-widest uppercase"
                 style={{ background: 'rgba(0,212,170,.1)', border: '1px solid rgba(0,212,170,.25)', color: '#00D4AA' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ background: '#00D4AA' }} />
              Platform Online · 6 Stations Active
            </div>
            <h1 className="font-syne text-[42px] font-extrabold text-white mb-4 leading-none tracking-tight">
              Welcome<br />Back to<br /><span style={{ color: '#00D4AA' }}>VoltWay</span>
            </h1>
            <p className="text-[15px] leading-relaxed mb-8 text-[#8AAFC8]">
              Sign in to manage charging stations, book sessions, and monitor your EV network across Sri Lanka.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {STATS.map(s => (
                <div key={s.lbl} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                       style={{ background: `rgba(${s.bg},.15)` }}>{s.icon}</div>
                  <div>
                    <div className="font-syne text-xl font-bold leading-none" style={{ color: s.col }}>{s.val}</div>
                    <div className="text-[10px] uppercase tracking-wider mt-1 text-[#4E7A96]">{s.lbl}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-5 border" style={{ background: 'rgba(0,212,170,.07)', borderColor: 'rgba(0,212,170,.2)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 text-[#050F1C]"
                     style={{ background: 'linear-gradient(135deg,#00D4AA,#4FFFB0)' }}>LK</div>
                <div>
                  <div className="text-sm font-semibold text-white">Lanka EV Co.</div>
                  <div className="text-[11px] text-[#4E7A96]">Charging Station Provider</div>
                </div>
                <div className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full text-[#00D4AA]"
                     style={{ background: 'rgba(0,212,170,.15)', border: '1px solid rgba(0,212,170,.3)' }}>VERIFIED</div>
              </div>
              <p className="text-[13px] leading-relaxed text-[#8AAFC8]">
                "VoltWay transformed how we manage our stations. Bookings up 40% in the first month."
              </p>
            </div>
          </div>

          <div className="text-[11px] mt-8 text-[#2D4A5C]">
            © 2026 VoltWay · <a href="#" className="text-[#00D4AA] hover:underline">Privacy</a> · <a href="#" className="text-[#00D4AA] hover:underline">Terms</a>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto w-full">
        <div className="w-full max-w-[440px] animate-[fadeUp_0.4s_ease_both]">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-[0_0_20px_rgba(0,212,170,0.35)]"
                 style={{ background: 'linear-gradient(135deg,#00D4AA,#4FFFB0)' }}>⚡</div>
            <div className="font-syne text-xl font-extrabold text-white">VoltWay</div>
          </div>

          <div className="mb-8">
            <div className="text-[11px] font-semibold uppercase tracking-widest mb-2 text-[#4E7A96]">Welcome Back</div>
            <h2 className="font-syne text-3xl font-extrabold text-white mb-1.5 tracking-tight">Sign In</h2>
            <p className="text-sm text-[#4E7A96]">Select your role and enter your credentials.</p>
          </div>

          {/* Role pills */}
          <div className="mb-6">
            <div className="text-[11px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-[#4E7A96]">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cfg.ac }} />
              Sign in as
            </div>
            <div className="flex gap-2">
              {Object.entries(ROLES).map(([key, r]) => (
                <button key={key}
                        onClick={() => { setRole(key); setAlert(''); setErrs({}); }}
                        className="flex-1 flex items-center gap-2 p-2.5 rounded-xl transition-all text-left"
                        style={{
                          border: `1.5px solid ${role === key ? r.ac : 'rgba(255,255,255,.09)'}`,
                          background: role === key ? `rgba(${r.rgb},.12)` : 'rgba(255,255,255,.03)',
                          boxShadow: role === key ? `0 0 18px rgba(${r.rgb},.2)` : 'none'
                        }}>
                  <span className="text-lg">{r.icon}</span>
                  <div>
                    <div className="text-[13px] font-semibold text-white">{r.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Accent bar */}
          <div className="h-0.5 rounded-full mb-7 transition-all duration-300"
               style={{ background: cfg.bar, boxShadow: `0 0 8px rgba(${cfg.rgb},.5)` }} />

          {/* Form */}
          <div className={`${shaking ? 'animate-[shake_0.35s_ease]' : ''}`}>
            
            {alert && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5 text-sm bg-rose-400/10 border border-rose-400/30 text-rose-300">
                <span className="text-lg shrink-0">⚠</span> {alert}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[#4E7A96]">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">📧</span>
                <input type="email" value={email} placeholder={cfg.hint}
                       onChange={e => { setEmail(e.target.value); setErrs(v => ({ ...v, email: '' })); }}
                       className={`w-full py-3 pr-3 pl-10 bg-white/5 border-[1.5px] rounded-xl text-[#EFF6FF] text-sm font-dm outline-none transition-all
                         ${errors.email ? 'border-rose-400/50 bg-rose-400/5' : emailOk ? 'border-[#34D399]/40' : 'border-white/10'}
                       `}
                       style={!errors.email ? { ':focus': { borderColor: cfg.ac, backgroundColor: `rgba(${cfg.rgb}, 0.05)`, boxShadow: `0 0 0 3px rgba(${cfg.rgb}, 0.12)` } } : {}}
                       onFocus={(e) => { e.target.style.borderColor = cfg.ac; e.target.style.boxShadow = `0 0 0 3px rgba(${cfg.rgb}, 0.12)`; }}
                       onBlur={(e) => { e.target.style.borderColor = emailOk ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              {errors.email && <div className="text-[11px] mt-1.5 text-rose-400">⚠ {errors.email}</div>}
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#4E7A96]">
                  Password <span className="text-rose-400">*</span>
                </label>
                <button onClick={() => setForgot(true)} className="text-[12px] font-semibold hover:opacity-75 transition-opacity"
                        style={{ color: cfg.ac }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">🔒</span>
                <input type={showPw ? 'text' : 'password'} value={pass} placeholder="Enter your password"
                       onChange={e => { setPass(e.target.value); setErrs(v => ({ ...v, pass: '' })); }}
                       className={`w-full py-3 pr-10 pl-10 bg-white/5 border-[1.5px] rounded-xl text-[#EFF6FF] text-sm font-dm outline-none transition-all
                         ${errors.pass ? 'border-rose-400/50 bg-rose-400/5' : pass ? 'border-[#34D399]/40' : 'border-white/10'}
                       `}
                       onFocus={(e) => { e.target.style.borderColor = cfg.ac; e.target.style.boxShadow = `0 0 0 3px rgba(${cfg.rgb}, 0.12)`; }}
                       onBlur={(e) => { e.target.style.borderColor = pass ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
                <button onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-base hover:opacity-75 transition-opacity text-[#4E7A96]">
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
              {errors.pass && <div className="text-[11px] mt-1.5 text-rose-400">⚠ {errors.pass}</div>}
            </div>

            <div className="flex items-center gap-3 mb-7">
              <div onClick={() => setRemem(!remember)} className="cursor-pointer w-5 h-5 rounded-md flex items-center justify-center transition-all bg-white/5 border-[1.5px] border-white/20"
                   style={remember ? { background: cfg.ac, borderColor: cfg.ac, boxShadow: `0 0 10px rgba(${cfg.rgb},.4)` } : {}}>
                {remember && <span className="text-[#050F1C] text-[11px] font-bold mt-[1px]">✓</span>}
              </div>
              <span className="text-sm cursor-pointer text-[#8AAFC8]" onClick={() => setRemem(!remember)}>
                Keep me signed in
              </span>
            </div>

            <button onClick={handleLogin} disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-base transition-all mb-6 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                    style={{ background: `linear-gradient(135deg,${cfg.ac},${cfg.dark})`, color: '#050F1C', fontFamily: 'Syne,sans-serif', boxShadow: `0 6px 24px rgba(${cfg.rgb},.35)` }}>
              {loading
                ? <div className="flex items-center justify-center h-6"><div className="w-5 h-5 border-2 border-[#050F1C]/30 border-t-[#050F1C] rounded-full animate-spin" /></div>
                : 'Sign In →'}
            </button>

            <div className="flex items-center gap-3 mb-5 text-xs text-[#334155]">
              <div className="flex-1 h-px bg-white/10" /> or sign in with <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <button type="button" onClick={handleGoogleLogin}
                      className="flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-semibold transition-all bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/25">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg> Google
              </button>
              <button type="button" onClick={handleMicrosoftLogin}
                      className="flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-semibold transition-all bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/25">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#00A4EF" d="M13 1h10v10H13z"/>
                  <path fill="#7FBA00" d="M1 13h10v10H1z"/><path fill="#FFB900" d="M13 13h10v10H13z"/>
                </svg> Microsoft
              </button>
            </div>
          </div>

          <div className="pt-6 text-center border-t border-white/10">
            <div className="text-sm mb-4 text-[#4E7A96]">Don't have an account?</div>
            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={() => navigate('/register')}
                 className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:-translate-y-0.5 text-[#00D4AA] bg-[#00D4AA]/10 border border-[#00D4AA]/30">
                🚗 Register as EV Owner
              </button>
              <button onClick={() => navigate('/provider/register')}
                 className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:-translate-y-0.5 text-[#60A5FA] bg-[#60A5FA]/10 border border-[#60A5FA]/30">
                ⚡ Register as Provider
              </button>
            </div>
          </div>

        </div>
      </div>

      {forgot && <ForgotModal prefill={email} onClose={() => setForgot(false)} onSend={handlePasswordReset} />}
      <Toast {...toast} />

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes shake { 0%,100% { transform: translateX(0) } 25%,75% { transform: translateX(-5px) } 50% { transform: translateX(5px) } }
        @keyframes toast-in { from { transform: translateX(-50%) translateY(60px); opacity: 0 } to { transform: translateX(-50%) translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}
