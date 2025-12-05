import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from 'firebase/auth';

// Firebase configuration for QineGuide
const firebaseConfig = {
  apiKey: 'AIzaSyDZx7mJqdhEPM8LOYUja15NYXFfX3WShc4',
  authDomain: 'qineguide-app.firebaseapp.com',
  projectId: 'qineguide-app',
  storageBucket: 'qineguide-app.firebasestorage.app',
  messagingSenderId: '329744586620',
  appId: '1:329744586620:web:4f828f071f40ab97dcb6f9',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
export const auth = getAuth(app);

// Set persistence to local (survives browser restarts)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Auth persistence error:', error);
});

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export default app;
