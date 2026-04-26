import { auth, db } from "../config/firebase"; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * VoltWay Firebase Backend Service (Auth)
 */

export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
};

export const loginWithEmail = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
    return await signOut(auth);
};


export const verifyUserEmail = async () => {
    if (auth.currentUser) {
        return await sendEmailVerification(auth.currentUser);
    }
};

export const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email);
};

export const registerUser = async (email, password, role, fullName, phone) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;

  // Hybrid: Save auth profile to DB (could move to userDb if needed)
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    fullName: fullName,
    email: email,
    phone: phone,
    role: role,
    createdAt: serverTimestamp(),
  });

  await sendEmailVerification(user);

  return { success: true };
};