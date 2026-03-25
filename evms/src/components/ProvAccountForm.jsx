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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validate(name, value);
    if (name === 'password' && formData.confirm) {
      setErrors(prev => ({ ...prev, confirm: value === formData.confirm ? '' : 'Passwords do not match' }));
    }
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
    { c: 'bg-[#3B82F6]', t: 'text-[#3B82F6]', l: 'Strong' }
  ];

  const inp = (name, type, icon, placeholder, val, show, setShow) => (
    <div className="mb-5">
      <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-gray-500">{name} *</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">{icon}</span>
        <input
          name={name.toLowerCase().replace(' ', '')} type={show !== undefined ? (show ? 'text' : 'password') : type}
          placeholder={placeholder} value={val} onChange={handleChange}
          className={`w-full py-3 px-4 pl-12 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#3B82F6]/50 focus:bg-[#3B82F6]/5 focus:ring-4 focus:ring-[#3B82F6]/10 placeholder:text-gray-500 ${errors[name.toLowerCase().replace(' ', '')] ? 'border-rose-500/50 bg-rose-500/5' : ''}`}
        />
        {setShow && (
          <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-500">
            {show ? '🙈' : '👁'}
          </button>
        )}
      </div>
      {errors[name.toLowerCase().replace(' ', '')] && <p className="text-[11px] mt-1.5 text-rose-500">⚠ {errors[name.toLowerCase().replace(' ', '')]}</p>}
    </div>
  );

  return (
    <div className="w-full animate-[fadeInUp_0.4s_ease_both]">
      <div className="mb-8 border-l-4 border-[#3B82F6] pl-5 font-dm">
        <div className="text-[11px] font-semibold uppercase tracking-widest mb-1 text-gray-500">Step 1 of 5</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-1">Create Account</h2>
        <p className="text-sm text-gray-400">Set up secure credentials for your portal.</p>
      </div>

      <form onSubmit={handleSubmit} className="font-dm">
        {fbError && <div className="p-3 mb-5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">⚠ {fbError}</div>}
        
        {inp('Email', 'email', '📧', 'company@email.com', formData.email)}
        
        <div className="mb-5">
          {inp('Password', 'password', '🔒', 'Min 8 characters', formData.password, showPass, setShowPass)}
          {formData.password && (
            <div className="mt-2 text-dm">
              <div className="flex gap-1.5 h-1">
                {[1, 2, 3, 4].map(i => <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${i <= strength ? levels[strength].c : 'bg-white/10'}`}></div>)}
              </div>
              <p className={`text-[11px] mt-1 font-semibold ${levels[strength].t}`}>{levels[strength].l} password</p>
            </div>
          )}
        </div>

        {inp('Confirm', 'password', '🔒', 'Re-enter password', formData.confirm, showConfirm, setShowConfirm)}

        <div className="rounded-xl p-4 flex items-start gap-4 bg-[#3B82F6]/10 border border-[#3B82F6]/20 mb-8 text-[13px] leading-relaxed text-[#94A3B8]">
          <span className="text-lg">ℹ️</span>
          <p>Provider accounts are reviewed within <strong className="text-white">24–48 hours</strong>.</p>
        </div>

        <button type="submit" disabled={loading} className={`w-full py-4 rounded-xl text-sm font-bold transition-all font-syne shadow-[0_6px_24px_rgba(59,130,246,0.3)] bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(59,130,246,0.4)]'}`}>
          {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Creating...</> : 'Continue to Business Info →'}
        </button>
      </form>
    </div>
  );
};

export default ProvAccountForm;
