import { db } from '../config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Submits a new provider application to Firestore.
 * @param {string} uid - Firebase Auth UID
 * @param {Object} data - Provider application data
 */
export const saveProviderProfile = async (uid, data) => {
  if (!uid) throw new Error("Provider UID is required.");
  
  const providerRef = doc(db, "providers", uid);
  
  await setDoc(providerRef, {
    ...data,
    role: 'PROVIDER',
    status: 'PENDING',
    createdAt: serverTimestamp()
  });
};
