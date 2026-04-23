import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle } from '../../../firebase/auth';
import { getUserProfile } from '../../../firestore/authDb';
import { Car, Zap, Shield, Mail, Lock, Eye, EyeOff, ArrowRight, KeyRound, AlertCircle, Info, Activity, Fingerprint, Book } from 'lucide-react';
import DocumentationModal from '../../../shared/components/DocumentationModal';

const ROLES = {
  owner: { label: 'EV Owner', icon: Car, ac: '#00D4AA', hint: 'owner@ev.lk' },
  provider: { label: 'Provider', icon: Zap, ac: '#3B82F6', hint: 'provider@ev.lk' },
  admin: { label: 'Admin', icon: Shield, ac: '#A78BFA', hint: 'admin@ev.lk' },
};

const STATS = [
  { icon: Activity, val: '14.2k', lbl: 'Active Users', col: '#00D4AA' },
  { icon: Zap, val: '450+', lbl: 'Stations', col: '#3B82F6' },
];

const ForgotModal = ({ prefill, onClose, onSend }) => {
  const [em, setEm] = useState(prefill || '');
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 backdrop-blur-md bg-black/60 animate-fade-in" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-3xl p-12 bg-[#0a1628] border border-white/10 animate-fade-up shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[#00D4AA]/10 flex items-center justify-center text-3xl mx-auto mb-6 text-[#00D4AA] shadow-inner">
            <KeyRound className="w-8 h-8" />
          </div>
          <h2 className="font-manrope text-2xl font-extrabold text-white tracking-tight">Forgot Password?</h2>
          <p className="text-sm text-[#8AAFC8] font-medium mt-2 opacity-60 font-inter">Enter your registered email address.</p>
        </div>

        <div className="space-y-4 mb-10 font-inter">
          <label className="block text-[10px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#4E7A96] group-focus-within:text-[#00D4AA] transition-colors" />
            <input type="email" value={em} onChange={e => setEm(e.target.value)} placeholder="Enter your email"
              className="w-full py-4.5 px-6 pl-14 bg-white/5 border border-white/10 rounded-2xl text-white font-medium outline-none focus:border-[#00D4AA] transition-all" />
          </div>
        </div>

        <div className="flex flex-col gap-4 font-manrope">
          <button onClick={() => onSend(em)} className="w-full py-4.5 rounded-2xl font-bold uppercase tracking-widest bg-[#00D4AA] text-[#050F1C] shadow-lg hover:brightness-110 active:scale-95 transition-all outline-none text-[13px]">Send Reset Link</button>
          <button onClick={onClose} className="w-full py-3 text-[11px] font-bold uppercase tracking-widest text-[#4E7A96] hover:text-white transition-colors">Cancel</button>
        </div>
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
  const [loading, setLoad] = useState(false);
  const [alert, setAlert] = useState('');
  const [forgot, setForgot] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  const cfg = ROLES[role];

  const handleLogin = async () => {
    if (!email || !pass) { setAlert('Please provide all credentials.'); return; }
    setLoad(true); setAlert('');
    try {
      const user = await loginWithEmail(email, pass);
      const dbProfile = await getUserProfile(user.uid, role);
      if (!dbProfile && role !== 'admin') throw new Error("firestore/missing-profile");

      localStorage.setItem('user_role', role);
      navigate(`/${role}/dashboard`);
    } catch (error) {
      setLoad(false);
      setAlert(error.code?.includes('password') ? 'Incorrect password.' : 'Login failed. Please try again.');
    }
  };

  const handleSocialLogin = async (type) => {
    setAlert('');
    try {
      const user = type === 'google' ? await loginWithGoogle() : await loginWithMicrosoft();
      localStorage.setItem('user_role', role);
      navigate(`/${role}/dashboard`);
    } catch (error) {
      setAlert(`${type} login failed.`);
    }
  };

  const handlePasswordReset = async (em) => {
    if (em) {
      try {
        await resetPassword(em);
        setForgot(false);
        setAlert('Password reset email sent.');
      } catch (err) { setAlert('Failed to send reset email.'); }
    }
  };

  return (
    <>
      {/* Documentation Modal */}
      <DocumentationModal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} />

      <div className="flex min-h-screen bg-[#050F1C] font-inter text-[#EFF6FF] overflow-x-hidden relative selection:bg-[#00D4AA]/30">
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#00D4AA]/5 blur-[150px] pointer-events-none"></div>

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-[460px] flex-col overflow-hidden bg-[#0a1628] shrink-0 border-r border-white/10 z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050F1C] via-[#050F1C]/80 to-transparent"></div>
        <div className="relative flex flex-col h-full p-16 justify-between animate-fade-in">

          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl relative bg-gradient-to-br from-[#00D4AA] to-[#4FFFB0] shadow-xl group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-6 h-6 text-white fill-white/20" />
            </div>
            <div>
              <div className="font-manrope text-2xl font-extrabold text-white tracking-tight uppercase">VoltWay</div>
              <div className="text-[10px] text-[#4E7A96] font-bold uppercase tracking-widest leading-tight opacity-70 mt-1">EV Management System</div>
            </div>
          </div>

          <div className="space-y-10">
            <h1 className="font-manrope text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight uppercase animate-fade-up">
              Welcome <br /> <span className="text-[#00D4AA]">Back</span> <br /> Portal.
            </h1>

            <p className="text-lg text-[#8AAFC8] font-medium leading-relaxed opacity-80 animate-fade-up delay-100 border-l-2 border-white/10 pl-6">
              Please log in to your account to manage your charging experience and monitor charging stations.
            </p>

            <button 
              onClick={() => setIsDocModalOpen(true)}
              className="group flex items-center gap-6 p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#00D4AA]/40 transition-all hover:bg-[#00D4AA]/5 w-full text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#00D4AA] group-hover:scale-110 transition-transform">
                <Book className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#4E7A96] mb-1">Architecture</div>
                <div className="text-lg font-extrabold text-white uppercase tracking-tight">System Manual</div>
              </div>
            </button>

            <div className="grid grid-cols-1 gap-4 animate-fade-up delay-200">
              {STATS.map(s => (
                <div key={s.lbl} className="bg-white/[0.03] p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5" style={{ color: s.col }}>
                    <s.icon className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#4E7A96] mb-1">{s.lbl}</div>
                    <div className="text-2xl font-manrope font-extrabold text-white">{s.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5 animate-fade-up delay-300 font-inter">
            <div className="flex items-center gap-3 text-[10px] font-bold text-[#00D4AA] uppercase tracking-widest bg-[#00D4AA]/5 px-4 py-2 rounded-full w-fit border border-[#00D4AA]/10">
              <Fingerprint className="w-4 h-4" />
              Secure Login Active
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-[#4E7A96] uppercase tracking-widest px-2 opacity-40">
              <span>© 2026 VoltWay</span>
              <span>Sri Lanka</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center pt-16 pb-24 px-6 lg:pl-[500px] lg:pr-12 lg:pt-28 min-h-screen relative z-10 w-full overflow-y-auto">
        <div className="w-full max-w-[440px] animate-fade-up">

          <div className="flex lg:hidden items-center gap-4 mb-20 justify-center group" onClick={() => navigate('/')}>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00D4AA] to-blue-600 flex items-center justify-center text-2xl shadow-2xl group-hover:scale-105 transition-transform">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="font-manrope text-3xl font-extrabold text-white uppercase tracking-tight leading-none">VoltWay</div>
              <div className="text-[10px] text-[#4E7A96] font-bold uppercase tracking-widest leading-tight opacity-70 mt-2">EV Management System</div>
            </div>
          </div>

          <div className="mb-12 text-center lg:text-left">
            <div className="text-[11px] font-bold uppercase tracking-widest mb-4 text-[#4E7A96] opacity-80 flex items-center gap-3 justify-center lg:justify-start">
              <Shield className="w-4.5 h-4.5 text-[#00D4AA]" />
              Authentication
            </div>
            <h2 className="font-manrope text-5xl lg:text-6xl font-extrabold text-white leading-tight uppercase tracking-tight">Sign In</h2>
          </div>

          {/* Role Network */}
          <div className="mb-10 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96] opacity-60 flex items-center gap-2">
              <Info className="w-4 h-4" /> Select Your Role
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(ROLES).map(([key, r]) => (
                <button
                  key={key}
                  disabled={loading}
                  onClick={() => { setRole(key); setAlert(''); }}
                  className={`flex flex-col items-center justify-center gap-4 py-8 rounded-3xl border-2 transition-all duration-300 group
                    ${role === key ? 'border-current bg-current/[0.08] shadow-lg' : 'border-white/5 bg-white/[0.03] hover:border-white/10'}
                  `}
                  style={{ color: role === key ? r.ac : '#4E7A96' }}
                >
                  <r.icon className={`w-8 h-8 ${role === key ? 'scale-110' : 'opacity-40 group-hover:opacity-100'} transition-all`} strokeWidth={role === key ? 2.5 : 2} />
                  <span className="text-[11px] font-bold uppercase tracking-wider font-manrope">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Auth Interface */}
          <div className="space-y-6">
            {alert && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] font-bold uppercase tracking-wider flex items-center gap-4 animate-shake shadow-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {alert}
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-[10px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-7 top-1/2 -translate-y-1/2 w-4.5 h-4.5 opacity-30 group-focus-within:opacity-100 transition-opacity" />
                <input
                  type="email" value={email} placeholder={cfg.hint}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full py-4.5 px-6 pl-14 bg-white/5 border border-white/10 rounded-2xl text-white font-medium outline-none focus:border-current transition-all font-inter"
                  style={{ color: cfg.ac }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between px-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#4E7A96]">Password</label>
                <button onClick={() => setForgot(true)} className="text-[10px] font-bold uppercase tracking-widest text-[#4E7A96] hover:text-[#00D4AA] transition-colors outline-none cursor-pointer">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-7 top-1/2 -translate-y-1/2 w-4.5 h-4.5 opacity-30 group-focus-within:opacity-100 transition-opacity" />
                <input
                  type={showPw ? 'text' : 'password'} value={pass} placeholder="••••••••"
                  onChange={e => setPass(e.target.value)}
                  className="w-full py-4.5 px-6 pl-14 pr-16 bg-white/5 border border-white/10 rounded-2xl text-white font-medium outline-none focus:border-current transition-all font-inter"
                  style={{ color: cfg.ac }}
                />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-7 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity p-2 outline-none cursor-pointer">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin} disabled={loading}
              className="w-full py-5 rounded-2xl font-bold uppercase tracking-widest transition-all bg-[#0a1628] border border-white/10 text-white hover:bg-white/5 hover:border-white/20 flex items-center justify-center gap-4 shadow-xl disabled:opacity-50 active:scale-95 outline-none group font-manrope text-[13px]"
              style={{ borderColor: cfg.ac + '30' }}
            >
              {loading ? <div className="w-6 h-6 border-4 border-white/10 border-t-white rounded-full animate-spin"></div> : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" style={{ color: cfg.ac }} />
                </>
              )}
            </button>

            {/* Social Bridges */}
            <div className="relative py-8 flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-white/5"></div>
              <span className="relative z-10 px-8 bg-[#050F1C] text-[11px] font-bold uppercase tracking-widest text-[#4E7A96] opacity-40">Or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-4 py-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all outline-none active:scale-95 group">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.904 3.192-2.312 4.152-1.392.944-3.112 1.544-5.528 1.544-4.52 0-8.24-3.528-8.24-7.896s3.72-7.896 8.24-7.896c2.44 0 4.272.928 5.608 2.152l2.312-2.312C18.424 2.104 15.696 1 12.48 1 6.576 1 1.744 5.768 1.744 11.5s4.832 10.5 10.736 10.5c3.2 0 5.608-1.008 7.504-2.888 1.952-1.848 2.56-4.488 2.56-6.792 0-.664-.048-1.288-.144-1.896h-9.856z" /></svg>
                <span className="text-[12px] font-bold text-[#8AAFC8]">Google</span>
              </button>
              <button onClick={() => handleSocialLogin('microsoft')} className="flex items-center justify-center gap-4 py-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all outline-none active:scale-95 group">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" /></svg>
                <span className="text-[12px] font-bold text-[#8AAFC8]">Microsoft</span>
              </button>
            </div>
          </div>

          <div className="mt-20 pt-10 border-t border-white/5 text-center">
            <p className="text-[11px] font-bold text-[#3a5a7a] uppercase tracking-widest mb-8 opacity-60">Don't have an account?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => navigate('/register')} className="w-full py-4.5 rounded-2xl bg-white/5 border border-white/10 text-[#00D4AA] text-[11px] font-bold uppercase tracking-wider hover:border-[#00D4AA]/30 transition-all shadow-lg font-manrope">Join Owner</button>
              <button onClick={() => navigate('/provider/register')} className="w-full py-4.5 rounded-2xl bg-white/5 border border-white/10 text-blue-400 text-[11px] font-bold uppercase tracking-wider hover:border-blue-400/30 transition-all shadow-lg font-manrope">Join Provider</button>
            </div>
          </div>
        </div>
        </div>
      </div>
      {forgot && <ForgotModal prefill={email} onClose={() => setForgot(false)} onSend={handlePasswordReset} />}
    </>
  );
}
