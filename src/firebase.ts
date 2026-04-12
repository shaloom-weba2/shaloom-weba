import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

let isAuthPending = false;

export const loginWithGoogle = async () => {
  if (isAuthPending) {
    throw new Error('Authentication already in progress');
  }
  
  isAuthPending = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  } finally {
    isAuthPending = false;
  }
};

export const loginWithEmail = async (email: string, pass: string) => {
  if (isAuthPending) {
    throw new Error('Authentication already in progress');
  }
  
  isAuthPending = true;
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Email:', error);
    throw error;
  } finally {
    isAuthPending = false;
  }
};

export const logout = () => signOut(auth);

export const testFirestoreConnection = async () => {
  try {
    // Attempt to read a non-existent doc from server to test connection
    await getDocFromServer(doc(db, 'system', 'connection_test'));
    return { success: true };
  } catch (error: any) {
    console.error("Firestore connection test failed:", error);
    return { 
      success: false, 
      error: error.message,
      isOffline: error.message?.includes('offline') || error.code === 'unavailable'
    };
  }
};
