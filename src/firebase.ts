import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  enableIndexedDbPersistence,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

// Web app's Firebase configuration provided by user
export const firebaseConfig = {
  apiKey: "AIzaSyCFp2AKmQr1SUnxZ32SEzoFDQyk8eVPzM0",
  authDomain: "followup-55110.firebaseapp.com",
  projectId: "followup-55110",
  storageBucket: "followup-55110.firebasestorage.app",
  messagingSenderId: "1026357132928",
  appId: "1:1026357132928:web:3e9d3bf5ff87e788c5b065"
};

// Initialize Firebase safely (avoid multiple initializations)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore & Authentication SDKs
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};
export type { FirebaseUser };
