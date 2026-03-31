import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (unsubscribeProfile) unsubscribeProfile();

      if (currentUser) {
        let savedRole = localStorage.getItem('user_role');
        
        // Helper to setup/sync and listen
        const syncAndListen = async (role, id) => {
           const coll = role === 'provider' ? 'providers' : 'users';
           const ref = doc(db, coll, id);
           
           // Ensure document exists/is updated
           try {
             const snap = await getDoc(ref);
             if (!snap.exists()) {
               await setDoc(ref, {
                 fullName: currentUser.displayName || '',
                 email: currentUser.email,
                 role: role,
                 createdAt: serverTimestamp(),
                 lastSeen: serverTimestamp()
               });
             } else {
               await updateDoc(ref, { lastSeen: serverTimestamp() });
             }
           } catch (e) { console.error("Sync upsert error:", e); }

           return onSnapshot(ref, (snap) => {
              if (snap.exists()) {
                 setProfile({ ...snap.data(), id: snap.id, role });
                 localStorage.setItem('user_role', role);
              }
           });
        };

        try {
          if (savedRole) {
            unsubscribeProfile = await syncAndListen(savedRole, currentUser.uid);
          } else {
            const uSnap = await getDoc(doc(db, 'users', currentUser.uid));
            let role = uSnap.exists() ? (uSnap.data().role || 'owner') : 'owner';
            unsubscribeProfile = await syncAndListen(role, currentUser.uid);
          }
        } catch (err) { console.error("Sync Error:", err); }
      } else {
        setProfile(null);
        localStorage.removeItem('user_role');
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const params = new URLSearchParams(window.location.search);
  let devRole = params.get('devRole');
  if (devRole === 'clear') {
    sessionStorage.removeItem('devRole');
    devRole = null;
  } else if (devRole) {
    sessionStorage.setItem('devRole', devRole);
  } else {
    devRole = sessionStorage.getItem('devRole');
  }
  
  const ctxUser = devRole ? { uid: 'mock_uid_123', email: `dev_${devRole}@voltway.lk` } : user;
  const ctxProfile = devRole ? { businessName: 'Dev Testing Inc.', fullName: 'Developer Mode', role: devRole } : profile;
  const ctxRole = devRole || profile?.role;

  return (
    <AuthContext.Provider value={{ user: ctxUser, profile: ctxProfile, role: ctxRole, loading: devRole ? false : loading }}>
      {(!loading || devRole) && children}
    </AuthContext.Provider>
  );
};
