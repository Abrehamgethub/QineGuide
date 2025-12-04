import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA01Bp90USZuwgTw7PjM7v8x50NEpa7wq8',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'tenaai-9a62c.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'tenaai-9a62c',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'tenaai-9a62c.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1073812925824',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1073812925824:web:5205bdd78bf52c71fee565',
};

// Debug: Log config status (remove in production)
console.log('Firebase initialized with project:', firebaseConfig.projectId);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export default app;
