import { db } from "../config/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

/**
 * VoltWay Overview Engine (Database Side)
 * Fetch all reporting and metrics from Firestore.
 */

export const getDashboardOverview = async () => {
  try {
     const [stations, bookings, sessions] = await Promise.all([
        getDocs(collection(db, "stations")),
        getDocs(collection(db, "bookings")),
        getDocs(query(collection(db, "transactions"), orderBy("timestamp", "desc"), limit(5)))
     ]);

     return {
        activeStations: stations.size,
        totalBookings: bookings.size,
        recentSessions: sessions.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        commissionRate: 8.5
     };
  } catch (error) {
     console.error("Overview failure:", error);
     return { activeStations: 0, totalBookings: 0, recentSessions: [], commissionRate: 0 };
  }
};
