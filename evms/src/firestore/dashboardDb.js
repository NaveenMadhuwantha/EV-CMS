import { db } from "../config/firebase";
import { collection, getDocs, query, orderBy, limit, getCountFromServer } from "firebase/firestore";

/**
 * VoltWay Overview Engine (Database Side)
 * Fetch all reporting and metrics from Firestore.
 */

export const getDashboardOverview = async () => {
  try {
     const [stationsSnap, bookingsSnap, sessionsSnap, usersCount, providersCount] = await Promise.all([
        getDocs(collection(db, "stations")),
        getDocs(collection(db, "bookings")),
        getDocs(query(collection(db, "transactions"), orderBy("timestamp", "desc"), limit(5))),
        getCountFromServer(collection(db, "users")),
        getCountFromServer(collection(db, "providers"))
     ]);

     // Calculate Total Revenue and Platform Earnings from all bookings
     let totalRevenue = 0;
     let platformEarnings = 0;

     bookingsSnap.forEach(doc => {
        const data = doc.data();
        totalRevenue += parseFloat(data.totalCost || 0);
        platformEarnings += parseFloat(data.platformCommission || 0);
     });

     return {
        activeStations: stationsSnap.size,
        totalBookings: bookingsSnap.size,
        totalUsers: usersCount.data().count + providersCount.data().count,
        totalRevenue,
        platformEarnings,
        recentSessions: sessionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        commissionRate: 25 // Platform standard commission rate
     };
  } catch (error) {
     console.error("Overview failure:", error);
     return { 
        activeStations: 0, 
        totalBookings: 0, 
        totalUsers: 0,
        totalRevenue: 0,
        platformEarnings: 0,
        recentSessions: [], 
        commissionRate: 0 
     };
  }
};
