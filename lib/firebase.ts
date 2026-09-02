import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_kmpmk3ERYb-mZYxBS58FWvZTpshaS9w",
  authDomain: "bread-7e182.firebaseapp.com",
  projectId: "bread-7e182",
  storageBucket: "bread-7e182.firebasestorage.app",
  messagingSenderId: "306915123246",
  appId: "1:306915123246:web:ef25d62064289323f7bfbf",
  measurementId: "G-MRBBFZQ4DS"
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
