import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace this with your actual Firebase config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDfzyWSU8mt9nIqXePjcuL7hTjqdyiMJZc",
  authDomain: "crypto-tracker-app-a4254.firebaseapp.com",
  projectId: "crypto-tracker-app-a4254",
  storageBucket: "crypto-tracker-app-a4254.firebasestorage.app",
  messagingSenderId: "467805832373",
  appId: "1:467805832373:web:cf558d1ff74c894f116afc",
  measurementId: "G-C9KMXK34JK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app; 