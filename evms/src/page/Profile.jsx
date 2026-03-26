import React from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Phone, MapPin, ShieldCheck, 
  Lock, Camera, Settings, ShieldAlert, 
  ArrowUpRight, Fingerprint, Globe 
} from 'lucide-react';

const Profile = () => {
  const { user, profile } = useAuth();

  return (
    <AdminLayout title="My Profile">
      <div className="max-w-5xl mx-auto space-y-10 animate-fade-up font-inter">
        
        {/* Core Identity Sector */}
        <div className="bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/20 rounded-[48px] p-10 lg:p-14 relative overflow-hidden group hover:border-[#00d2b4]/40 transition-all shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d2b4]/5 blur-[120px] pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="relative group/avatar">
              <div className="w-40 h-40 rounded-[44px] bg-gradient-to-br from-[#00d2b4] to-[#0094ff] p-1 flex items-center justify-center shadow-2xl group-hover/avatar:scale-105 transition-transform duration-500">
                 <div className="w-full h-full rounded-[40px] bg-[#0a1628] flex items-center justify-center text-5xl font-manrope font-extrabold text-white">
                   {profile?.fullName ? profile.fullName.split(' ').map(n=>n[0]).join('') : 'U'}
                 </div>
              </div>
              <button className="absolute -bottom-4 -right-4 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-[#00d2b4] hover:bg-[#00d2b4] hover:text-[#050c14] transition-all shadow-xl active:scale-95">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-5">
                 <h1 className="font-manrope text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-tight leading-none">
                    {profile?.fullName || 'User Name'}
                 </h1>
                 <span className="px-4 py-1.5 rounded-full bg-[#00d2b4]/10 border border-[#00d2b4]/20 text-[10px] font-bold uppercase tracking-widest text-[#00d2b4] flex items-center gap-2 font-inter">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified User
                 </span>
              </div>
              <p className="text-[#8AAFC8] font-medium text-lg opacity-80 mb-10 max-w-xl font-inter leading-relaxed">
                 Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'March 2026'}. 
                 Manage your personal information and security settings here.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-inter">
                 {[
                   { i: Mail, l: 'Email Address', v: user?.email },
                   { i: Phone, l: 'Phone Number', v: profile?.phone || 'Not Provided' },
                   { i: MapPin, l: 'Location', v: profile?.address || 'Sri Lanka' },
                   { i: Globe, l: 'Account Type', v: localStorage.getItem('user_role')?.toUpperCase() || 'USER' }
                 ].map((d, i) => (
                   <div key={i} className="flex items-center gap-5 p-5 bg-white/[0.02] rounded-3xl border border-white/5 hover:border-[#00d2b4]/20 transition-all group/item shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#4E7A96] group-hover/item:text-[#00d2b4] transition-colors">
                         <d.i className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                         <div className="text-[10px] font-bold uppercase tracking-widest text-[#4E7A96] mb-1 opacity-70">{d.l}</div>
                         <div className="text-[14px] font-extrabold text-white truncate font-manrope">{d.v}</div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>

        {/* Security & Access Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           <div className="bg-white/[0.02] border border-white/10 rounded-[40px] p-10 hover:border-blue-500/30 transition-all group shadow-sm">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-[11px] font-bold uppercase tracking-[5px] text-white flex items-center gap-4 font-inter">
                    <Fingerprint className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                    Security Settings
                 </h3>
                 <Settings className="w-5 h-5 text-[#4E7A96] group-hover:rotate-90 transition-transform cursor-pointer" />
              </div>
              
              <div className="space-y-5">
                 {[
                   { t: 'Two-Step Verification', d: 'Enhanced account security active', s: 'ACTIVE', c: 'text-[#00d2b4]' },
                   { t: 'Password Management', d: 'Securely manage your login credentials', s: 'SECURE', c: 'text-blue-400' },
                   { t: 'Linked Bank Account', d: 'Managing payment settlement details', s: 'CONFIGURED', c: 'text-emerald-400' }
                 ].map(s => (
                   <div key={s.t} className="flex justify-between items-center p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all shadow-sm">
                      <div>
                         <div className="text-[15px] font-extrabold text-white mb-1 font-manrope">{s.t}</div>
                         <div className="text-[11px] text-[#8AAFC8] font-medium opacity-60 font-inter">{s.d}</div>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg font-inter ${s.c}`}>{s.s}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-red-500/5 border border-red-500/10 rounded-[40px] p-10 hover:border-red-500/30 transition-all group shadow-sm">
              <div className="flex justify-between items-center mb-10 px-1">
                 <h3 className="text-[11px] font-bold uppercase tracking-[5px] text-red-500 flex items-center gap-4 font-inter">
                    <ShieldAlert className="w-5 h-5 group-hover:animate-pulse" />
                    Danger Zone
                 </h3>
              </div>
              <p className="text-[#8AAFC8] text-[14px] leading-relaxed mb-10 font-medium opacity-80 font-inter border-l-2 border-red-500/20 pl-6">
                 Warning: Actions here are permanent and cannot be undone. Please be careful when modifying account-level settings.
              </p>
              <div className="space-y-4">
                 <button className="w-full py-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-extrabold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/10 font-manrope">
                    Delete Account
                 </button>
                 <button className="w-full py-5 rounded-2xl bg-white/5 text-[#4E7A96] text-[11px] font-extrabold uppercase tracking-widest hover:text-white transition-all font-manrope">
                    Download Data
                 </button>
              </div>
           </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default Profile;
