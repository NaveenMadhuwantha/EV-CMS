import { db } from '../config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Submits a new provider application to Firestore.
 * @param {string} uid - The unique identifier for the provider (from Firebase Auth).
 * @param {Object} data - The aggregated provider data from all registration steps.
 * @returns {Promise<void>}
 */
export const submitProviderApplication = async (uid, data) => {
  if (!uid) throw new Error("Provider UID is required.");
  
  const providerRef = doc(db, "providers", uid);
  
  await setDoc(providerRef, {
    ...data,
    role: 'PROVIDER',
    status: 'PENDING',
    createdAt: serverTimestamp()
  });
};
