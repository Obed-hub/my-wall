import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJgXBD0aOIXrfF-inQsF6lwLbLL4tAKIo",
  authDomain: "omoope-e814f.firebaseapp.com",
  projectId: "omoope-e814f",
  storageBucket: "omoope-e814f.firebasestorage.app",
  messagingSenderId: "748046069516",
  appId: "1:748046069516:web:4e60c61da73c8d31302329",
  measurementId: "G-M4R5J1FNQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Mock mode is disabled as we are now live
export const isMockMode = false;
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));