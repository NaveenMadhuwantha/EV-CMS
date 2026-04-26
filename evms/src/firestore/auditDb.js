import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

/**
 * VoltWay Audit Logging Service
 * Records critical system actions for administrative oversight.
 */
export const auditDb = {
  /**
   * Log a new system action
   * @param {Object} entry { action, user, details, targetId }
   */
  log: async (entry) => {
    try {
      await addDoc(collection(db, 'audit_logs'), {
        ...entry,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error("Audit Log Failure:", err);
    }
  },

  /**
   * Stream recent logs
   */
  streamLogs: (callback) => {
    const q = query(
      collection(db, 'audit_logs'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    return onSnapshot(q, (snap) => {
      const logs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(logs);
    }, (err) => console.error("Logs Stream Error:", err));
  }
};
