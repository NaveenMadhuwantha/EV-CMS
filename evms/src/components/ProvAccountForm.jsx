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
    if (name === 'email') err = /\S+@\S+\.\S+/.test(val) ? '' : 'Invalid email format';
    if (name === 'password') err = val.length >= 8 ? '' : 'Min 8 characters required';
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
    <div className="w-full animate-fade-up font-inter">
      <div className="mb-10 p-8 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none"></div>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-3 text-blue-400 opacity-80">Phase 01 · Provider Authentication</div>
        <h2 className="font-manrope text-3xl font-extrabold text-white mb-3 tracking-tight leading-none uppercase">ACCESS GATE</h2>
        <p className="text-[15px] text-[#8AAFC8] font-medium leading-relaxed opacity-80">Establish your enterprise credentials to manage the power grid.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-10">
        {fbError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500/20 text-rose-400 text-[13px] font-bold animate-shake flex items-center gap-3 shadow-lg">
            <span className="text-lg">❌</span> {fbError}
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Corporate Entity Email</label>
          <div className="relative group font-inter">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity">🏢</div>
            <input
              id="email" type="email" placeholder="company@voltway.lk"
              className={`w-full py-4.5 px-6 pl-14 bg-white/5 border-2 rounded-2xl text-white font-bold outline-none transition-all duration-300
                ${errors.email ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 focus:border-blue-400 focus:bg-blue-400/5 shadow-sm'}
              `}
              value={formData.email} onChange={handleChange}
            />
          </div>
          {errors.email && <p className="ml-2 text-[11px] font-bold text-red-400">{errors.email}</p>}
        </div>

        <div className="space-y-3">
          <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Master Access Key</label>
          <div className="relative group font-inter">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity">🔒</div>
            <input
              id="password" type={showPass ? 'text' : 'password'} placeholder="Secure Passphrase"
              className={`w-full py-4.5 px-6 pl-14 pr-14 bg-white/5 border-2 rounded-2xl text-white font-bold outline-none transition-all duration-300
                ${errors.password ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 focus:border-blue-400 focus:bg-blue-400/5 shadow-sm'}
              `}
              value={formData.password} onChange={handleChange}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-all p-2 text-xl">
              {showPass ? '🙈' : '👁'}
            </button>
          </div>
          {formData.password && !errors.password && (
            <div className="px-2 mt-4">
              <div className="flex gap-1.5 h-1.5 mb-2.5">
                {[1, 2, 3, 4].map(i => <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${i <= strength ? levels[strength].c : 'bg-white/5'}`}></div>)}
              </div>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${levels[strength].t}`}>{levels[strength].l} Entropy Level</p>
            </div>
          )}
          {errors.password && <p className="ml-2 text-[11px] font-bold text-red-400">{errors.password}</p>}
        </div>

        <div className="space-y-3">
          <label className="block text-[11px] font-bold uppercase tracking-widest ml-2 text-[#4E7A96]">Verify Access Key</label>
          <div className="relative group font-inter">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity">🛡️</div>
            <input
              id="confirm" type={showConfirm ? 'text' : 'password'} placeholder="Repeat Passphrase"
              className={`w-full py-4.5 px-6 pl-14 pr-14 bg-white/5 border-2 rounded-2xl text-white font-bold outline-none transition-all duration-300
                ${errors.confirm ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 focus:border-blue-400 focus:bg-blue-400/5 shadow-sm'}
              `}
              value={formData.confirm} onChange={handleChange}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-all p-2 text-xl">
              {showConfirm ? '🙈' : '👁'}
            </button>
          </div>
          {errors.confirm && <p className="ml-2 text-[11px] font-bold text-red-400">{errors.confirm}</p>}
        </div>

        <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-4 animate-fade-in shadow-sm">
           <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl shrink-0">🤝</div>
           <p className="text-[12px] font-bold text-[#8AAFC8] leading-relaxed italic opacity-80">
             Provider entities undergo a rigorous <span className="text-white font-bold opacity-100">24-hour verification</span> cycle to maintain the integrity of the Sri Lankan EV Grid ecosystem.
           </p>
        </div>

        <div className="pt-6 font-manrope">
          <button type="submit" disabled={loading} className="w-full py-5 rounded-2xl text-[14px] font-extrabold uppercase tracking-widest transition-all bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/20 group flex items-center justify-center gap-4">
            {loading ? (
               <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
               <>REGISTER ENTITY <span className="group-hover:translate-x-2 transition-transform duration-300">→</span></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProvAccountForm;
