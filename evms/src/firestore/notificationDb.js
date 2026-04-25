import { db } from '../config/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  limit,
  writeBatch,
  getDocs
} from 'firebase/firestore';

/**
 * Listens for notifications for a specific user or role
 * @param {string} userId - Current user ID
 * @param {string} role - Current user role (admin, provider, owner)
 * @param {function} callback - Function to handle the results
 */
export const listenNotifications = (userId, role, callback) => {
  if (!userId || !role) return () => {};

  // We removed orderBy from the query to avoid the need for a composite index.
  // Instead, we sort the results in the frontend.
  const q = query(
    collection(db, 'notifications'),
    where('recipients', 'array-contains-any', [`role:${role}`, `user:${userId}`]),
    limit(100)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort by createdAt descending in frontend
    notifications.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });

    callback(notifications);
  }, (err) => {
    console.error("Notification listener error:", err);
  });
};

/**
 * Mark a notification as read
 * @param {string} notificationId 
 */
export const markAsRead = async (notificationId) => {
  try {
    const ref = doc(db, 'notifications', notificationId);
    await updateDoc(ref, {
      status: 'read'
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

/**
 * Clear all notifications for a user/role
 */
export const clearAllNotifications = async (userId, role) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('recipients', 'array-contains-any', [`role:${role}`, `user:${userId}`])
    );
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  } catch (error) {
    console.error("Error clearing notifications:", error);
  }
};

/**
 * Mark all unread notifications as read for a user/role
 */
export const markAllAsRead = async (userId, role) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('recipients', 'array-contains-any', [`role:${role}`, `user:${userId}`]),
      where('status', '==', 'unread')
    );
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.update(d.ref, { status: 'read' }));
    await batch.commit();
  } catch (error) {
    console.error("Error marking all as read:", error);
  }
};

/**
 * Create a new notification
 * @param {Object} data - Notification data { title, desc, type, targetRoles, targetUserId, link }
 */
export const createNotification = async (data) => {
  try {
    const recipients = [];
    if (data.targetRoles) {
      data.targetRoles.forEach(r => recipients.push(`role:${r}`));
    }
    if (data.targetUserId) {
      recipients.push(`user:${data.targetUserId}`);
    }

    await addDoc(collection(db, 'notifications'), {
      ...data,
      recipients,
      status: 'unread',
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
