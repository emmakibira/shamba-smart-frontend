import { initializeApp, getApps, getApp } from 'firebase/app';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth } from "firebase/auth";
// @ts-ignore - getReactNativePersistence is only exported in React Native bundles
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'; 

// Configuration derived from your google-services.json
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase only once to prevent errors during React hot-reloading
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services here as you need them
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
// export const storage = getStorage(app);

export default app;
