import { db } from '../config/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';

const COLLECTIONS = ['users', 'providers', 'stations', 'bookings', 'transactions'];

export const performBackup = async () => {
  const backupData = {};
  for (const col of COLLECTIONS) {
    const snap = await getDocs(collection(db, col));
    backupData[col] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `VoltWay_Backup_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const performRecovery = async (jsonData) => {
  const data = JSON.parse(jsonData);
  const batch = writeBatch(db);
  for (const col of Object.keys(data)) {
    if (!COLLECTIONS.includes(col)) continue;
    data[col].forEach(item => {
      const { id, ...payload } = item;
      batch.set(doc(db, col, id), payload, { merge: true });
    });
  }
  await batch.commit();
};
