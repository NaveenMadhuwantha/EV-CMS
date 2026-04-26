import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';
import { PageHeader } from '../components/AdminComponents';
import { getAllStations } from '../../../firestore/stationDb';
import { createBooking, getAllBookings, updateBookingStatus } from '../../../firestore/bookingDb';
import { Loader2, Clock, MapPin, Zap, ShieldCheck, BarChart3, CheckCircle2, Activity, DollarSign, Search, Filter } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import { useLanguage } from '../../../shared/context/LanguageContext';

const ChargingTimer = ({ startTime, durationHours, size = 'small' }) => {
  const [timeLeft, setTimeLeft] = useState(durationHours * 3600);
  const totalSeconds = durationHours * 3600;

  useEffect(() => {
    const start = startTime?.seconds ? startTime.seconds * 1000 : startTime instanceof Date ? startTime.getTime() : Date.now();
    const end = start + (durationHours * 3600 * 1000);
    
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, durationHours]);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  const percentage = Math.max(0, Math.min(100, (timeLeft / totalSeconds) * 100));

  if (size === 'large') {
    return (
       <div className="flex items-center gap-8 bg-white/5 p-6 rounded-[24px] border border-white/10 backdrop-blur-md shadow-inner">
          <div className="relative w-20 h-20 flex items-center justify-center">
             <svg className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="36" className="stroke-white/5 fill-none" strokeWidth="6" />
                <circle 
                   cx="40" cy="40" r="36" 
                   className={`fill-none transition-all duration-1000 ${timeLeft < 300 ? 'stroke-red-500' : 'stroke-[#00d2b4]'}`} 
                   strokeWidth="6" 
                   strokeDasharray="226.2" 
                   strokeDashoffset={226.2 - (226.2 * (100 - percentage) / 100)}
                   strokeLinecap="round"
                />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center">
                <Zap className={`w-6 h-6 ${timeLeft < 300 ? 'text-red-500' : 'text-[#00d2b4]'} animate-pulse`} />
             </div>
          </div>
          <div className="flex flex-col">
             <div className="text-4xl font-black font-manrope text-white tracking-tighter tabular-nums">
                <span className={timeLeft < 300 ? 'text-red-400' : 'text-white'}>{h.toString().padStart(2, '0')}:</span>
                <span className={timeLeft < 300 ? 'text-red-400' : 'text-white'}>{m.toString().padStart(2, '0')}:</span>
                <span className={timeLeft < 300 ? 'text-red-400' : 'text-[#00d2b4]'}>{s.toString().padStart(2, '0')}</span>
             </div>
             <div className="flex justify-between items-center mt-2">
                <div className="text-[9px] font-black text-[#4E7A96] uppercase tracking-[3px] opacity-60">REMAINING</div>
                <div className="text-[9px] font-black text-[#00d2b4] uppercase tracking-widest">{Math.round(100 - percentage)}% DONE</div>
             </div>
          </div>
       </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm">
      <div className="w-1.5 h-1.5 rounded-full bg-[#00d2b4] animate-pulse"></div>
      <span className="text-[#00d2b4] font-black font-manrope text-[12px] tracking-tight tabular-nums">
        {h.toString().padStart(2, '0')}:{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export const BookSlot = () => {
  const { role, profile } = useAuth();
  const [stations, setStations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(1);
  const [bookingData, setBookingData] = useState({
    stationId: '',
    date: '',
    time: '',
    userName: '',
    vehicleNo: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sData, bData] = await Promise.all([getAllStations(), getAllBookings()]);
      setStations(sData);
      setBookings(bData);
      if (sData.length > 0 && !bookingData.stationId) setBookingData(prev => ({ ...prev, stationId: sData[0].id }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedStation = stations.find(s => s.id === bookingData.stationId);
  const rate = parseFloat(selectedStation?.price || 0);
  const totalCost = rate * duration;
  const platformCommission = totalCost * 0.25;
  const providerEarnings = totalCost - platformCommission;

  const handleBooking = async () => {
    if (!bookingData.userName || !bookingData.date || !bookingData.time) {
      alert("Please fill all fields.");
      return;
    }
    try {
      setLoading(true);
      await createBooking({
        ...bookingData,
        stationName: selectedStation?.name || 'Unknown Station',
        location: selectedStation?.location || 'Unknown',
        rate: rate,
        duration: duration,
        totalCost: totalCost,
        platformCommission: platformCommission,
        providerEarnings: providerEarnings
      });
      alert("Booking Confirmed!");
      setBookingData({ ...bookingData, userName: '', vehicleNo: '', date: '', time: '' });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async (b) => {
    const start = b.startTime?.seconds ? b.startTime.seconds * 1000 : b.startTime instanceof Date ? b.startTime.getTime() : Date.now();
    const now = Date.now();
    const elapsedHours = Math.max(0.01, (now - start) / (3600 * 1000));
    const actualTotalCost = b.rate * elapsedHours;
    const actualCommission = actualTotalCost * 0.25;
    const actualEarnings = actualTotalCost - actualCommission;

    try {
      setLoading(true);
      await updateBookingStatus(b.id, { 
        status: 'COMPLETED',
        endTime: new Date(),
        actualDuration: elapsedHours,
        totalCost: actualTotalCost,
        platformCommission: actualCommission,
        providerEarnings: actualEarnings
      });
      alert(`Charging Terminated.\nDuration: ${(elapsedHours * 60).toFixed(0)} mins\nTotal: Rs. ${actualTotalCost.toFixed(2)}`);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = role === 'admin';
  const { t } = useLanguage();

  return (
    <DashboardLayout title={isAdmin ? t('bookingInsights') : t('bookings')}>
      <PageHeader 
        title={isAdmin ? t('bookingInsights') : t('bookings')} 
        subtitle={isAdmin ? t('bookingInsightsSubtitle') : "Handle customer appointments and grid slot reservations."} 
      />
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 opacity-30">
           <Loader2 className="w-12 h-12 animate-spin mb-6 text-[#00d2b4]" />
           <p className="text-[12px] font-bold uppercase tracking-[4px] text-[#4E7A96]">Syncing Schedule...</p>
        </div>
      ) : !profile?.isProfileComplete ? (
        /* Restricted View for Incomplete Profiles */
        <div className="max-w-4xl mx-auto py-20 text-center font-inter">
           <div className="w-24 h-24 bg-amber-500/10 rounded-[32px] flex items-center justify-center text-amber-500 mx-auto mb-10 border border-amber-500/20 shadow-2xl">
              <ShieldCheck className="w-10 h-10" />
           </div>
           <h2 className="text-4xl font-extrabold text-white mb-6 font-manrope uppercase tracking-tight italic">Registration <span className="text-amber-500">Required</span></h2>
           <p className="text-[#8AAFC8] text-lg font-medium leading-relaxed max-w-2xl mx-auto mb-12 opacity-80">
              To prevent unauthorized grid access, booking slots and managing sessions require a completed profile. Please finish your registration to activate these services.
           </p>
           <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href={profile?.role === 'provider' ? '/provider/register' : '/register'}
                className="px-10 py-5 bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20"
              >
                 Complete Registration Now
              </a>
           </div>
        </div>
      ) : isAdmin ? (
        /* Admin Summary View */
        <div className="space-y-12 font-inter">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#0a1628]/40 border-2 border-dashed border-[#00d2b4]/10 p-8 rounded-[32px] hover:border-[#00d2b4]/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-[#00d2b4]/10 rounded-2xl flex items-center justify-center text-[#00d2b4]"><BarChart3 className="w-6 h-6" /></div>
                <div className="text-[10px] font-black text-[#00d2b4] uppercase tracking-widest bg-[#00d2b4]/5 px-3 py-1.5 rounded-lg">{t('total')}</div>
              </div>
              <div className="text-4xl font-black text-white mb-2 font-manrope">{bookings.length}</div>
              <div className="text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">{t('totalReservations')}</div>
            </div>

            <div className="bg-[#0a1628]/40 border-2 border-dashed border-amber-500/10 p-8 rounded-[32px] hover:border-amber-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500"><Activity className="w-6 h-6" /></div>
                <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/5 px-3 py-1.5 rounded-lg">{t('live')}</div>
              </div>
              <div className="text-4xl font-black text-white mb-2 font-manrope">{bookings.filter(b => b.status === 'CHARGING').length}</div>
              <div className="text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">{t('activeSessions')}</div>
            </div>

            <div className="bg-[#0a1628]/40 border-2 border-dashed border-blue-500/10 p-8 rounded-[32px] hover:border-blue-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500"><CheckCircle2 className="w-6 h-6" /></div>
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/5 px-3 py-1.5 rounded-lg">{t('completed')}</div>
              </div>
              <div className="text-4xl font-black text-white mb-2 font-manrope">{bookings.filter(b => b.status === 'COMPLETED').length}</div>
              <div className="text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">{t('completed')}</div>
            </div>

            <div className="bg-[#0a1628]/40 border-2 border-dashed border-emerald-500/10 p-8 rounded-[32px] hover:border-emerald-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500"><DollarSign className="w-6 h-6" /></div>
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/5 px-3 py-1.5 rounded-lg">{t('net')}</div>
              </div>
              <div className="text-4xl font-black text-white mb-2 font-manrope">Rs. {bookings.reduce((sum, b) => sum + (b.platformCommission || 0), 0).toLocaleString()}</div>
              <div className="text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">{t('netRevenue')}</div>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[40px] overflow-hidden shadow-2xl">
             <div className="px-12 py-10 border-b border-white/5 bg-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                   <h3 className="text-xl font-black text-white uppercase tracking-tight font-manrope">{t('reservationLedger')}</h3>
                   <p className="text-[11px] font-bold text-[#4E7A96] uppercase tracking-[4px] mt-2 opacity-60">{t('globalSessionInventory')}</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                   <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4E7A96]" />
                      <input type="text" placeholder={t('searchSessions')} className="w-full bg-[#050c14]/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-[12px] text-white focus:outline-none focus:border-[#00d2b4] transition-all font-bold placeholder:opacity-20 uppercase tracking-widest" />
                   </div>
                </div>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-white/[0.02] border-b border-white/5">
                         <th className="px-12 py-6 text-[10px] font-black text-[#4E7A96] uppercase tracking-[3px]">{t('customerVehicle')}</th>
                         <th className="px-12 py-6 text-[10px] font-black text-[#4E7A96] uppercase tracking-[3px]">{t('stationHub')}</th>
                         <th className="px-12 py-6 text-[10px] font-black text-[#4E7A96] uppercase tracking-[3px]">{t('schedule')}</th>
                         <th className="px-12 py-6 text-[10px] font-black text-[#4E7A96] uppercase tracking-[3px]">{t('financials')}</th>
                         <th className="px-12 py-6 text-[10px] font-black text-[#4E7A96] uppercase tracking-[3px]">{t('statusLabel')}</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5 font-inter">
                      {bookings.length > 0 ? bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#00d2b4]/5 transition-all group">
                           <td className="px-12 py-8">
                              <div className="font-extrabold text-white text-[15px] uppercase tracking-tight group-hover:text-[#00d2b4] transition-colors">{b.userName}</div>
                              <div className="text-[10px] text-[#4E7A96] font-black mt-2 font-manrope uppercase tracking-widest bg-white/5 inline-block px-2 py-1 rounded-md">{b.vehicleNo || 'NO-PLATE'}</div>
                           </td>
                           <td className="px-12 py-8">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center"><Fuel className="w-4 h-4 text-[#00d2b4]" /></div>
                                 <div>
                                    <div className="text-[13px] font-bold text-white uppercase tracking-tight">{b.stationName}</div>
                                    <div className="text-[9px] text-[#4E7A96] font-bold uppercase tracking-widest mt-1 opacity-60 flex items-center gap-1"><MapPin className="w-3 h-3" /> {b.location}</div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-12 py-8">
                              <div className="text-[13px] font-bold text-white">{b.date}</div>
                              <div className="text-[10px] text-[#00d2b4] font-black mt-1.5 uppercase tracking-widest flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {b.time}</div>
                           </td>
                           <td className="px-12 py-8">
                              <div className="text-[14px] font-black text-white font-manrope">Rs. {b.totalCost?.toLocaleString()}</div>
                              <div className="text-[9px] text-red-400 font-bold uppercase tracking-widest mt-1 opacity-70">Comm: Rs. {b.platformCommission?.toFixed(2)}</div>
                           </td>
                           <td className="px-12 py-8">
                              <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-[2px] border ${
                                 b.status === 'CHARGING' ? 'text-[#00d2b4] border-[#00d2b4]/20 bg-[#00d2b4]/5 shadow-[0_0_12px_rgba(0,210,180,0.1)]' : 
                                 b.status === 'COMPLETED' ? 'text-blue-400 border-blue-500/20 bg-blue-500/5' :
                                 'text-amber-500 border-amber-500/20 bg-amber-500/5'
                              }`}>
                                {b.status || 'PENDING'}
                              </span>
                           </td>
                        </tr>
                      )) : (
                        <tr>
                           <td colSpan="5" className="px-12 py-32 text-center opacity-30">
                              <Clock className="w-16 h-16 mx-auto mb-6 text-[#4E7A96]" />
                              <p className="text-[12px] font-black uppercase tracking-[5px] text-[#4E7A96]">No Transactions Logged</p>
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start font-inter">
          {/* Booking Form */}
          <div className="lg:col-span-7 bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[40px] p-12 hover:border-[#00d2b4]/30 transition-all shadow-xl font-inter">
            <div className="space-y-10">
              <div className="space-y-4">
                 <label className="text-[11px] font-bold uppercase tracking-widest text-[#4E7A96] ml-2">Customer Identity</label>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <input 
                      type="text" 
                      placeholder="Customer Name"
                      value={bookingData.userName}
                      onChange={e => setBookingData({...bookingData, userName: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-[#00d2b4] transition-all font-bold placeholder:opacity-20 uppercase tracking-tight"
                    />
                    <input 
                      type="text" 
                      placeholder="Vehicle Number"
                      value={bookingData.vehicleNo}
                      onChange={e => setBookingData({...bookingData, vehicleNo: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-[#00d2b4] transition-all font-bold placeholder:opacity-20 uppercase tracking-tight"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[#4E7A96] ml-2">Registered Station Assignment</label>
                  <div className="relative font-manrope">
                      <select 
                        value={bookingData.stationId}
                        onChange={e => setBookingData({...bookingData, stationId: e.target.value})}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 pl-7 text-white text-[16px] focus:outline-none focus:border-[#00d2b4] transition-all appearance-none cursor-pointer font-bold uppercase tracking-tight"
                      >
                        {stations.map(s => (
                          <option key={s.id} value={s.id}>{s.name} — Rs. {s.price}/Hr</option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#4E7A96] pointer-events-none text-xs">▼</div>
                  </div>
                </div>
                <div className="space-y-4">
                   <label className="text-[11px] font-bold uppercase tracking-widest text-[#4E7A96] ml-2">Duration (Hours)</label>
                   <input 
                      type="number" 
                      min="1"
                      value={duration}
                      onChange={e => setDuration(parseInt(e.target.value) || 1)}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-[#00d2b4] transition-all font-bold" 
                   />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-inter">
                <div className="space-y-4">
                   <label className="text-[11px] font-bold uppercase tracking-widest text-[#4E7A96] ml-2">Setup Date</label>
                   <input 
                      type="date" 
                      value={bookingData.date}
                      onChange={e => setBookingData({...bookingData, date: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-[#00d2b4] transition-all font-bold font-inter [color-scheme:dark]" 
                   />
                </div>
                <div className="space-y-4">
                   <label className="text-[11px] font-bold uppercase tracking-widest text-[#4E7A96] ml-2">Time Offset</label>
                   <input 
                      type="time" 
                      value={bookingData.time}
                      onChange={e => setBookingData({...bookingData, time: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-[#00d2b4] transition-all font-bold font-inter [color-scheme:dark]" 
                   />
                </div>
              </div>

              <div className="bg-[#050c14]/80 border-2 border-dashed border-[#00d2b4]/10 rounded-3xl p-10 space-y-6 shadow-sm font-inter">
                 <div className="text-[11px] font-bold uppercase tracking-[4px] text-[#00d2b4] mb-8 opacity-80">Network Billing Summary</div>
                 <div className="space-y-4 text-sm md:text-base">
                    <div className="flex justify-between items-center text-[#8AAFC8]"><span>Base Rate (Rs/Hr)</span><span className="text-white font-extrabold font-manrope">Rs. {rate.toFixed(2)}</span></div>
                    <div className="flex justify-between items-center text-[#8AAFC8]"><span>Session Duration</span><span className="text-white font-extrabold font-manrope">{duration} HR</span></div>
                    <div className="flex justify-between items-center text-[#8AAFC8]"><span>Platform Commission (25%)</span><span className="text-red-400 font-extrabold font-manrope">- Rs. {platformCommission.toFixed(2)}</span></div>
                    <div className="flex justify-between items-center text-[#8AAFC8] pt-4 border-t border-white/5"><span>Provider Earnings</span><span className="text-[#00d2b4] font-extrabold font-manrope">Rs. {providerEarnings.toFixed(2)}</span></div>
                 </div>
                 <div className="pt-8 border-t border-white/10 flex justify-between items-center font-manrope">
                    <span className="text-[#8AAFC8] text-[11px] font-bold uppercase tracking-widest">Total cost</span>
                    <span className="text-white text-4xl font-extrabold tracking-tighter">Rs. {totalCost.toLocaleString()}</span>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-8 font-manrope">
                 <button onClick={() => setBookingData({ userName: '', vehicleNo: '', stationId: stations[0]?.id || '', date: '', time: '' })} className="flex-1 py-5 rounded-2xl bg-white/[0.03] border border-white/10 text-[#4E7A96] text-[12px] font-extrabold uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all">VOID ORDER</button>
                 <button onClick={handleBooking} className="flex-[2] py-5 rounded-2xl bg-gradient-to-r from-[#10b981] to-[#0A8F6A] text-[#050c14] text-[13px] font-extrabold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/10">CONFIRM BOOKING</button>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Log & Live Monitor */}
          <div className="lg:col-span-5 space-y-10">
             <div className="bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[40px] overflow-hidden hover:border-[#00d2b4]/20 transition-all shadow-xl font-inter">
                <div className="px-10 py-8 border-b border-white/10 bg-white/5 flex justify-between items-center">
                   <h3 className="text-[11px] font-bold uppercase tracking-[3px] text-[#4E7A96]">Recent Slot Log</h3>
                   <div className="flex gap-4">
                     <div className="flex items-center gap-2 text-[9px] font-bold text-[#4E7A96]"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> PENDING</div>
                     <div className="flex items-center gap-2 text-[9px] font-bold text-[#4E7A96]"><div className="w-1.5 h-1.5 rounded-full bg-[#00d2b4] animate-pulse"></div> ACTIVE</div>
                   </div>
                </div>
                <table className="w-full text-left">
                   <tbody className="divide-y divide-white/5 font-manrope">
                      {bookings.length > 0 ? bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.02] transition-all group">
                           <td className="px-10 py-7">
                              <div className="font-extrabold text-white text-[16px] uppercase tracking-tight group-hover:text-emerald-400 transition-colors line-clamp-1">{b.userName}</div>
                              <div className="text-[10px] text-[#4E7A96] font-bold mt-2 font-inter uppercase tracking-widest opacity-60">
                                {b.date} @ {b.time} · {b.stationName}
                              </div>
                              <div className="mt-4 flex items-center gap-4">
                                 <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border ${
                                    b.status === 'CHARGING' ? 'text-[#00d2b4] border-emerald-500/20 bg-emerald-500/5' : 
                                    b.status === 'COMPLETED' ? 'text-blue-400 border-blue-500/20 bg-blue-500/5' :
                                    'text-amber-500 border-amber-500/20 bg-amber-500/5'
                                 }`}>
                                   {b.status || 'PENDING'}
                                 </span>
                              </div>
                           </td>
                           <td className="px-10 py-7 text-right">
                              {(!b.status || b.status === 'PENDING') && (
                                <button 
                                  onClick={async () => {
                                    await updateBookingStatus(b.id, { status: 'CHARGING', startTime: new Date() });
                                    fetchData();
                                  }}
                                  className="px-6 py-3 rounded-xl bg-[#00d2b4]/10 border border-[#00d2b4]/20 text-[#00d2b4] text-[10px] font-black uppercase tracking-widest hover:bg-[#00d2b4] hover:text-[#050c14] transition-all shadow-lg"
                                >
                                  Start
                                </button>
                              )}
                              {b.status === 'CHARGING' && (
                                <button 
                                  onClick={() => handleStop(b)}
                                  className="px-6 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-lg"
                                >
                                  Stop
                                </button>
                              )}
                           </td>
                        </tr>
                      )) : (
                        <tr>
                           <td colSpan="2" className="px-10 py-20 text-center opacity-30">
                              <Clock className="w-10 h-10 mx-auto mb-4" />
                              <p className="text-[10px] font-bold uppercase tracking-[4px] text-[#4E7A96]">No Recent Reservations</p>
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>

             <div className="space-y-6 animate-fade-up">
                <div className="flex justify-between items-center pl-2">
                   <h3 className="text-[13px] font-extrabold text-white uppercase tracking-tighter">Live Network Operations</h3>
                   <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-black text-[#4E7A96] uppercase tracking-widest">REAL-TIME MONITOR</div>
                </div>
                
                <div className="space-y-4">
                   {bookings.filter(b => b.status === 'CHARGING').length > 0 ? (
                      bookings.filter(b => b.status === 'CHARGING').map(b => (
                        <div key={b.id} className="bg-[#0a2038]/60 border-2 border-[#00d2b4]/30 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group hover:border-[#00d2b4]/60 transition-all">
                           <div className="absolute top-0 right-0 w-48 h-48 bg-[#00d2b4]/10 blur-[80px] pointer-events-none"></div>
                           <div className="flex flex-col gap-8 relative z-10">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <div className="flex items-center gap-3 mb-2">
                                       <div className="w-2.5 h-2.5 rounded-full bg-[#00d2b4] animate-pulse"></div>
                                       <div className="text-xl font-black text-white uppercase tracking-tight">{b.userName}</div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#8AAFC8] uppercase tracking-widest pl-5 opacity-70">
                                       <MapPin className="w-3 h-3 text-[#00d2b4]" /> {b.stationName}
                                    </div>
                                 </div>
                                 <ChargingTimer startTime={b.startTime} durationHours={b.duration} size="large" />
                              </div>

                              <div className="flex gap-4 pt-4 border-t border-white/5">
                                 <button 
                                    onClick={() => handleStop(b)}
                                    className="flex-1 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                 >
                                    STOP CHARGING
                                 </button>
                                 <div className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-center">
                                    <div className="text-[8px] font-bold text-[#4E7A96] uppercase tracking-widest mb-1">Live Cost</div>
                                    <div className="text-sm font-black text-white font-manrope">Rs. {((b.rate * Math.max(0.01, (Date.now() - (b.startTime?.seconds ? b.startTime.seconds * 1000 : b.startTime instanceof Date ? b.startTime.getTime() : Date.now())) / (3600 * 1000)))).toFixed(2)}</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                      ))
                   ) : (
                      <div className="bg-[#0a2038]/20 border-2 border-dashed border-white/5 rounded-[32px] p-12 text-center opacity-30">
                         <Zap className="w-10 h-10 text-[#4E7A96] mx-auto mb-4 opacity-20" />
                         <p className="text-[10px] font-bold uppercase tracking-[4px] text-[#4E7A96]">No Current Active Stations</p>
                      </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
