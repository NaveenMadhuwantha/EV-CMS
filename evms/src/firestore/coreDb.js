import { db } from '../config/firebase';
import { 
  collection, doc, setDoc, updateDoc, 
  getDocs, getDoc, deleteDoc, 
  query, orderBy, serverTimestamp, 
  addDoc 
} from 'firebase/firestore';

/**
 * VoltWay Unified Database Engine
 * Centralized managed interface for high performance and scalability.
 */

export const coreDb = {
  sync: async (coll, id, data) => {
    const ref = doc(db, coll, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { ...data, createdAt: serverTimestamp(), lastSync: serverTimestamp() });
    } else {
      await setDoc(ref, { ...data, lastSync: serverTimestamp() }, { merge: true });
    }
    return data;
  },

  list: async (coll, field = 'createdAt') => {
    const q = query(collection(db, coll), orderBy(field, 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  get: async (coll, id) => {
    const snap = await getDoc(doc(db, coll, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  add: async (coll, data) => {
    const ref = collection(db, coll);
    return await addDoc(ref, { ...data, createdAt: serverTimestamp() });
  },

  update: async (coll, id, data) => {
    const ref = doc(db, coll, id);
    return await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  },

  remove: async (coll, id) => {
    return await deleteDoc(doc(db, coll, id));
  }
};
