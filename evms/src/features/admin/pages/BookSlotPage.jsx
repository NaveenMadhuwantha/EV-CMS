import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';
import { PageHeader } from '../components/AdminComponents';
import { getAllStations } from '../../../firestore/stationDb';
import { createBooking, getAllBookings, updateBookingStatus } from '../../../firestore/bookingDb';
import { Loader2, Clock, MapPin, Zap } from 'lucide-react';

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

  return (
    <DashboardLayout title="Bookings">
      <PageHeader title="Bookings" subtitle="Handle customer appointments and grid slot reservations." />
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 opacity-30">
           <Loader2 className="w-12 h-12 animate-spin mb-6 text-[#00d2b4]" />
           <p className="text-[12px] font-bold uppercase tracking-[4px] text-[#4E7A96]">Syncing Schedule...</p>
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
