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
        // Clear dev mode when a real user logs in to prevent being stuck
        sessionStorage.removeItem('devRole');
        
        const preferredRole = localStorage.getItem('user_role');
        
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

            const unsubscribeProfileSnap = onSnapshot(ref, (snap) => {
               if (snap.exists()) {
                  const data = snap.data();
                  const isComplete = !!(data.phone || data.address || data.businessName);
                  
                  setProfile({ ...data, id: snap.id, role, isProfileComplete: isComplete });
                  localStorage.setItem('user_role', role);
               }
            }, (err) => {
               console.error("Profile listen error:", err);
            });

            return () => unsubscribeProfileSnap();
         };

        try {
          const preferredRole = localStorage.getItem('user_role') || 'owner';
          let detectedRole = null;
          
          console.log("Auth System -> Debug: Preferred Role is", preferredRole);

          // 1. Try to check providers collection
          try {
            const pSnap = await getDoc(doc(db, 'providers', currentUser.uid));
            if (pSnap.exists()) {
              detectedRole = 'provider';
              console.log("Auth System -> Debug: Found in PROVIDERS");
            }
          } catch (e) { console.error("Providers check error:", e); }

          // 2. Try to check users collection (only if not found or to confirm)
          try {
            if (!detectedRole) {
              const uSnap = await getDoc(doc(db, 'users', currentUser.uid));
              if (uSnap.exists()) {
                const dbRole = (uSnap.data().role || 'owner').toLowerCase();
                detectedRole = dbRole === 'providers' ? 'provider' : dbRole;
                console.log("Auth System -> Debug: Found in USERS. Role:", detectedRole);
              }
            }
          } catch (e) { console.error("Users check error:", e); }

          // 3. Final Decision - Give ABSOLUTE priority to what the user selected
          // This allows users with the same email to switch between roles if they exist in both places
          let finalRole = preferredRole; 
          
          // Special case: if they exist in DB as a provider but picked owner, 
          // or if they are a confirmed provider, we should respect that.
          if (detectedRole === 'provider' && preferredRole === 'provider') {
            finalRole = 'provider';
          } else if (detectedRole === 'admin') {
            finalRole = 'admin'; // Admins are always admins
          }

          console.log("Auth System -> Absolute Decision:", finalRole);
          
          unsubscribeProfile = await syncAndListen(finalRole, currentUser.uid);
        } catch (err) { console.error("Global Sync Error:", err); }
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
   const ctxProfile = devRole ? { businessName: 'Dev Testing Inc.', fullName: 'Developer Mode', role: devRole, isProfileComplete: true } : profile;
  
  // Normalize final role to ensure it matches route expectations (singular)
  // Use localStorage as a secondary fallback to prevent "owner flash" during transitions
  let rawRole = (devRole || profile?.role || localStorage.getItem('user_role') || 'owner').toLowerCase();
  const ctxRole = rawRole === 'providers' ? 'provider' : rawRole;

  return (
    <AuthContext.Provider value={{ user: ctxUser, profile: ctxProfile, role: ctxRole, loading: devRole ? false : loading }}>
      {(!loading || devRole) && children}
    </AuthContext.Provider>
  );
};
