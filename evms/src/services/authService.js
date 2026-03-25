import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';

// Initialize the Auth Providers
const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

/**
 * Log in a user with Email and Password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} user credential object
 */
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase Email Login Error:", error);
    throw error;
  }
};

/**
 * Log in a user using Google Popup
 * @returns {Promise<Object>} user credential object
 */
export const loginWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase Google Login Error:", error);
    throw error;
  }
};

/**
 * Log in a user using Microsoft Popup
 * @returns {Promise<Object>} user credential object
 */
export const loginWithMicrosoft = async () => {
  try {
    const userCredential = await signInWithPopup(auth, microsoftProvider);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase Microsoft Login Error:", error);
    throw error;
  }
};

/**
 * Send a password reset email
 * @param {string} email - User's email address
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Firebase Password Reset Error:", error);
    throw error;
  }
};
