import { db } from "../config/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

/**
 * VoltWay Telemetry Engine (Database Side)
 * Fetch all reporting and metrics from Firestore.
 */

export const getDashboardTelemetry = async () => {
  try {
     const [stations, bookings, sessions] = await Promise.all([
        getDocs(collection(db, "stations")),
        getDocs(collection(db, "bookings")),
        getDocs(query(collection(db, "transactions"), orderBy("timestamp", "desc"), limit(5)))
     ]);

     return {
        activeNodes: stations.size,
        totalBookings: bookings.size,
        recentSessions: sessions.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        commissionRate: 8.5
     };
  } catch (error) {
     console.error("Telemetry failure:", error);
     return { activeNodes: 0, totalBookings: 0, recentSessions: [], commissionRate: 0 };
  }
};
