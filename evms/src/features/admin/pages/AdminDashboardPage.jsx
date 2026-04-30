import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';
import { PageHeader } from '../components/AdminComponents';
import { getDashboardOverview } from '../../../firestore/dashboardDb';
import { performBackup, performRecovery } from '../../../firestore/backupDb';
import { auditDb } from '../../../firestore/auditDb';
import { Zap, MapPin, Calendar, PieChart, Activity, Fuel, Users, BarChart3, Database, Download, Upload, Receipt, Heart, ShieldCheck, Cpu, Cloud, Clock } from 'lucide-react';
import { useLanguage } from '../../../shared/context/LanguageContext';

const StatCard = ({ icon: Icon, color, change, value, label, delay }) => (
  <div className={`p-8 bg-[#FFFFFF] rounded-3xl relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all animate-fade-up ${delay} shadow-[0_4px_20px_rgba(0,0,0,0.04)] font-inter`}>
    <div className="flex justify-between items-start mb-8 relative z-10 font-inter">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[18px] ${color} shadow-sm`}>
        <Icon className="w-5.5 h-5.5" strokeWidth={2.5} />
      </div>
      {change && (
        <div className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg font-manrope tracking-widest ${change.startsWith('↑') ? 'text-[#10B981] bg-[#10B981]/10' : 'text-red-500 bg-red-500/10'}`}>
          {change}
        </div>
      )}
    </div>
    <div className="font-manrope text-[40px] font-extrabold text-[#0F172A] leading-none mb-3 tracking-tighter relative z-10">{value}</div>
    <div className="text-[12px] text-[#94A3B8] font-bold uppercase tracking-[3px] relative z-10">{label}</div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDF8EE] rounded-bl-[100px] pointer-events-none group-hover:bg-[#F1F5F9] transition-colors"></div>
  </div>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-center mb-10 px-1 font-manrope">
    <div>
      <h3 className="font-extrabold text-[20px] text-[#0F172A] tracking-tight uppercase">{title}</h3>
      <p className="text-[13px] text-[#475569] font-medium mt-1.5 font-inter">{subtitle}</p>
    </div>
    {action && <button onClick={action.onClick} className="text-[11px] font-extrabold text-[#3B82F6] hover:bg-[#F1F5F9] transition-all font-manrope uppercase tracking-widest bg-[#FFFFFF] shadow-[0_2px_10px_rgba(0,0,0,0.04)] px-4 py-2 rounded-xl">{action.label}</button>}
  </div>
);

const HealthMetric = ({ icon: Icon, label, value, status }) => (
  <div className="bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 rounded-[32px] flex items-center gap-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all group">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${status === 'healthy' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>
      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
    </div>
    <div>
      <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[2px] mb-1">{label}</div>
      <div className="text-[15px] font-black text-[#0F172A] uppercase tracking-tight">{value}</div>
    </div>
    <div className="ml-auto">
      <div className={`w-2 h-2 rounded-full ${status === 'healthy' ? 'bg-[#10B981] animate-pulse' : 'bg-[#F59E0B]'} shadow-[0_0_12px_rgba(16,185,129,0.5)]`}></div>
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
        <StatCard icon={Fuel} color="bg-[#10B981]/10 text-[#10B981]" value={data?.activeStations || 0} label={t('stations')} delay="delay-0" />
        <StatCard icon={Zap} color="bg-[#F59E0B]/10 text-[#F59E0B]" value={data?.recentSessions?.length || 0} label="Active Sessions" delay="delay-75" />
        <StatCard icon={Users} color="bg-[#3B82F6]/10 text-[#3B82F6]" value={data?.totalUsers || 0} label={t('users')} delay="delay-150" />
        <StatCard icon={Receipt} color="bg-[#7C3AED]/10 text-[#7C3AED]" value={`Rs. ${data?.platformEarnings?.toLocaleString() || 0}`} label="Platform Revenue" delay="delay-200" />
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
          
          <div className="mt-10 p-10 bg-[#FFFFFF] shadow-[0_4px_24px_rgba(0,0,0,0.05)] rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex items-center gap-6 text-center md:text-left">
                <div className="w-16 h-16 rounded-3xl bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6]"><ShieldCheck className="w-8 h-8" /></div>
                <div>
                   <h4 className="text-xl font-black text-[#0F172A] uppercase tracking-tight">Snapshot Engine</h4>
                   <p className="text-[#475569] text-[13px] font-medium mt-1">Manual synchronization and backup active.</p>
                </div>
             </div>
             <button 
               onClick={handleBackup}
               className="px-10 py-5 rounded-3xl bg-[#3B82F6] text-[#FFFFFF] text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3 shadow-lg shadow-[#3B82F6]/30"
             >
               <Database className="w-4 h-4" /> Trigger Manual Backup
             </button>
          </div>
          {bkpMsg && <p className="mt-4 ml-6 text-[10px] font-bold text-[#10B981] uppercase tracking-widest animate-fade-in">{bkpMsg}</p>}
        </div>

        {/* Audit Logs Section */}
        <div className="lg:col-span-1">
          <SectionHeader title="Audit Logs" subtitle="Recent administrative actions." />
          <div className="bg-[#FFFFFF] shadow-[0_4px_24px_rgba(0,0,0,0.04)] rounded-[40px] p-8 h-[450px] flex flex-col font-inter">
             <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2">
                {logs.length > 0 ? logs.map((log) => (
                  <div key={log.id} className="group border-l-2 border-[#E2E8F0] pl-5 py-1 hover:border-[#3B82F6] transition-all">
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="text-[10px] font-black text-[#3B82F6] uppercase tracking-widest">{log.action?.replace('_', ' ')}</div>
                      <div className="text-[9px] font-bold text-[#94A3B8]">{log.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <p className="text-[12px] font-bold text-[#475569] tracking-tight mb-1">{log.details}</p>
                    <div className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest">{log.user}</div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-40 text-center pt-20">
                    <Clock className="w-12 h-12 mb-4 text-[#94A3B8]" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">No Recent Logs</p>
                  </div>
                )}
             </div>
             <button className="w-full mt-auto pt-6 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest hover:text-[#3B82F6] transition-colors border-t border-[#E2E8F0]">View Full Ledger →</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
