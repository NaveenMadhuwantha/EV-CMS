import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';
import { useAuth } from '../../auth/context/AuthContext';
import { useLanguage } from '../../../shared/context/LanguageContext';
import { Link } from 'react-router-dom';
import { 
  Zap, MapPin, Calendar, TrendingUp, 
  Clock, Activity, Fuel, History, Car,
  CreditCard, ShieldCheck
} from 'lucide-react';

const StatCard = ({ icon: Icon, color, value, label, delay }) => (
  <div className={`p-8 bg-white border-2 border-[#E2E8F0] rounded-[40px] relative overflow-hidden group hover:border-[#3B82F6]/30 hover:-translate-y-1 transition-all animate-fade-up ${delay} shadow-xl shadow-blue-500/5 font-inter`}>
    <div className="flex justify-between items-start mb-8">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[18px] ${color} shadow-inner`}>
        <Icon className="w-5.5 h-5.5" strokeWidth={2.5} />
      </div>
    </div>
    <div className="font-manrope text-[40px] font-extrabold text-[#0F172A] leading-none mb-3 tracking-tighter tabular-nums">{value}</div>
    <div className="text-[12px] text-[#64748B] font-bold uppercase tracking-[3px]">{label}</div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDF8EE] rounded-bl-[100px] pointer-events-none group-hover:bg-blue-50 transition-colors"></div>
  </div>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-center mb-10 px-1">
    <div>
      <h3 className="font-extrabold text-[20px] text-[#0F172A] tracking-tight uppercase font-manrope">{title}</h3>
      <p className="text-[13px] text-[#64748B] mt-1.5 font-medium font-inter">{subtitle}</p>
    </div>
    {action && <button className="text-[11px] font-black text-[#3B82F6] hover:bg-blue-50 transition-all font-manrope uppercase tracking-widest px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">{action}</button>}
  </div>
);

import { requestProviderStatus } from '../../../firestore/providerDb';
import { getOwnerStats } from '../../../firestore/ownerDb';

const OwnerDashboard = () => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const userName = profile?.fullName || user?.email?.split('@')[0] || t('user');
  const [stats, setStats] = useState({ totalSessions: 0, totalSpent: 0, totalKwh: 0, ecoScore: 0, usageData: [], loading: true });

  useEffect(() => {
    if (user?.uid) {
      getOwnerStats(user.uid).then(res => setStats({ ...res, loading: false }));
    }
  }, [user?.uid]);

  const handleRequestStatus = async () => {
    if (window.confirm(t('requestProviderConfirm'))) {
       try {
          await requestProviderStatus(user.uid, {
             name: profile?.fullName || user.email,
             email: user.email,
             location: profile?.address || 'Private Home',
             uid: user.uid
          });
          alert(t('requestProviderSuccess'));
       } catch (err) {
          console.error(err);
          alert(t('requestProviderFail'));
       }
    }
  };

  return (
    <DashboardLayout title={t('stationControl')}>
      {/* Complete Profile Prompt for Guest/New Users */}
      {!profile?.isProfileComplete && (
        <div className="mb-12 p-10 bg-white border-2 border-[#E2E8F0] rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[120px] pointer-events-none"></div>
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-[28px] bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shadow-inner">
                 <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                 <h4 className="text-[#0F172A] font-extrabold text-2xl tracking-tighter uppercase font-manrope">{t('completeProfileTitle') || 'Finish Your Registration'}</h4>
                 <p className="text-[#64748B] text-[15px] font-medium mt-1">{t('completeProfileDesc') || 'Get full access to charging history and bookings by completing your profile.'}</p>
              </div>
           </div>
           <Link 
             to="/register" 
             className="px-10 py-5 bg-amber-500 text-black font-black text-[11px] uppercase tracking-widest rounded-3xl hover:scale-105 transition-all shadow-xl shadow-amber-500/30 relative z-10"
           >
              {t('completeNow') || 'Complete Now'}
           </Link>
        </div>
      )}

      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <h1 className="font-manrope text-5xl font-extrabold text-[#0F172A] tracking-tighter italic uppercase">
               {t('activeOverview').split('.')[0]} <span className="text-[#3B82F6]">{t('activeOverview').split('.')[1]}</span>
            </h1>
            <p className="text-[#64748B] mt-3 font-medium font-inter flex items-center gap-2">
               {t('authenticatedAs')} <span className="text-[#0F172A] font-extrabold">{userName}</span> 
               <span className="w-1.5 h-1.5 rounded-full bg-[#E2E8F0]"></span>
               <span className="text-[#3B82F6] font-black text-[10px] uppercase tracking-widest">@owner</span>
            </p>
         </div>
         <div className="px-6 py-3 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-3 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">{t('verifiedIdentity')}</span>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <StatCard icon={Car} color="bg-blue-50 text-blue-600" value="1" label={t('activeVehicle')} delay="delay-0" />
        <StatCard icon={History} color="bg-emerald-50 text-emerald-600" value={stats.loading ? '...' : stats.totalSessions} label={t('totalSessions')} delay="delay-75" />
        <StatCard icon={CreditCard} color="bg-amber-50 text-amber-600" value={stats.loading ? '...' : `Rs. ${stats.totalSpent.toLocaleString()}`} label={t('totalSpent')} delay="delay-150" />
        <StatCard icon={TrendingUp} color="bg-purple-50 text-purple-600" value={stats.loading ? '...' : `${stats.ecoScore}%`} label={t('ecoScore')} delay="delay-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        <div className="lg:col-span-2 bg-white border-2 border-[#E2E8F0] rounded-[48px] overflow-hidden p-12 hover:border-[#3B82F6]/30 transition-all shadow-2xl relative font-inter">
          <SectionHeader title={t('usageAnalytics')} subtitle={t('usageSubtitle')} action={t('fullReport')} />
          <div className="h-[220px] flex items-end gap-4 mt-16 px-2 relative z-10 opacity-30">
            {[20, 35, 48, 28, 45, 32, 50].map((v, i) => (
              <div key={i} className="flex-1 flex items-end gap-2 h-full">
                <div style={{ height: `${v}%` }} className="flex-1 bg-gradient-to-t from-blue-100 to-[#3B82F6] rounded-t-xl transition-all cursor-pointer hover:scale-x-110"></div>
                <div style={{ height: `${v * 0.25}%` }} className="flex-1 bg-gradient-to-t from-emerald-100 to-emerald-500 rounded-t-xl transition-all cursor-pointer hover:scale-x-110"></div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none"></div>
        </div>

        <div className="bg-white border-2 border-[#E2E8F0] rounded-[48px] p-12 hover:border-[#3B82F6]/30 transition-all shadow-2xl font-inter relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px]"></div>
          <SectionHeader title={t('currentPlan')} subtitle={t('planSubtitle')} />
          <div className="flex justify-center p-6 my-4 relative z-10">
             <div className="relative w-44 h-44 flex items-center justify-center group">
                <svg className="w-full h-full -rotate-90 group-hover:scale-105 transition-transform duration-700" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="10"/>
                   <circle cx="50" cy="50" r="42" fill="none" stroke="#3B82F6" strokeWidth="10" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="64" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-manrope">
                   <div className="font-black text-[32px] text-[#0F172A] tracking-tighter leading-none">{t('gold')}</div>
                   <div className="text-[10px] font-black text-[#64748B] uppercase tracking-[3px] mt-2">{t('tier')}</div>
                </div>
             </div>
          </div>
          <div className="space-y-5 border-t border-[#E2E8F0] pt-10 mt-6 relative z-10">
             <div className="flex justify-between text-[13px] font-bold uppercase tracking-widest"><span className="text-[#64748B]">{t('energyConsumed') || 'Energy Consumed'}</span><span className="text-[#3B82F6] font-black tabular-nums">{stats.totalKwh.toFixed(1)} kWh</span></div>
             <div className="flex justify-between items-center"><span className="text-[#64748B] text-[11px] font-black uppercase tracking-[3px]">{t('totalSaved') || 'Estimated Savings'}</span><span className="text-[#0F172A] text-2xl font-black font-manrope tabular-nums">Rs. {(stats.totalSpent * 0.15).toLocaleString()}</span></div>
          </div>
        </div>
      </div>

      {/* Monetization Invite / Status */}
      {!profile?.isProviderEnabled && (
         <div className="bg-white border-2 border-[#E2E8F0] rounded-[48px] p-12 lg:p-20 relative overflow-hidden group shadow-2xl animate-fade-up delay-300">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] pointer-events-none group-hover:bg-blue-500/10 transition-all duration-1000"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
               <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-blue-50 border border-blue-100 text-[#3B82F6] text-[10px] font-black uppercase tracking-[4px] mb-10 shadow-sm">{t('exclusiveOpportunity')}</div>
                  <h2 className="text-4xl lg:text-6xl font-extrabold text-[#0F172A] font-manrope uppercase tracking-tighter leading-none mb-8">{t('ownHomeCharger')} <span className="text-[#3B82F6]">{t('startEarning')}</span></h2>
                  <p className="text-[#64748B] text-xl font-medium leading-relaxed max-w-xl font-inter">{t('joinVoltWayGrid')}</p>
               </div>
               <button 
                 onClick={handleRequestStatus}
                 className="px-12 py-7 rounded-[40px] bg-[#3B82F6] text-white text-[14px] font-black uppercase tracking-[4px] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-500/30 whitespace-nowrap"
               >
                 {t('requestProviderStatus')}
               </button>
            </div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none"></div>
         </div>
      )}

      {profile?.isProviderEnabled && (
         <div className="bg-white border-2 border-[#E2E8F0] rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 font-inter mb-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px]"></div>
            <div className="flex items-center gap-6 relative z-10">
               <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner"><Fuel className="w-8 h-8" /></div>
               <div>
                  <h4 className="text-[#0F172A] font-black text-2xl uppercase tracking-tighter">{t('hostingNodeActive')}</h4>
                  <p className="text-[#64748B] font-bold text-[15px]">{t('manageStationDesc')}</p>
               </div>
            </div>
            <Link to="/provider/stations" className="px-10 py-5 rounded-2xl bg-[#3B82F6] text-white font-black text-[11px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all relative z-10">{t('manageStationBtn')}</Link>
         </div>
      )}
    </DashboardLayout>
  );
};

export default OwnerDashboard;
