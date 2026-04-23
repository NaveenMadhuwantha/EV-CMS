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
  <div className={`p-6 bg-[#0a1628] border border-[#00d2b4]/10 rounded-2xl relative overflow-hidden group hover:border-[#00d2b4]/40 hover:-translate-y-1 transition-all animate-fade-up ${delay} shadow-sm font-inter`}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d2b4] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex justify-between items-start mb-6">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-[18px] ${color} shadow-lg shadow-[#000]/10`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="font-manrope text-[32px] font-extrabold text-[#e2eaf8] leading-none mb-1.5 tracking-tight">{value}</div>
    <div className="text-[13px] text-[#7a9bbf] font-semibold opacity-70 uppercase tracking-wider">{label}</div>
  </div>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-center mb-6 px-1">
    <div>
      <h3 className="font-manrope font-bold text-[16px] text-white tracking-tight">{title}</h3>
      <p className="text-[12px] text-[#7a9bbf] mt-0.5 font-medium opacity-60 font-inter">{subtitle}</p>
    </div>
    {action && <button className="text-[12px] font-bold text-[#00d2b4] hover:brightness-125 transition-all font-inter uppercase tracking-widest">{action}</button>}
  </div>
);

import { requestProviderStatus } from '../../../firestore/providerDb';

const OwnerDashboard = () => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const userName = profile?.fullName || user?.email?.split('@')[0] || t('user');

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
      <div className="mb-10 pl-1 flex justify-between items-start">
         <div>
            <h1 className="font-manrope text-4xl font-extrabold text-white tracking-tight italic">
               {t('activeOverview').split('.')[0]} <span className="text-[#00d2b4]">{t('activeOverview').split('.')[1]}</span>
            </h1>
            <p className="text-[#7a9bbf] mt-2 font-medium font-inter opacity-70">
               {t('authenticatedAs')} <span className="text-white font-bold">{userName}</span> 
               <span className="mx-2 opacity-30">|</span> 
               <span className="text-[#00d2b4] font-bold lowercase tracking-tighter">@owner</span>
            </p>
         </div>
         <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 shadow-inner">
            <ShieldCheck className="w-5 h-5 text-[#00d2b4]" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{t('verifiedIdentity')}</span>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={Car} color="bg-[#00d2b4]/10 text-[#00d2b4]" value="1" label={t('activeVehicle')} delay="delay-0" />
        <StatCard icon={History} color="bg-blue-500/10 text-blue-400" value="0" label={t('totalSessions')} delay="delay-75" />
        <StatCard icon={CreditCard} color="bg-amber-500/10 text-amber-500" value="Rs. 0" label={t('totalSpent')} delay="delay-150" />
        <StatCard icon={TrendingUp} color="bg-purple-500/10 text-purple-500" value="84%" label={t('ecoScore')} delay="delay-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-[#0a1628] border border-[#00d2b4]/10 rounded-3xl overflow-hidden p-8 hover:border-[#00d2b4]/30 transition-all shadow-xl relative font-inter">
          <SectionHeader title={t('usageAnalytics')} subtitle={t('usageSubtitle')} action={t('fullReport')} />
          <div className="h-[200px] flex items-end gap-3 mt-12 px-2 group opacity-30">
            {[20, 35, 48, 28, 45, 32, 50].map((v, i) => (
              <div key={i} className="flex-1 flex items-end gap-1.5 h-full">
                <div style={{ height: `${v}%` }} className="flex-1 bg-gradient-to-t from-[#00d2b4]/20 to-[#00d2b4] rounded-t-lg transition-all cursor-pointer"></div>
                <div style={{ height: `${v * 0.25}%` }} className="flex-1 bg-gradient-to-t from-[#0094ff]/20 to-[#0094ff] rounded-t-lg transition-all cursor-pointer"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0a1628] border border-[#00d2b4]/10 rounded-3xl p-8 hover:border-[#00d2b4]/30 transition-all shadow-xl font-inter">
          <SectionHeader title={t('currentPlan')} subtitle={t('planSubtitle')} />
          <div className="flex justify-center p-6 my-4">
             <div className="relative w-36 h-36 flex items-center justify-center group">
                <svg className="w-full h-full -rotate-90 group-hover:scale-105 transition-transform duration-500" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10"/>
                   <circle cx="50" cy="50" r="42" fill="none" stroke="#00d2b4" strokeWidth="10" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="64" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-manrope">
                   <div className="font-extrabold text-[28px] text-white tracking-tight leading-none">{t('gold')}</div>
                   <div className="text-[10px] font-bold text-[#3a5a7a] uppercase tracking-widest mt-1">{t('tier')}</div>
                </div>
             </div>
          </div>
          <div className="space-y-4 border-t border-white/5 pt-8 mt-6">
             <div className="flex justify-between text-[14px]"><span className="text-[#7a9bbf] font-medium">{t('creditsLeft')}</span><span className="text-[#00d2b4] font-bold">500 kWh</span></div>
             <div className="flex justify-between text-[14px]"><span className="text-[#7a9bbf] font-medium">{t('totalSaved')}</span><span className="text-white font-extrabold font-manrope">Rs. 4,500</span></div>
          </div>
        </div>
      </div>

      {/* Monetization Invite / Status */}
      {!profile?.isProviderEnabled && (
         <div className="bg-gradient-to-br from-[#00d2b4]/20 to-blue-600/10 border-2 border-dashed border-[#00d2b4]/20 rounded-[48px] p-12 lg:p-20 relative overflow-hidden group shadow-2xl animate-fade-up delay-300">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00d2b4]/5 blur-[120px] pointer-events-none group-hover:bg-[#00d2b4]/10 transition-all duration-1000"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
               <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#00d2b4]/10 border border-[#00d2b4]/20 text-[#00d2b4] text-[10px] font-black uppercase tracking-[4px] mb-8 shadow-sm">{t('exclusiveOpportunity')}</div>
                  <h2 className="text-4xl lg:text-5xl font-extrabold text-white font-manrope uppercase tracking-tighter leading-none mb-6">{t('ownHomeCharger')} <span className="text-[#00d2b4]">{t('startEarning')}</span></h2>
                  <p className="text-[#8AAFC8] text-lg font-medium leading-relaxed opacity-80 max-w-xl font-inter">{t('joinVoltWayGrid')}</p>
               </div>
               <button 
                 onClick={handleRequestStatus}
                 className="px-12 py-6 rounded-[32px] bg-[#00d2b4] text-[#050c14] text-[13px] font-black uppercase tracking-[4px] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#00d2b4]/30 whitespace-nowrap"
               >
                 {t('requestProviderStatus')}
               </button>
            </div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none"></div>
         </div>
      )}

      {profile?.isProviderEnabled && (
         <div className="bg-[#00d2b4]/5 border border-[#00d2b4]/20 rounded-[32px] p-8 flex items-center justify-between font-inter mb-10">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 rounded-2xl bg-[#00d2b4]/10 flex items-center justify-center text-[#00d2b4] shadow-inner"><Fuel className="w-7 h-7" /></div>
               <div>
                  <h4 className="text-white font-black text-xl uppercase tracking-tighter">{t('hostingNodeActive')}</h4>
                  <p className="text-[#4E7A96] font-bold text-sm opacity-70">{t('manageStationDesc')}</p>
               </div>
            </div>
            <Link to="/provider/stations" className="px-8 py-3 rounded-xl bg-[#00d2b4] text-[#050c14] font-black text-[11px] uppercase tracking-widest shadow-xl">{t('manageStationBtn')}</Link>
         </div>
      )}
    </DashboardLayout>
  );
};

export default OwnerDashboard;
