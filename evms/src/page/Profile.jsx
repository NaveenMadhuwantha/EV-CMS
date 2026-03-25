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
    <AdminLayout title="Identity Node">
      <div className="max-w-5xl mx-auto space-y-10 animate-fade-up">
        
        {/* Core Identity Sector */}
        <div className="bg-[#0a1628] border border-[#00d2b4]/10 rounded-[48px] p-12 relative overflow-hidden group hover:border-[#00d2b4]/30 transition-all border-2 border-dashed">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d2b4]/5 blur-[100px] pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="relative group/avatar">
              <div className="w-40 h-40 rounded-[48px] bg-gradient-to-br from-[#00d2b4] to-[#0094ff] p-1 flex items-center justify-center shadow-2xl group-hover/avatar:rotate-6 transition-transform duration-700">
                 <div className="w-full h-full rounded-[44px] bg-[#0a1628] flex items-center justify-center text-5xl font-syne font-black text-white italic">
                   {profile?.fullName ? profile.fullName.split(' ').map(n=>n[0]).join('') : 'U'}
                 </div>
              </div>
              <button className="absolute -bottom-4 -right-4 w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-[#00d2b4] hover:bg-[#00d2b4] hover:text-[#050c14] transition-all shadow-2xl active:scale-90">
                <Camera className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                 <h1 className="font-syne text-4xl font-black text-white italic uppercase tracking-tight">
                    {profile?.fullName || 'Full Name Pending'}
                 </h1>
                 <span className="px-4 py-1.5 rounded-full bg-[#00d2b4]/10 border border-[#00d2b4]/20 text-[10px] font-black uppercase tracking-widest text-[#00d2b4] flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Entity
                 </span>
              </div>
              <p className="text-[#7a9bbf] font-medium text-lg italic opacity-60 mb-8 max-w-xl">
                 Ecosystem member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Mar 2026'}. 
                 Grid authorization Level 1 active.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                   { i: Mail, l: 'System Proxy', v: user?.email },
                   { i: Phone, l: 'Secure Comms', v: profile?.phone || 'Not Configured' },
                   { i: MapPin, l: 'Geo Root', v: profile?.address || 'Sri Lanka' },
                   { i: Globe, l: 'Node Region', v: 'Sector A1-Colombo' }
                 ].map((d, i) => (
                   <div key={i} className="flex items-center gap-5 p-5 glass-panel rounded-3xl border-white/5 hover:border-[#00d2b4]/20 transition-all group/item">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#3a5a7a] group-hover/item:text-[#00d2b4] transition-colors">
                         <d.i className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                         <div className="text-[9px] font-black uppercase tracking-widest text-[#3a5a7a] mb-1">{d.l}</div>
                         <div className="text-[13px] font-bold text-white truncate">{d.v}</div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>

        {/* Security & Access Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           <div className="bg-[#0a1628] border border-[#00d2b4]/10 rounded-[40px] p-10 hover:border-[#00d2b4]/30 transition-all group">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-[11px] font-black uppercase tracking-[5px] text-white flex items-center gap-4">
                    <Fingerprint className="w-5 h-5 text-blue-400" />
                    Authentication Layer
                 </h3>
                 <Settings className="w-5 h-5 text-[#3a5a7a] group-hover:rotate-90 transition-transform" />
              </div>
              
              <div className="space-y-6">
                 {[
                   { t: 'Multi-Factor Auth', d: 'Secure grid entry verification', s: 'Active', c: 'text-[#00d2b4]' },
                   { t: 'Session Keys', d: 'Rotate every 24 hours', s: 'Secure', c: 'text-blue-400' },
                   { t: 'System Payouts', d: 'LKR Settlement path verified', s: 'Link Active', c: 'text-[#00d2b4]' }
                 ].map(s => (
                   <div key={s.t} className="flex justify-between items-center p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                      <div>
                         <div className="text-[14px] font-bold text-white mb-1">{s.t}</div>
                         <div className="text-[11px] text-[#7a9bbf] font-medium opacity-60 italic">{s.d}</div>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full ${s.c}`}>{s.s}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-rose-500/5 border border-rose-500/20 rounded-[40px] p-10 hover:border-rose-500/40 transition-all group">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-[11px] font-black uppercase tracking-[5px] text-rose-500 flex items-center gap-4">
                    <ShieldAlert className="w-5 h-5" />
                    Zone De-Authorization
                 </h3>
              </div>
              <p className="text-[#8AAFC8] text-sm leading-relaxed mb-10 italic font-medium opacity-70">
                 Finalizing this action will terminate all active grid node authorizations. This action is irreversible within the current session sector.
              </p>
              <div className="space-y-4">
                 <button className="w-full py-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/10">
                    Purge System Session
                 </button>
                 <button className="w-full py-5 rounded-2xl bg-white/5 text-[#7a9bbf] text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
                    Backup Identity Node
                 </button>
              </div>
           </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default Profile;
