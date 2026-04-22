import { db } from '../config/firebase';
import { 
  collection, query, where, orderBy, 
  onSnapshot, limit, doc, updateDoc, 
  writeBatch, serverTimestamp, addDoc 
} from 'firebase/firestore';

/**
 * Service for managing role-based and user-specific notifications.
 */
export const notificationDb = {
  /**
   * Create a new notification
   * @param {Object} data { recipientId, recipientRole, title, message, type, actionUrl }
   */
  send: async (dataSpec) => {
    try {
      const notificationsRef = collection(db, 'notifications');
      await addDoc(notificationsRef, {
        ...dataSpec,
        isRead: false,
        createdAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  },

  /**
   * Listen to notifications for a specific user or role
   * @param {string} userId 
   * @param {string} role 
   * @param {function} callback 
   */
  stream: (userId, role, callback) => {
    const notificationsRef = collection(db, 'notifications');
    
    // Query for notifications where recipientId is the user ID OR recipientId is 'all'
    // OR recipientRole matches the user's role
    // Since Firestore doesn't support OR across different fields easily in a single listener WITHOUT multiple indexes,
    // we'll listen to a broader set and filter or use multiple listeners.
    // For simplicity in this system, we'll fetch where recipientId == userId OR recipientRole == role OR recipientId == 'all'.
    
    const q = query(
      notificationsRef,
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const allNotifications = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Filter client-side to ensure security/relevance 
      // (True security should be handled via Firestore Rules)
      const filtered = allNotifications.filter(n => 
        n.recipientId === userId || 
        n.recipientId === 'all' || 
        n.recipientRole === role
      );
      
      callback(filtered);
    });
  },

  /**
   * Mark a single notification as read
   */
  markAsRead: async (id) => {
    const ref = doc(db, 'notifications', id);
    await updateDoc(ref, { isRead: true });
  },

  /**
   * Listen to unread count for a specific user or role
   */
  streamUnreadCount: (userId, role, callback) => {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('isRead', '==', false)
    );

    return onSnapshot(q, (snapshot) => {
      const allUnread = snapshot.docs.map(d => d.data());
      const filteredCount = allUnread.filter(n => 
        n.recipientId === userId || 
        n.recipientId === 'all' || 
        n.recipientRole === role
      ).length;
      callback(filteredCount);
    });
  },

  /**
   * Mark all notifications as read for a user
   */
  markAllAsRead: async (notifications) => {
    const batch = writeBatch(db);
    notifications.forEach(n => {
      if (!n.isRead) {
        const ref = doc(db, 'notifications', n.id);
        batch.update(ref, { isRead: true });
      }
    });
    await batch.commit();
  }
};
