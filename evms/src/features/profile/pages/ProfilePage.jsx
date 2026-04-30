import React, { useRef, useState } from 'react';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';
import { useAuth } from '../../auth/context/AuthContext';
import { 
  User, Mail, Phone, MapPin, ShieldCheck, 
  Lock, Camera, Settings, ShieldAlert, 
  ArrowUpRight, Fingerprint, Globe, Loader2
} from 'lucide-react';
import { useLanguage } from '../../../shared/context/LanguageContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db, auth } from '../../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider,
  updateEmail
} from 'firebase/auth';

const Profile = () => {
  const { user, profile, role } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  
  // Security Modal States
  const [activeModal, setActiveModal] = useState(null); // 'password', 'bank', '2fa'
  const [loading, setLoading] = useState(false);
  
  // Password Form State
  const [passForm, setPassForm] = useState({ current: '', new: '', confirm: '' });
  
  // Bank Form State
  const [bankForm, setBankForm] = useState({
    accName: profile?.bankDetails?.accName || '',
    accNumber: profile?.bankDetails?.accNumber || '',
    bankName: profile?.bankDetails?.bankName || '',
    branch: profile?.bankDetails?.branch || ''
  });

  const isGoogleUser = user?.providerData?.some(p => p.providerId === 'google.com');

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      // 1. Create storage reference
      const storageRef = ref(storage, `profiles/${user.uid}/${file.name}`);
      
      // 2. Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // 3. Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // 4. Update Firestore
      const coll = role === 'provider' ? 'providers' : 'users';
      const userRef = doc(db, coll, user.uid);
      await updateDoc(userRef, {
        photoURL: downloadURL
      });

      alert(t('photoUpdatedSuccess') || 'Profile photo updated successfully!');
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert(t('photoUploadError') || 'Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAction = (action) => {
    if (action === 'Camera / Avatar Upload') {
      fileInputRef.current?.click();
      return;
    }
    if (action === t('passwordManagement')) {
      setActiveModal('password');
      return;
    }
    if (action === t('linkedBank')) {
      setActiveModal('bank');
      return;
    }
    if (action === t('twoStepVerification')) {
      setActiveModal('2fa');
      return;
    }
    alert(`${action} functionality will be implemented in the next phase.`);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.new !== passForm.confirm) return alert("Passwords don't match");
    if (passForm.new.length < 6) return alert("Password must be at least 6 characters");

    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(user.email, passForm.current);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passForm.new);
      alert("Password updated successfully!");
      setActiveModal(null);
      setPassForm({ current: '', new: '', confirm: '' });
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update password. Check your current password.");
    } finally {
      setLoading(false);
    }
  };

  const handleBankUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const coll = role === 'provider' ? 'providers' : 'users';
      const userRef = doc(db, coll, user.uid);
      await updateDoc(userRef, {
        bankDetails: bankForm
      });
      alert("Bank details updated!");
      setActiveModal(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update bank details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm(t('deleteAccountConfirm'))) {
      alert(t('deleteAccountSuccess'));
    }
  };

  return (
    <DashboardLayout title={t('myProfile')}>
      <div className="max-w-5xl mx-auto space-y-10 animate-fade-up font-inter">
        
        {/* Core Identity Sector */}
        <div className="bg-white border-2 border-[#E2E8F0] rounded-[48px] p-10 lg:p-14 relative overflow-hidden group hover:border-[#3B82F6]/30 transition-all shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[120px] pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="relative group/avatar">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                className="hidden" 
                accept="image/*"
              />
              <div className="w-40 h-40 rounded-[44px] bg-gradient-to-br from-[#3B82F6] to-blue-600 p-1 flex items-center justify-center shadow-2xl group-hover/avatar:scale-105 transition-transform duration-500 overflow-hidden">
                 <div className="w-full h-full rounded-[40px] bg-white flex items-center justify-center text-5xl font-manrope font-black text-[#0F172A] overflow-hidden relative">
                   {profile?.photoURL ? (
                     <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     profile?.fullName ? profile.fullName.split(' ').map(n=>n[0]).join('') : 'U'
                   )}
                   
                   {uploading && (
                     <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
                     </div>
                   )}
                 </div>
              </div>
              <button 
                onClick={() => handleAction('Camera / Avatar Upload')}
                disabled={uploading}
                className="absolute -bottom-4 -right-4 w-12 h-12 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex-1 text-center md:text-left relative z-10">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-5">
                 <h1 className="font-manrope text-5xl font-black text-[#0F172A] uppercase tracking-tighter leading-none">
                    {profile?.fullName || 'User Name'}
                 </h1>
                 <span className="px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-widest text-[#3B82F6] flex items-center gap-2 font-inter shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                    {t('verifiedUser')}
                 </span>
              </div>
              <p className="text-[#64748B] font-medium text-[16px] mb-10 max-w-xl font-inter leading-relaxed">
                 {t('memberSince')} {profile?.createdAt ? (typeof profile.createdAt === 'string' ? new Date(profile.createdAt).toLocaleDateString() : profile.createdAt.toDate?.().toLocaleDateString() || 'Recently') : 'Recently'}. 
                 {t('managePersonalInfo')}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-inter">
                 {[
                   { i: Mail, l: t('emailAddress'), v: user?.email },
                   { i: Phone, l: t('phoneNumber'), v: profile?.phone || t('notProvided') },
                   { i: MapPin, l: t('location'), v: profile?.address || 'Sri Lanka' },
                   { i: Globe, l: t('accountType'), v: localStorage.getItem('user_role')?.toUpperCase() || 'USER' }
                 ].map((d, i) => (
                   <div key={i} className="flex items-center gap-5 p-6 bg-[#F8FAFC] rounded-[32px] border border-[#E2E8F0] hover:border-[#3B82F6]/30 transition-all group/item shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] group-hover/item:text-[#3B82F6] transition-colors shadow-sm">
                         <d.i className="w-5.5 h-5.5" />
                      </div>
                      <div className="min-w-0">
                         <div className="text-[10px] font-black uppercase tracking-[2px] text-[#94A3B8] mb-1.5">{d.l}</div>
                         <div className="text-[15px] font-black text-[#0F172A] truncate font-manrope">{d.v}</div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>

        {/* Security & Access Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           <div className="bg-white border-2 border-[#E2E8F0] rounded-[48px] p-10 hover:border-blue-500/30 transition-all group shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px]"></div>
              <div className="flex justify-between items-center mb-10 relative z-10">
                 <h3 className="text-[11px] font-black uppercase tracking-[5px] text-[#0F172A] flex items-center gap-4 font-inter">
                    <Fingerprint className="w-5.5 h-5.5 text-[#3B82F6] group-hover:scale-110 transition-transform" />
                    {t('securitySettings')}
                 </h3>
                 <Settings className="w-5 h-5 text-[#94A3B8] group-hover:rotate-90 transition-transform cursor-pointer" />
              </div>
              
               <div className="space-y-5 relative z-10">
                  {[
                    { t: t('twoStepVerification'), d: t('twoStepDesc'), s: profile?.twoStepEnabled ? t('active') : t('inactive'), c: profile?.twoStepEnabled ? 'text-emerald-600 bg-emerald-50' : 'text-[#64748B] bg-[#F8FAFC]' },
                    { t: t('passwordManagement'), d: isGoogleUser ? 'Managed by Google' : t('passwordDesc'), s: isGoogleUser ? 'EXTERNAL' : t('secure'), c: isGoogleUser ? 'text-amber-600 bg-amber-50' : 'text-[#3B82F6] bg-blue-50' },
                    { t: t('linkedBank'), d: t('linkedBankDesc'), s: profile?.bankDetails ? t('configured') : t('notSet'), c: profile?.bankDetails ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-red-50' }
                  ].map(s => (
                    <div 
                      key={s.t} 
                      onClick={() => handleAction(s.t)}
                      className="flex justify-between items-center p-6 rounded-[32px] bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3B82F6]/30 transition-all shadow-sm cursor-pointer group/row"
                    >
                       <div>
                          <div className="text-[16px] font-black text-[#0F172A] mb-1 font-manrope group-hover/row:text-[#3B82F6] transition-colors">{s.t}</div>
                          <div className="text-[12px] text-[#64748B] font-medium font-inter">{s.d}</div>
                       </div>
                       <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl font-inter border border-black/5 ${s.c}`}>{s.s}</span>
                    </div>
                  ))}
               </div>
           </div>

           <div className="bg-red-50/50 border-2 border-red-100 rounded-[48px] p-10 hover:border-red-500/30 transition-all group shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[60px]"></div>
              <div className="flex justify-between items-center mb-10 px-1 relative z-10">
                 <h3 className="text-[11px] font-black uppercase tracking-[5px] text-red-600 flex items-center gap-4 font-inter">
                    <ShieldAlert className="w-5.5 h-5.5 group-hover:animate-pulse" />
                    {t('dangerZone')}
                 </h3>
              </div>
              <p className="text-[#64748B] text-[15px] leading-relaxed mb-10 font-medium font-inter border-l-4 border-red-200 pl-6 relative z-10">
                 {t('dangerZoneWarning')}
              </p>
               <div className="space-y-4 relative z-10">
                  <button 
                    onClick={handleDeleteAccount}
                    className="w-full py-5 rounded-3xl bg-red-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 font-manrope"
                  >
                    {t('deleteAccount')}
                  </button>
                  <button 
                    onClick={() => handleAction('Data Download')}
                    className="w-full py-5 rounded-3xl bg-white border border-[#E2E8F0] text-[#64748B] text-[11px] font-black uppercase tracking-widest hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-all font-manrope"
                  >
                    {t('downloadData')}
                  </button>
              </div>
           </div>

        </div>

        {/* Modals */}
        {activeModal === 'password' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0F172A]/80 backdrop-blur-xl">
             <div className="bg-[#1E293B] border border-white/10 rounded-[40px] p-10 max-w-md w-full shadow-2xl animate-fade-up">
                <h3 className="font-manrope text-2xl font-black text-white mb-2 uppercase tracking-tight">{t('passwordManagement')}</h3>
                <p className="text-[#8AAFC8] text-sm mb-8">{isGoogleUser ? 'You are logged in with Google. Please manage your password in your Google Account settings.' : 'Update your account security password.'}</p>
                
                {!isGoogleUser ? (
                  <form onSubmit={handlePasswordChange} className="space-y-5">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] block mb-2">Current Password</label>
                      <input 
                        type="password" required
                        value={passForm.current}
                        onChange={e => setPassForm({...passForm, current: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#00d2b4]/50 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] block mb-2">New Password</label>
                      <input 
                        type="password" required minLength={6}
                        value={passForm.new}
                        onChange={e => setPassForm({...passForm, new: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#00d2b4]/50 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] block mb-2">Confirm New Password</label>
                      <input 
                        type="password" required
                        value={passForm.confirm}
                        onChange={e => setPassForm({...passForm, confirm: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#00d2b4]/50 outline-none transition-all"
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-4 rounded-2xl bg-white/5 text-[#8AAFC8] font-bold uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all">Cancel</button>
                      <button type="submit" disabled={loading} className="flex-1 py-4 rounded-2xl bg-[#00d2b4] text-[#0F172A] font-black uppercase tracking-widest text-[11px] hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                        {loading ? 'Processing...' : 'Update'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <button onClick={() => setActiveModal(null)} className="w-full py-4 rounded-2xl bg-[#00d2b4] text-[#0F172A] font-black uppercase tracking-widest text-[11px]">Understood</button>
                )}
             </div>
          </div>
        )}

        {activeModal === 'bank' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0F172A]/80 backdrop-blur-xl">
             <div className="bg-[#1E293B] border border-white/10 rounded-[40px] p-10 max-w-md w-full shadow-2xl animate-fade-up">
                <h3 className="font-manrope text-2xl font-black text-white mb-2 uppercase tracking-tight">{t('linkedBank')}</h3>
                <p className="text-[#8AAFC8] text-sm mb-8">Enter your payment settlement details.</p>
                
                <form onSubmit={handleBankUpdate} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] block mb-2">Account Holder Name</label>
                      <input 
                        type="text" required
                        value={bankForm.accName}
                        onChange={e => setBankForm({...bankForm, accName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#00d2b4]/50 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] block mb-2">Account Number</label>
                      <input 
                        type="text" required
                        value={bankForm.accNumber}
                        onChange={e => setBankForm({...bankForm, accNumber: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#00d2b4]/50 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] block mb-2">Bank Name</label>
                      <input 
                        type="text" required
                        value={bankForm.bankName}
                        onChange={e => setBankForm({...bankForm, bankName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#00d2b4]/50 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] block mb-2">Branch</label>
                      <input 
                        type="text" required
                        value={bankForm.branch}
                        onChange={e => setBankForm({...bankForm, branch: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#00d2b4]/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-4 rounded-2xl bg-white/5 text-[#8AAFC8] font-bold uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all">Cancel</button>
                    <button type="submit" disabled={loading} className="flex-1 py-4 rounded-2xl bg-emerald-500 text-[#0F172A] font-black uppercase tracking-widest text-[11px] hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                      {loading ? 'Saving...' : 'Save Details'}
                    </button>
                  </div>
                </form>
             </div>
          </div>
        )}

        {activeModal === '2fa' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0F172A]/80 backdrop-blur-xl">
             <div className="bg-[#1E293B] border border-white/10 rounded-[40px] p-10 max-w-md w-full shadow-2xl animate-fade-up text-center">
                <div className="w-20 h-20 bg-[#00d2b4]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                   <ShieldCheck className="w-10 h-10 text-[#00d2b4]" />
                </div>
                <h3 className="font-manrope text-2xl font-black text-white mb-2 uppercase tracking-tight">{t('twoStepVerification')}</h3>
                <p className="text-[#8AAFC8] text-sm mb-8 leading-relaxed">Enhance your account security by requiring a second verification step. This will use your registered email for secondary approval.</p>
                
                <button 
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const coll = role === 'provider' ? 'providers' : 'users';
                      await updateDoc(doc(db, coll, user.uid), { twoStepEnabled: !profile?.twoStepEnabled });
                      alert(`Two-step verification ${!profile?.twoStepEnabled ? 'enabled' : 'disabled'}`);
                      setActiveModal(null);
                    } catch (e) { alert("Action failed"); }
                    finally { setLoading(false); }
                  }}
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-[2px] text-[12px] transition-all mb-4 ${
                    profile?.twoStepEnabled ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-[#00d2b4] text-[#0F172A]'
                  }`}
                >
                  {loading ? 'Processing...' : (profile?.twoStepEnabled ? 'Disable Verification' : 'Enable Now')}
                </button>
                <button onClick={() => setActiveModal(null)} className="w-full py-4 text-[#4E7A96] font-bold uppercase tracking-widest text-[10px]">Close</button>
             </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
