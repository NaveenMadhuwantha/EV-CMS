import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

/**
 * VoltWay Database-centric Auth Profile fetcher
 */

export const getUserProfile = async (uid) => {
  if (!uid) return null;
  
  // Try users col
  let snap = await getDoc(doc(db, "users", uid));
  if (snap.exists()) return { ...snap.data(), role: snap.data().role || 'owner' };
  
  // Try providers col
  snap = await getDoc(doc(db, "providers", uid));
  if (snap.exists()) return { ...snap.data(), role: 'provider' };
  
  return null;
};
