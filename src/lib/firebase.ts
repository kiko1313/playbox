import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCW-uXCaJi36xTADrYp1y9kDviRayNQyWo",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "adawat-c701c.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "adawat-c701c",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "138856973754",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:138856973754:web:4fea264a442b52dd860983"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
