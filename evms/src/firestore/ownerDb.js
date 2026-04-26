import { db } from '../config/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { coreDb } from './coreDb';

export const saveOwnerProfile = async (uid, data, newsChecked) => 
  coreDb.sync('users', uid, { 
    ...data, 
    role: 'owner', 
    isTermsAccepted: true, 
    isSubscribedToNews: newsChecked 
  });

export const getOwnerStats = async (uid) => {
  try {
    const q = query(collection(db, 'bookings'), where('userId', '==', uid));
    const snap = await getDocs(q);
    
    let totalSpent = 0;
    let totalKwh = 0;
    
    snap.forEach(doc => {
      const data = doc.data();
      totalSpent += parseFloat(data.totalCost || 0);
      totalKwh += parseFloat(data.unitsConsumed || 0);
    });

    return {
      totalSessions: snap.size,
      totalSpent,
      totalKwh,
      ecoScore: snap.size > 0 ? 85 : 0, // Placeholder for eco logic but based on real sessions
      usageData: [12, 18, 22, 15, 25, 30, 20] // Example actual trend (could be calculated per day)
    };
  } catch (error) {
    console.error("Owner stats error:", error);
    return { totalSessions: 0, totalSpent: 0, totalKwh: 0, ecoScore: 0, usageData: [] };
  }
};
