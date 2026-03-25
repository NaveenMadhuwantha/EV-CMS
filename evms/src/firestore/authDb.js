import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Fetches user profile data from Firestore after authentication.
 * @param {string} uid - Firebase Auth UID
 * @param {string} roleType - The requested role ('owner', 'provider', 'admin')
 * @returns {Promise<Object|null>} The user document data or null if not found
 */
export const getUserProfile = async (uid, roleType) => {
  if (!uid) throw new Error("User UID is required for database query.");
  
  const collectionName = roleType === 'provider' ? 'providers' : 'users';
  const userRef = doc(db, collectionName, uid);
  
  const docSnap = await getDoc(userRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // Expected behavior if Google login is new and hasn't registered yet
    console.warn(`No Firestore document found for UID ${uid} in ${collectionName}`);
    return null;
  }
};
