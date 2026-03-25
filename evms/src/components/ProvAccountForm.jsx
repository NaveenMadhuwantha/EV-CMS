import React, { useState } from 'react';
import { auth } from '../config/firebase';
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

  const validate = (name, val) => {
    let err = '';
    if (name === 'email') err = /\S+@\S+\.\S+/.test(val) ? '' : 'Invalid email';
    if (name === 'password') err = val.length >= 8 ? '' : 'Min 8 characters';
    if (name === 'confirm') err = val === formData.password ? '' : 'Passwords do not match';
    setErrors(prev => ({ ...prev, [name]: err }));
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
      email: /\S+@\S+\.\S+/.test(formData.email) ? '' : 'Invalid email',
      password: formData.password.length >= 8 ? '' : 'Min 8 characters',
      confirm: formData.confirm === formData.password ? '' : 'Passwords do not match'
    };
    setErrors(newErrors);

    if (!Object.values(newErrors).some(x => x)) {
      setLoading(true);
      try {
        const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        sessionStorage.setItem('prov_email', formData.email);
        sessionStorage.setItem('prov_uid', user.uid);
        navigate('/provider/register/step2');
        window.scrollTo(0, 0);
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
    <div className="w-full animate-fade-up">
      <div className="mb-8 p-6 rounded-[32px] glass-panel border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none"></div>
        <div className="text-[10px] font-black uppercase tracking-[4px] mb-3 text-blue-400 opacity-80">Phase 01 · Provider Auth</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-2 leading-none uppercase tracking-tight">Access Gate</h2>
        <p className="text-sm text-[#8AAFC8] font-medium leading-relaxed">Establish your credentials to manage the power grid.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-10">
        {fbError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold animate-pulse flex items-center gap-3">
            <span className="text-lg">⚠</span> {fbError}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Corporate Email</label>
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-40 group-focus-within:opacity-100 transition-opacity">🏢</div>
            <input
              id="email" type="email" placeholder="company@voltway.lk"
              className={`w-full py-5 px-6 pl-14 bg-white/5 border-2 rounded-[24px] text-white text-[15px] font-bold outline-none transition-all duration-300
                ${errors.email ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/10 focus:border-blue-500 focus:bg-blue-500/5 shadow-2xl focus:shadow-blue-500/20'}
              `}
              value={formData.email} onChange={handleChange}
            />
          </div>
          {errors.email && <p className="ml-4 text-[11px] font-bold text-rose-400">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Master Password</label>
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-40 group-focus-within:opacity-100 transition-opacity">🔒</div>
            <input
              id="password" type={showPass ? 'text' : 'password'} placeholder="Secure Passphrase"
              className={`w-full py-5 px-6 pl-14 pr-14 bg-white/5 border-2 rounded-[24px] text-white text-[15px] font-bold outline-none transition-all duration-300
                ${errors.password ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/10 focus:border-blue-500 focus:bg-blue-500/5 shadow-2xl focus:shadow-blue-500/20'}
              `}
              value={formData.password} onChange={handleChange}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity p-2 text-xl">
              {showPass ? '🙈' : '👁'}
            </button>
          </div>
          {formData.password && (
            <div className="px-4 mt-3">
              <div className="flex gap-1.5 h-1.5 mb-2">
                {[1, 2, 3, 4].map(i => <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${i <= strength ? levels[strength].c : 'bg-white/5'}`}></div>)}
              </div>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${levels[strength].t}`}>{levels[strength].l} Entropy</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[3px] ml-4 text-[#4E7A96]">Verify Access Key</label>
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-40 group-focus-within:opacity-100 transition-opacity">🛡️</div>
            <input
              id="confirm" type={showConfirm ? 'text' : 'password'} placeholder="Repeat Passphrase"
              className={`w-full py-5 px-6 pl-14 pr-14 bg-white/5 border-2 rounded-[24px] text-white text-[15px] font-bold outline-none transition-all duration-300
                ${errors.confirm ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/10 focus:border-blue-500 focus:bg-blue-500/5 shadow-2xl focus:shadow-blue-500/20'}
              `}
              value={formData.confirm} onChange={handleChange}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-5 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity p-2 text-xl">
              {showConfirm ? '🙈' : '👁'}
            </button>
          </div>
          {errors.confirm && <p className="ml-4 text-[11px] font-bold text-rose-400">{errors.confirm}</p>}
        </div>

        <div className="p-6 rounded-[28px] bg-blue-500/10 border border-blue-500/20 flex items-start gap-4 animate-fade-in">
           <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl shrink-0">🤝</div>
           <p className="text-[12px] font-bold text-[#8AAFC8] leading-relaxed italic">
             "Provider entities undergo a rigorous <span className="text-white font-black">24-hour verification</span> cycle to maintain the integrity of the Sri Lankan EV Grid."
           </p>
        </div>

        <button type="submit" disabled={loading} className="w-full py-5 rounded-[24px] text-[15px] font-black uppercase tracking-[3px] transition-all bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-blue-500/30 group flex items-center justify-center gap-3">
          {loading ? (
             <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
             <>Register Entity <span className="group-hover:translate-x-2 transition-transform">→</span></>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProvAccountForm;
