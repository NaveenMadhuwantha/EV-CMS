import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProviderProfile } from '../firestore/providerDb';

const ProvReviewForm = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [terms, setTerms] = useState(false);
  const [news, setNews] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const get = (k, def = '—') => sessionStorage.getItem('prov_' + k) || def;
    setData({
      email: get('email'),
      companyName: get('companyName'),
      bizType: get('bizType'),
      brNo: get('brNo'),
      contact: `${get('contactPerson')} · ${get('contactPhone')}`,
      bizLoc: [get('city'), get('district')].filter(v => v !== '—').join(', ') || '—',
      stationName: get('stationName'),
      chargeType: get('chargeType'),
      connectors: get('connectors').replace(/[\[\]"]/g, ''),
      slots: `${get('slots')} slots`,
      stLoc: [get('stCity'), get('stDistrict')].filter(v => v !== '—').join(', ') || '—',
      rate: parseFloat(get('rateHour') || 0),
      schedule: get('is247') === 'true' ? '24/7' : `${get('openTime')} - ${get('closeTime')}`,
      bank: get('bankName')
    });
  }, []);

  const handleSubmit = async () => {
    if (!terms) return setError(true);
    setError(false);
    
    const uid = sessionStorage.getItem('prov_uid');
    if (!uid) { alert('Session expired. Please start over.'); return; }

    setLoading(true);
    try {
      await saveProviderProfile(uid, data);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center font-dm animate-[fadeUp_0.4s_ease_both]">
        <div className="w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] shadow-[0_0_50px_rgba(59,130,246,0.5),0_20px_60px_rgba(59,130,246,0.3)] animate-in zoom-in duration-500">✓</div>
        <h2 className="font-syne text-4xl font-extrabold text-white mb-3">Application Submitted!</h2>
        <p className="text-[15px] leading-relaxed mb-8 text-[#94A3B8]">
          Welcome aboard, <strong className="text-[#60A5FA]">{data.companyName}</strong>!<br/>
          Your provider application is under review. Our team will activate your account within <strong className="text-white">24–48 hours</strong>.
        </p>

        <div className="rounded-2xl p-5 mb-6 text-left bg-[#3B82F6]/5 border border-[#3B82F6]/25">
          <div className="text-[11px] font-bold uppercase tracking-wider mb-4 text-[#60A5FA]">Application Summary</div>
          <div className="space-y-3 pb-2">
            {[
              ['Company', data.companyName], ['BR Number', data.brNo],
              ['Station', data.stationName], ['Charge Type', data.chargeType],
              ['Location', data.stLoc], ['Rate', `LKR ${data.rate}/hr`],
              ['Status', '⏳ Pending Admin Review', '#FBBF24']
            ].map(([l, v, c]) => (
              <div key={l} className="flex justify-between text-[13px] pb-1.5 border-b border-white/5 last:border-0">
                <span className="text-[#475569]">{l}</span>
                <span className="font-semibold" style={{ color: c || '#EFF6FF' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-5 mb-8 text-left bg-white/5 border border-white/10">
          <div className="text-[11px] font-bold uppercase tracking-wider mb-4 text-[#475569]">What Happens Next</div>
          <div className="space-y-4">
            {[
              { n: '1', t: 'Admin Review', d: 'Our team verifies your business details', c: '#60A5FA', b: '#3B82F6' },
              { n: '2', t: 'Email Confirmation', d: "You'll receive approval email with access", c: '#34D399', b: '#10B981' },
              { n: '3', t: 'Station Goes Live', d: 'Your station appears on the map', c: '#FBBF24', b: '#F59E0B' }
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: `${s.b}30`, color: s.c, border: `1px solid ${s.b}50` }}>{s.n}</div>
                <div><div className="text-sm font-semibold text-white">{s.t}</div><div className="text-xs text-[#64748B]">{s.d}</div></div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => navigate('/login')} className="px-10 py-3.5 rounded-xl font-bold font-syne text-[15px] bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white shadow-[0_6px_24px_rgba(59,130,246,0.38)] hover:-translate-y-0.5 transition-all">Return to Home →</button>
        <p className="text-[12px] mt-5 text-[#475569]">Confirmation email will be sent to {data.email}</p>
      </div>
    );
  }

  const renderCard = (icon, title, color, stepRoute, fields) => (
    <div className="bg-white/3 border border-white/[0.08] rounded-2xl p-4 mb-3 border-t-2" style={{ borderTopColor: color }}>
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2"><span>{icon}</span><span className="font-syne text-[13px] font-bold" style={{ color }}>{title}</span></div>
        <button type="button" onClick={() => navigate(stepRoute)} className="text-[11px] text-[#475569] hover:text-[#60A5FA] bg-transparent border-none cursor-pointer">Edit ✎</button>
      </div>
      <div className="space-y-2">
        {fields.map(([lbl, val, valColor]) => (
          <div key={lbl} className="flex justify-between items-start text-[13px] pb-1.5 border-b border-white/[0.04] last:border-0 last:pb-0">
            <span className="text-[#475569] shrink-0">{lbl}</span>
            <span className="font-medium text-right max-w-[200px] break-words" style={{ color: valColor || '#EFF6FF' }}>{val || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full font-dm animate-[fadeUp_0.4s_ease_both]">
      <div className="mb-7">
        <div className="text-[11px] font-semibold uppercase tracking-widest mb-2 text-[#475569]">Step 5 of 5</div>
        <h2 className="font-syne text-3xl font-extrabold text-white mb-2">Review & Submit</h2>
        <p className="text-sm text-[#64748B]">Verify your information before submitting for admin approval.</p>
      </div>

      <div className="space-y-4">
        {renderCard('🔐', 'Account', '#60A5FA', '/provider/register', [
          ['Email', data.email], ['Password', '••••••••']
        ])}
        
        {renderCard('🏢', 'Business Info', '#34D399', '/provider/register/step2', [
          ['Company', data.companyName], ['Type', data.bizType],
          ['BR Number', data.brNo], ['Contact', data.contact], ['Location', data.bizLoc]
        ])}

        {renderCard('⚡', 'Station Details', '#FBBF24', '/provider/register/step3', [
          ['Name', data.stationName], ['Charge Type', data.chargeType],
          ['Connectors', data.connectors], ['Total Slots', data.slots], ['Location', data.stLoc]
        ])}

        {renderCard('💰', 'Pricing & Schedule', '#A78BFA', '/provider/register/step4', [
          ['Rate', `LKR ${data.rate}/hr`, '#34D399'],
          ['Your Payout', `LKR ${(data.rate * 0.85).toFixed(0)}/hr (after 15% fee)`, '#34D399'],
          ['Schedule', data.schedule], ['Bank', data.bank]
        ])}
      </div>

      <div className="rounded-xl p-4 my-6 flex items-start gap-3 bg-[#FBBF24]/5 border border-[#FBBF24]/20">
        <span className="text-lg shrink-0 mt-0.5">⏳</span>
        <div className="text-[13px] leading-relaxed text-[#94A3B8]">
          Your application will be reviewed by our admin team within <strong className="text-white">24–48 hours</strong>. You'll receive an email confirmation once approved.
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex items-start gap-3 cursor-pointer" onClick={() => { setTerms(!terms); setError(false); }}>
          <div className={`w-[22px] h-[22px] min-w-[22px] mt-0.5 rounded-md border-[1.5px] flex items-center justify-center transition-all ${terms ? 'bg-[#60A5FA] border-[#60A5FA] shadow-[0_0_10px_rgba(96,165,250,0.4)]' : 'bg-white/5 border-white/15'}`}>
            {terms && <span className="text-[#0A0F1E] text-xs font-bold">✓</span>}
          </div>
          <div className="text-[13px] leading-relaxed text-[#94A3B8]">
            I agree to the <span className="text-[#60A5FA] hover:underline">Terms of Service</span>, <span className="text-[#60A5FA] hover:underline">Privacy Policy</span>, and <span className="text-[#60A5FA] hover:underline">Provider Agreement</span>. All information provided is accurate and legally valid.
          </div>
        </div>
        {error && <div className="text-[11px] ml-8 text-rose-400">⚠ You must agree to continue</div>}
        
        <div className="flex items-start gap-3 cursor-pointer" onClick={() => setNews(!news)}>
          <div className={`w-[22px] h-[22px] min-w-[22px] mt-0.5 rounded-md border-[1.5px] flex items-center justify-center transition-all ${news ? 'bg-[#60A5FA] border-[#60A5FA] shadow-[0_0_10px_rgba(96,165,250,0.4)]' : 'bg-white/5 border-white/15'}`}>
            {news && <span className="text-[#0A0F1E] text-xs font-bold">✓</span>}
          </div>
          <div className="text-[13px] text-[#94A3B8]">Receive platform updates, policy changes, and revenue reports by email <span className="text-[#475569]">(Recommended)</span></div>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => navigate('/provider/register/step4')} className="px-6 py-3 rounded-xl font-semibold text-sm bg-white/5 border border-white/10 text-[#94A3B8] hover:border-[#3B82F6]/35 hover:text-white transition-all">← Back</button>
        <button type="button" onClick={handleSubmit} disabled={loading} className="flex-1 py-3 rounded-xl font-syne font-bold text-[15px] bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white shadow-[0_6px_24px_rgba(59,130,246,0.35)] hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(59,130,246,0.45)] transition-all">
          {loading ? 'Submitting...' : '⚡ Submit for Approval'}
        </button>
      </div>
    </div>
  );
};

export default ProvReviewForm;
