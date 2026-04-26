import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';
import { PageHeader } from '../components/AdminComponents';
import { getDashboardOverview } from '../../../firestore/dashboardDb';
import { performBackup, performRecovery } from '../../../firestore/backupDb';
import { auditDb } from '../../../firestore/auditDb';
import { Zap, MapPin, Calendar, PieChart, Activity, Fuel, Users, BarChart3, Database, Download, Upload, Receipt, Heart, ShieldCheck, Cpu, Cloud, Clock } from 'lucide-react';
import { useLanguage } from '../../../shared/context/LanguageContext';

const StatCard = ({ icon: Icon, color, change, value, label, delay }) => (
  <div className={`p-8 bg-[#0a1628]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-3xl relative overflow-hidden group hover:border-[#00d2b4]/40 hover:-translate-y-1 transition-all animate-fade-up ${delay} shadow-sm font-inter`}>
    <div className="flex justify-between items-start mb-8 relative z-10 font-inter">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[18px] ${color} shadow-lg shadow-[#000]/20`}>
        <Icon className="w-5.5 h-5.5" strokeWidth={2.5} />
      </div>
      {change && (
        <div className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg font-manrope tracking-widest ${change.startsWith('↑') ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/10' : 'text-red-400 bg-red-500/10 border border-red-500/10'}`}>
          {change}
        </div>
      )}
    </div>
    <div className="font-manrope text-[40px] font-extrabold text-white leading-none mb-3 tracking-tighter relative z-10">{value}</div>
    <div className="text-[12px] text-[#4E7A96] font-bold uppercase tracking-[3px] opacity-70 relative z-10">{label}</div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-bl-[100px] pointer-events-none group-hover:bg-white/[0.02] transition-colors"></div>
  </div>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-center mb-10 px-1 font-manrope">
    <div>
      <h3 className="font-extrabold text-[20px] text-white tracking-tight uppercase">{title}</h3>
      <p className="text-[13px] text-[#8AAFC8] font-medium opacity-60 mt-1.5 font-inter">{subtitle}</p>
    </div>
    {action && <button onClick={action.onClick} className="text-[11px] font-extrabold text-[#00d2b4] hover:brightness-125 transition-all font-manrope uppercase tracking-widest border border-white/5 bg-white/5 px-4 py-2 rounded-xl">{action.label}</button>}
  </div>
);

const HealthMetric = ({ icon: Icon, label, value, status }) => (
  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px] flex items-center gap-5 hover:bg-white/[0.04] transition-all group">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'}`}>
      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
    </div>
    <div>
      <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-[2px] mb-1 opacity-60">{label}</div>
      <div className="text-[15px] font-black text-white uppercase tracking-tight">{value}</div>
    </div>
    <div className="ml-auto">
      <div className={`w-2 h-2 rounded-full ${status === 'healthy' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'} shadow-[0_0_12px_rgba(16,185,129,0.5)]`}></div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState({ 
    activeStations: 0, 
    totalBookings: 0, 
    totalUsers: 0,
    totalRevenue: 0,
    platformEarnings: 0,
    recentSessions: [], 
    commissionRate: 0, 
    loading: true 
  });
  const [logs, setLogs] = useState([]);
  const [bkpMsg, setBkpMsg] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
     getDashboardOverview().then(res => setData({ ...res, loading: false }));
     const unsub = auditDb.streamLogs(setLogs);
     return () => unsub();
  }, []);

  const handleBackup = async () => {
    try {
      await performBackup();
      setBkpMsg('Backup successful.');
    } catch (e) { setBkpMsg('Backup failed.'); }
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="mb-16">
        <PageHeader title={t('systemOverview')} subtitle="Global infrastructure and network metrics in real-time." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        <StatCard icon={Fuel} color="bg-[#00d2b4]/10 text-[#00d2b4]" value={data?.activeStations || 0} label={t('stations')} delay="delay-0" />
        <StatCard icon={Zap} color="bg-amber-500/10 text-amber-500" value={data?.recentSessions?.length || 0} label="Active Sessions" delay="delay-75" />
        <StatCard icon={Users} color="bg-blue-500/10 text-blue-500" value={data?.totalUsers || 0} label={t('users')} delay="delay-150" />
        <StatCard icon={Receipt} color="bg-purple-500/10 text-purple-500" value={`Rs. ${data?.platformEarnings?.toLocaleString() || 0}`} label="Platform Revenue" delay="delay-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
        {/* System Health Section */}
        <div className="lg:col-span-2">
          <SectionHeader title="Infrastructure Health" subtitle="Live diagnostic data from the VoltWay node network." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <HealthMetric icon={Cpu} label="Core Engine" value="Operational" status="healthy" />
             <HealthMetric icon={Database} label="Sync Engine" value="Active (9ms)" status="healthy" />
             <HealthMetric icon={Cloud} label="Node Gateway" value="Live" status="healthy" />
             <HealthMetric icon={Clock} label="Latency" value="12ms avg" status="healthy" />
          </div>
          
          <div className="mt-10 p-10 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex items-center gap-6 text-center md:text-left">
                <div className="w-16 h-16 rounded-3xl bg-[#00d2b4]/10 flex items-center justify-center text-[#00d2b4] shadow-inner"><ShieldCheck className="w-8 h-8" /></div>
                <div>
                   <h4 className="text-xl font-black text-white uppercase tracking-tight">Snapshot Engine</h4>
                   <p className="text-[#8AAFC8] text-[13px] font-medium opacity-60 mt-1">Manual synchronization and backup active.</p>
                </div>
             </div>
             <button 
               onClick={handleBackup}
               className="px-10 py-5 rounded-3xl bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#00d2b4] hover:text-[#050c14] transition-all flex items-center gap-3 shadow-xl"
             >
               <Database className="w-4 h-4" /> Trigger Manual Backup
             </button>
          </div>
          {bkpMsg && <p className="mt-4 ml-6 text-[10px] font-bold text-[#00d2b4] uppercase tracking-widest animate-fade-in">{bkpMsg}</p>}
        </div>

        {/* Audit Logs Section */}
        <div className="lg:col-span-1">
          <SectionHeader title="Audit Logs" subtitle="Recent administrative actions." />
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 h-[450px] flex flex-col font-inter">
             <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2">
                {logs.length > 0 ? logs.map((log) => (
                  <div key={log.id} className="group border-l-2 border-white/10 pl-5 py-1 hover:border-[#00d2b4] transition-all">
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="text-[10px] font-black text-[#00d2b4] uppercase tracking-widest">{log.action?.replace('_', ' ')}</div>
                      <div className="text-[9px] font-bold text-[#4E7A96] opacity-40">{log.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <p className="text-[12px] font-bold text-white tracking-tight opacity-80 mb-1">{log.details}</p>
                    <div className="text-[9px] font-bold text-[#4E7A96] uppercase tracking-widest opacity-40">{log.user}</div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 text-center pt-20">
                    <Clock className="w-12 h-12 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No Recent Logs</p>
                  </div>
                )}
             </div>
             <button className="w-full mt-auto pt-6 text-[10px] font-black text-[#4E7A96] uppercase tracking-widest hover:text-white transition-colors border-t border-white/5">View Full Ledger →</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
