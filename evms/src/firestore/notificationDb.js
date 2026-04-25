import { db } from '../config/firebase';
import { 
  collection, query, where, orderBy, 
  onSnapshot, limit, doc, updateDoc, 
  writeBatch, serverTimestamp, addDoc, or, and,
  getCountFromServer
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
    
    const q = query(
      notificationsRef,
      or(
        where('recipientId', '==', userId),
        where('recipientId', '==', 'all'),
        where('recipientRole', '==', role)
      ),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const fetchNotifications = async () => {
      try {
        const snapshot = await getDocs(q);
        const notifications = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(intervalId);
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
      and(
        where('isRead', '==', false),
        or(
          where('recipientId', '==', userId),
          where('recipientId', '==', 'all'),
          where('recipientRole', '==', role)
        )
      )
    );

    // Using polling as a workaround for persistent Firestore assertion failures (ID: ca9)
    // with real-time listeners on this specific collection.
    const fetchCount = async () => {
      try {
        const snapshot = await getCountFromServer(q);
        callback(snapshot.data().count);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchCount(); // Initial fetch
    const intervalId = setInterval(fetchCount, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId);
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
