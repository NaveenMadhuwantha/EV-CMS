import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle, resetPassword } from '../../../firebase/auth';
import { getUserProfile } from '../../../firestore/authDb';
import { streamGlobalStats } from '../../../firestore/statsDb';
import { Car, Zap, Shield, Mail, Lock, Eye, EyeOff, ArrowRight, KeyRound, AlertCircle, Info, Activity, Fingerprint, Book } from 'lucide-react';
import DocumentationModal from '../../../shared/components/DocumentationModal';
import { useLanguage } from '../../../shared/context/LanguageContext';

const ROLES = (t) => ({
  owner: { label: t('evOwner'), icon: Car, ac: '#3B82F6', hint: 'owner@ev.lk' },
  provider: { label: t('provider'), icon: Zap, ac: '#10B981', hint: 'provider@ev.lk' },
  admin: { label: t('admin'), icon: Shield, ac: '#6366F1', hint: 'admin@ev.lk' },
});

const ForgotModal = ({ prefill, onClose, onSend, t }) => {
  const [em, setEm] = useState(prefill || '');
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 backdrop-blur-md bg-[#0F172A]/40 animate-fade-in" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-[40px] p-12 bg-white border border-[#E2E8F0] animate-fade-up shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px]"></div>
        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-3xl mx-auto mb-6 text-[#3B82F6] shadow-sm">
            <KeyRound className="w-8 h-8" />
          </div>
          <h2 className="font-manrope text-3xl font-black text-[#0F172A] tracking-tighter uppercase">{t('forgotPassword')}</h2>
          <p className="text-sm text-[#64748B] font-medium mt-3 font-inter">{t('enterRegisteredEmail')}</p>
        </div>

        <div className="space-y-4 mb-10 font-inter relative z-10">
          <label className="block text-[10px] font-black uppercase tracking-[3px] ml-2 text-[#64748B]">{t('emailAddress')}</label>
          <div className="relative group">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#64748B] group-focus-within:text-[#3B82F6] transition-colors" />
            <input type="email" value={em} onChange={e => setEm(e.target.value)} placeholder={t('enterEmail')}
              className="w-full py-5 px-6 pl-14 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-[#0F172A] font-bold outline-none focus:border-[#3B82F6] transition-all shadow-inner" />
          </div>
        </div>

        <div className="flex flex-col gap-4 font-manrope relative z-10">
          <button onClick={() => onSend(em)} className="w-full py-5 rounded-2xl font-black uppercase tracking-[2px] bg-[#3B82F6] text-white shadow-xl hover:brightness-110 active:scale-95 transition-all outline-none text-[13px]">{t('sendResetLink')}</button>
          <button onClick={onClose} className="w-full py-4 text-[11px] font-black uppercase tracking-[3px] text-[#64748B] hover:text-[#0F172A] transition-colors">{t('cancel')}</button>
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
  const [stats, setStats] = useState({ totalUsers: 0, totalStations: 0, uptime: '100%' });
  const { t } = useLanguage();

  useEffect(() => {
    const unsub = streamGlobalStats(setStats);
    return () => unsub();
  }, []);

  const rolesList = ROLES(t);
  const statsList = [
    { icon: Activity, val: stats?.totalUsers || 0, lbl: t('activeUsers'), col: '#10B981' },
    { icon: Zap, val: stats?.totalStations || 0, lbl: t('stationsCount'), col: '#3B82F6' },
  ];
  const cfg = rolesList[role] || rolesList['owner'];

  const handleLogin = async () => {
    if (!email || !pass) { setAlert(t('provideCredentials')); return; }
    setLoad(true); setAlert('');
    try {
      const user = await loginWithEmail(email, pass);
      const dbProfile = await getUserProfile(user.uid, role);
      if (!dbProfile && role !== 'admin') throw new Error("firestore/missing-profile");

      localStorage.setItem('user_role', role);
      navigate(`/${role}/dashboard`);
    } catch (error) {
      setLoad(false);
      setAlert(error.code?.includes('password') ? t('incorrectPassword') : t('loginFailed'));
    }
  };

  const handleSocialLogin = async (type) => {
    setAlert('');
    try {
      localStorage.setItem('user_role', role);
      const user = type === 'google' ? await loginWithGoogle() : null;
      if (!user) return;
      navigate(`/${role}/dashboard`);
    } catch (error) {
      setAlert(t('loginFailed'));
    }
  };

  const handlePasswordReset = async (em) => {
    if (em) {
      try {
        await resetPassword(em);
        setForgot(false);
        setAlert(t('passwordResetSent'));
      } catch (err) { setAlert(t('failedToResetPassword')); }
    }
  };

  const welcomeText = t('welcomeBackPortal') || "Welcome Back Portal.";
  const welcomeParts = welcomeText.split(' ');

  return (
    <>
      <DocumentationModal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} />

      <div className="flex min-h-screen bg-[#FDF8EE] font-inter text-[#0F172A] overflow-x-hidden relative selection:bg-[#3B82F6]/20">
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(#0F172A 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-0" style={{ backgroundImage: 'linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[#3B82F6]/5 blur-[120px] rounded-full pointer-events-none -mr-40 -mt-40"></div>
        <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none -ml-20 -mb-20"></div>


      <div className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-[650px] flex-col overflow-hidden bg-[#FDF8EE] shrink-0 border-r border-[#E2E8F0] z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white/80 to-transparent"></div>
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0F172A 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>

        <div className="relative flex flex-col h-full p-16 justify-between animate-fade-in">

          <div className="flex items-center gap-6 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-18 h-18 rounded-[24px] flex items-center justify-center text-4xl relative bg-gradient-to-br from-[#3B82F6] to-blue-600 shadow-xl group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-10 h-10 text-white fill-white/20" />
            </div>
            <div>
              <div className="font-manrope text-4xl font-black text-[#0F172A] tracking-tighter uppercase">VoltWay</div>
              <div className="text-[12px] text-[#64748B] font-black uppercase tracking-[4px] leading-tight mt-2.5">EV Management System</div>
            </div>
          </div>

          <div className="space-y-12">
            <h1 className="font-manrope text-6xl xl:text-7xl font-black text-[#0F172A] leading-[0.9] tracking-tighter uppercase animate-fade-up">
              {welcomeParts.slice(0, 2).join(' ')} <br /> 
              <span className="text-[#3B82F6] drop-shadow-md">{welcomeParts.slice(2, 3).join(' ')}</span> <br /> 
              {welcomeParts.slice(3).join(' ')}
            </h1>

            <p className="text-2xl text-[#64748B] font-medium leading-relaxed animate-fade-up delay-100 border-l-8 border-[#3B82F6]/20 pl-10">
              {t('manageExperienceDesc')}
            </p>

            <button 
              onClick={() => setIsDocModalOpen(true)}
              className="group flex items-center gap-8 p-8 rounded-[40px] bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3B82F6]/40 transition-all hover:bg-blue-50 w-full text-left shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#3B82F6] group-hover:scale-110 transition-transform shadow-inner">
                <Book className="w-7 h-7" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[3px] text-[#64748B] mb-1.5">{t('architecture')}</div>
                <div className="text-xl font-black text-[#0F172A] uppercase tracking-tighter">{t('systemManual')}</div>
              </div>
            </button>

            <div className="grid grid-cols-1 gap-6 animate-fade-up delay-200">
              {statsList.map((s, idx) => (
                <div key={idx} className="bg-white p-10 rounded-[48px] border border-[#E2E8F0] hover:border-[#3B82F6]/30 transition-all flex items-center gap-8 group/stat shadow-lg">
                  <div className="w-18 h-18 rounded-3xl flex items-center justify-center bg-[#FDF8EE] border border-[#E2E8F0] shadow-inner transition-transform group-hover/stat:scale-110" style={{ color: s.col }}>
                    <s.icon className="w-10 h-10" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-[12px] font-black uppercase tracking-[4px] text-[#64748B] mb-2">{s.lbl}</div>
                    <div className="text-4xl font-manrope font-black text-[#0F172A] tracking-tighter">{s.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 animate-fade-up delay-300 font-inter">
            <div className="flex items-center gap-3 text-[10px] font-black text-[#3B82F6] uppercase tracking-[3px] bg-blue-50 px-6 py-3 rounded-full w-fit border border-blue-100 shadow-sm">
              <Fingerprint className="w-5 h-5" />
              {t('secureLoginActive')}
            </div>
            <div className="flex justify-between items-center text-[10px] font-black text-[#64748B] uppercase tracking-[3px] px-2">
              <span>© 2026 VoltWay</span>
              <span>Sri Lanka</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center pt-10 pb-16 px-6 lg:ml-[650px] lg:pt-24 min-h-screen relative z-10 w-full overflow-y-auto justify-center">
        <div className="absolute top-[10%] right-[5%] w-96 h-96 border-4 border-[#E2E8F0] rounded-full opacity-10 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[15%] w-64 h-64 border-4 border-[#E2E8F0] rounded-full opacity-10 pointer-events-none animate-bounce" style={{ animationDuration: '4s' }}></div>
        
        <div className="w-full max-w-[650px] animate-fade-up py-12">


          <div className="flex lg:hidden items-center gap-6 mb-12 justify-center group" onClick={() => navigate('/')}>
            <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#3B82F6] to-blue-600 flex items-center justify-center text-2xl shadow-2xl group-hover:scale-105 transition-transform">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="font-manrope text-4xl font-black text-[#0F172A] uppercase tracking-tighter leading-none">VoltWay</div>
              <div className="text-[10px] text-[#94A3B8] font-black uppercase tracking-[3px] leading-tight mt-2.5">EV Management System</div>
            </div>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <div className="text-[11px] font-black uppercase tracking-[4px] mb-4 flex items-center gap-4 justify-center lg:justify-start">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-[#E2E8F0] shadow-sm transition-transform hover:scale-110 text-[#0F172A]">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-bold tracking-[4px] uppercase text-[#0F172A]">{t('authentication')}</span>
            </div>
            <h2 className="font-manrope text-6xl lg:text-7xl font-black text-[#0F172A] leading-[0.9] uppercase tracking-normal">
              {t('signIn').split('').map((char, i) => (
                <span key={i} className={`inline-block hover:text-current transition-colors duration-300 ${char === ' ' ? 'mx-3' : ''}`} style={{ color: i === 0 ? cfg.ac : 'inherit' }}>{char}</span>
              ))}
            </h2>
          </div>

          <div className="mb-10 space-y-4">
            <div className="text-[11px] font-black uppercase tracking-[4px] ml-2 flex items-center gap-2" style={{ color: '#0F172A' }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: cfg.ac }}></div>
              {t('selectYourRole')}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(rolesList).map(([key, r]) => (
                <button
                  key={key}
                  disabled={loading}
                  onClick={() => { setRole(key); setAlert(''); }}
                  className={`flex flex-col items-center justify-center gap-5 py-10 rounded-[40px] border-2 transition-all duration-500 group relative overflow-hidden
                    ${role === key ? 'border-current shadow-2xl scale-[1.02]' : 'border-[#E2E8F0] bg-white hover:border-[#E2E8F0]/80 hover:bg-[#F8FAFC] shadow-sm'}
                  `}
                  style={{ 
                    color: role === key ? r.ac : '#64748B',
                    backgroundColor: role === key ? `${r.ac}15` : 'white',
                    borderColor: role === key ? r.ac : '#E2E8F0'
                  }}
                >
                  {role === key && (
                    <div className="absolute inset-0 bg-gradient-to-br from-current/10 to-transparent pointer-events-none"></div>
                  )}
                  <r.icon className={`w-9 h-9 ${role === key ? 'scale-110' : 'opacity-40 group-hover:opacity-100'} transition-all`} strokeWidth={role === key ? 3 : 2} />
                  <span className="text-[12px] font-black uppercase tracking-[2px] font-manrope transition-colors" style={{ color: role === key ? r.ac : '#64748B' }}>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {alert && (
              <div className="p-5 rounded-3xl bg-red-50 border border-red-100 text-red-600 text-[12px] font-black uppercase tracking-[2px] flex items-center gap-5 animate-shake shadow-xl">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                {alert}
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[3px] ml-2 transition-colors" style={{ color: cfg.ac }}>{t('emailAddress')}</label>
              <div className="relative group">
                <Mail className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: cfg.ac }} />
                <input
                  type="email" value={email} placeholder={cfg.hint}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full py-5 px-6 pl-16 bg-white border border-[#E2E8F0] rounded-3xl text-[#0F172A] font-bold outline-none focus:border-current focus:ring-4 focus:ring-current/10 transition-all font-inter shadow-sm placeholder:text-[#64748B]/50"
                  style={{ color: cfg.ac }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between px-2">
                <label className="text-[10px] font-black uppercase tracking-[3px] transition-colors" style={{ color: cfg.ac }}>{t('password')}</label>
                <button onClick={() => setForgot(true)} className="text-[10px] font-black uppercase tracking-[3px] hover:opacity-80 transition-opacity outline-none cursor-pointer underline underline-offset-4" style={{ color: cfg.ac }}>{t('forgot')}</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: cfg.ac }} />
                <input
                  type={showPw ? 'text' : 'password'} value={pass} placeholder="••••••••"
                  onChange={e => setPass(e.target.value)}
                  className="w-full py-5 px-6 pl-16 pr-16 bg-white border border-[#E2E8F0] rounded-3xl text-[#0F172A] font-bold outline-none focus:border-current focus:ring-4 focus:ring-current/10 transition-all font-inter shadow-sm"
                  style={{ color: cfg.ac }}
                />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-7 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-current transition-colors p-2 outline-none cursor-pointer">
                  {showPw ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin} disabled={loading}
              className="w-full py-6 rounded-3xl font-black uppercase tracking-[3px] transition-all flex items-center justify-center gap-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] disabled:opacity-50 active:scale-95 outline-none group font-manrope text-[14px] text-white relative overflow-hidden"
              style={{ 
                backgroundColor: cfg.ac,
                boxShadow: `0 20px 40px ${cfg.ac}40`
              }}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {loading ? <div className="w-7 h-7 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : (
                <>
                  {t('signIn')}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>

            <div className="relative py-6 flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-[#E2E8F0]"></div>
              <span className="relative z-10 px-8 bg-[#FDF8EE] text-[11px] font-black uppercase tracking-[4px] text-[#64748B]">{t('orContinueWith')}</span>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <button onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-5 py-5 rounded-3xl bg-white border border-[#E2E8F0] hover:border-[#EA4335]/40 hover:bg-[#EA4335]/5 transition-all outline-none active:scale-95 group shadow-sm">
                <svg className="w-6 h-6 text-[#EA4335]" viewBox="0 0 24 24"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.904 3.192-2.312 4.152-1.392.944-3.112 1.544-5.528 1.544-4.52 0-8.24-3.528-8.24-7.896s3.72-7.896 8.24-7.896c2.44 0 4.272.928 5.608 2.152l2.312-2.312C18.424 2.104 15.696 1 12.48 1 6.576 1 1.744 5.768 1.744 11.5s4.832 10.5 10.736 10.5c3.2 0 5.608-1.008 7.504-2.888 1.952-1.848 2.56-4.488 2.56-6.792 0-.664-.048-1.288-.144-1.896h-9.856z" /></svg>
                <span className="text-[13px] font-black text-[#0F172A] uppercase tracking-tighter">Google</span>
              </button>
              <button onClick={() => handleSocialLogin('microsoft')} className="flex items-center justify-center gap-5 py-5 rounded-3xl bg-white border border-[#E2E8F0] hover:border-[#00A4EF]/40 hover:bg-[#00A4EF]/5 transition-all outline-none active:scale-95 group shadow-sm">
                <svg className="w-6 h-6 text-[#00A4EF]" viewBox="0 0 24 24"><path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" /></svg>
                <span className="text-[13px] font-black text-[#0F172A] uppercase tracking-tighter">Microsoft</span>
              </button>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-[#E2E8F0] text-center">
            <p className="text-[11px] font-black text-[#64748B] uppercase tracking-[4px] mb-8">{t('dontHaveAccount')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <button 
                onClick={() => navigate('/register')} 
                className="w-full py-8 rounded-[32px] bg-white border-2 border-[#E2E8F0] text-[#3B82F6] text-[14px] font-black uppercase tracking-[3px] hover:border-[#3B82F6] hover:bg-blue-50 transition-all shadow-xl font-manrope flex items-center justify-center gap-4 group"
              >
                <Car className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {t('joinOwner')}
              </button>
              <button 
                onClick={() => navigate('/provider/register')} 
                className="w-full py-8 rounded-[32px] bg-white border-2 border-[#E2E8F0] text-emerald-600 text-[14px] font-black uppercase tracking-[3px] hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-xl font-manrope flex items-center justify-center gap-4 group"
              >
                <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {t('joinProvider')}
              </button>
            </div>
          </div>
        </div>
      </div>

      </div>
      {forgot && <ForgotModal prefill={email} onClose={() => setForgot(false)} onSend={handlePasswordReset} t={t} />}
    </>
  );
}
