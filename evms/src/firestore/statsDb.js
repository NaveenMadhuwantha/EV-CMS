import { db } from '../config/firebase';
import { collection, getCountFromServer, getDocs, query, where } from 'firebase/firestore';

/**
 * VoltWay Global Stats Streamer (Polling implementation)
 * Provides updates for Users, Providers, and Stations using high-stability polling
 * to avoid persistent Firestore internal assertion failures (ID: b815).
 */
export const streamGlobalStats = (callback) => {
  let isMounted = true;
  let intervalId = null;

  const fetchStats = async () => {
    if (!isMounted) return;

    try {
      const usersColl = collection(db, 'users');
      const providersColl = collection(db, 'providers');
      const stationsColl = collection(db, 'stations');

      // Use atomic count requests for users/providers
      const [uSnap, pSnap, sSnap] = await Promise.all([
        getCountFromServer(usersColl),
        getCountFromServer(providersColl),
        getDocs(stationsColl) // We need docs for stations to check status
      ]);

      const userCount = uSnap.data().count;
      const providerCount = pSnap.data().count;
      const totalStations = sSnap.size;
      
      let live = 0;
      sSnap.forEach(doc => {
        const d = doc.data();
        if (d.status === 'LIVE' || d.status === 'CHARGING') live++;
      });

      const uptimeValue = totalStations > 0 
        ? (live / totalStations * 100).toFixed(1) 
        : '100';

      if (isMounted) {
        callback({
          totalUsers: userCount + providerCount,
          totalStations: totalStations,
          liveStations: live,
          uptime: `${uptimeValue}%`
        });
      }
    } catch (err) {
      console.error("Stats Polling Error:", err);
    }
  };

  // Initial fetch
  fetchStats();

  // Poll every 30 seconds for balance between "live" feel and stability
  intervalId = setInterval(fetchStats, 30000);

  return () => {
    isMounted = false;
    if (intervalId) clearInterval(intervalId);
  };
};
