import { db } from "../config/firebase";
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from "firebase/firestore";

/**
 * Fetch a summary of Grid Dashboard statistics and recent telemetry.
 * Minimum lines, simple and direct for the VoltWay UI.
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
        commissionRate: 8.5 // Baseline platform fee if no doc exists
     };
  } catch (error) {
     console.error("Telemetry Link Failure:", error);
     return { activeNodes: 0, totalBookings: 0, recentSessions: [], commissionRate: 0 };
  }
};
