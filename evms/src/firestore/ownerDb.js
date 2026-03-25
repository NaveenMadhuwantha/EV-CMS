import { db } from '../config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Creates a new EV Owner profile in Firestore.
 * @param {string} uid - Firebase Auth UID
 * @param {Object} data - Owner registration data
 * @param {boolean} newsChecked - Whether the owner subscribed to news
 */
export const saveOwnerProfile = async (uid, data, newsChecked) => {
  if (!uid) throw new Error("Owner UID is required.");
  
  const ownerRef = doc(db, "users", uid);
  
  await setDoc(ownerRef, {
    ...data,
    role: 'EV_OWNER',
    isTermsAccepted: true,
    isSubscribedToNews: newsChecked,
    createdAt: serverTimestamp(),
  });
};
