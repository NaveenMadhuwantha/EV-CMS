import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';
import { useAuth } from '../../auth/context/AuthContext';
import { getStationsByProvider } from '../../../firestore/stationDb';
import { getBookingsByProvider } from '../../../firestore/bookingDb';
import { 
  Zap, MapPin, Calendar, PieChart, 
  Activity, ShieldCheck, Loader2
} from 'lucide-react';
import { useLanguage } from '../../../shared/context/LanguageContext';

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

const ProviderDashboard = () => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const userName = profile?.businessName || user?.email?.split('@')[0] || 'Provider';
  
  const [stats, setStats] = useState({
     hubs: 0,
     dailyEarnings: 0,
     totalEarnings: 0,
     reservations: 0,
     loading: true
  });

  useEffect(() => {
     const loadStats = async () => {
        if (!user) return;
        try {
           const stations = await getStationsByProvider(user.uid);
           const providerBk = await getBookingsByProvider(user.uid);
           
           const today = new Date().toISOString().split('T')[0];
           const todayBk = providerBk.filter(b => b.date === today);
           
           const dYld = todayBk.reduce((sum, b) => sum + parseFloat(b.providerEarnings || 0), 0);
           const tYld = providerBk.reduce((sum, b) => sum + parseFloat(b.providerEarnings || 0), 0);
           
           setStats({
              hubs: stations.length,
              dailyEarnings: dYld,
              totalEarnings: tYld,
              reservations: providerBk.length,
              loading: false
           });
        } catch (err) {
           console.error(err);
           setStats(s => ({ ...s, loading: false }));
        }
     };
     loadStats();
  }, [user]);

  if (stats.loading) return (
     <DashboardLayout title="Station Control">
        <div className="flex flex-col items-center justify-center py-40 opacity-30">
           <Loader2 className="w-12 h-12 text-[#00d2b4] animate-spin mb-4" />
           <div className="text-[12px] font-bold uppercase tracking-widest text-[#4E7A96]">{t('syncingProviderMatrix')}</div>
        </div>
     </DashboardLayout>
  );

  return (
    <DashboardLayout title="Station Control">
      {/* Complete Profile Prompt for Guest Providers */}
      {!profile?.isProfileComplete && (
        <div className="mb-8 p-6 bg-gradient-to-r from-[#00d2b4]/10 to-blue-600/10 border border-[#00d2b4]/20 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-[#00d2b4]/10 flex items-center justify-center text-[#00d2b4]">
                 <Activity className="w-6 h-6" />
              </div>
              <div>
                 <h4 className="text-white font-bold text-lg">Activate Provider Tools</h4>
                 <p className="text-[#7a9bbf] text-sm">Complete your provider registration to start adding and managing charging stations.</p>
              </div>
           </div>
           <Link 
             to="/provider/register" 
             className="px-8 py-3 bg-[#00d2b4] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
           >
              Setup Now
           </Link>
        </div>
      )}

      <div className="mb-10 pl-1 flex justify-between items-start">
         <div>
            <h1 className="font-manrope text-4xl font-extrabold text-white tracking-tight italic">
               {t('stationOverview').split('.')[0]} <span className="text-[#00d2b4]">{t('stationOverview').split('.')[1]}</span>
            </h1>
            <p className="text-[#7a9bbf] mt-2 font-medium font-inter opacity-70">
               {t('authenticatedAs')} <span className="text-white font-bold">{userName}</span> 
               <span className="mx-2 opacity-30">|</span> 
               <span className="text-[#00d2b4] font-bold lowercase tracking-tighter">@provider</span>
            </p>
         </div>
         <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 shadow-inner">
            <ShieldCheck className="w-5 h-5 text-[#00d2b4]" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{t('verifiedProvider')}</span>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
         <StatCard icon={Zap} color="bg-[#00d2b4]/10 text-[#00d2b4]" value={stats.hubs} label={t('activeStations')} delay="delay-0" />
         <StatCard icon={PieChart} color="bg-[#0094ff]/10 text-[#0094ff]" value={`Rs. ${stats.dailyEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} label={t('dailyEarnings')} delay="delay-75" />
         <StatCard icon={Calendar} color="bg-amber-500/10 text-amber-500" value={stats.reservations} label={t('reservations')} delay="delay-150" />
         <StatCard icon={Activity} color="bg-purple-500/10 text-purple-500" value="99.9%" label={t('uptimeHealth')} delay="delay-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-[#0a1628] border border-[#00d2b4]/10 rounded-3xl overflow-hidden p-8 hover:border-[#00d2b4]/30 transition-all shadow-xl relative font-inter">
          <SectionHeader title={t('revenueInsights')} subtitle={t('monthlyGridDesc')} action={t('fullReport')} />
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
          <SectionHeader title={t('profitMatrix')} subtitle={t('ecosystemFeeDesc')} />
          <div className="flex justify-center p-6 my-4">
             <div className="relative w-36 h-36 flex items-center justify-center group">
                <svg className="w-full h-full -rotate-90 group-hover:scale-105 transition-transform duration-500" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10"/>
                   <circle cx="50" cy="50" r="42" fill="none" stroke="#00d2b4" strokeWidth="10" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="200" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-manrope">
                   <div className="font-extrabold text-[28px] text-white tracking-tight leading-none">25%</div>
                   <div className="text-[10px] font-bold text-[#3a5a7a] uppercase tracking-widest mt-1">{t('fee')}</div>
                </div>
             </div>
          </div>
          <div className="space-y-4 border-t border-white/5 pt-8 mt-6">
             <div className="flex justify-between text-[14px]"><span className="text-[#7a9bbf] font-medium">{t('platformFee')}</span><span className="text-[#00d2b4] font-bold">25.0%</span></div>
             <div className="flex justify-between text-[14px]"><span className="text-[#7a9bbf] font-medium">{t('totalMargin')}</span><span className="text-white font-extrabold font-manrope">Rs. {stats.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProviderDashboard;
