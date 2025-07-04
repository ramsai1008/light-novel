// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBreQy9u91K6FMTcoY4rl22zNAw_f0juAo",
  authDomain: "novelplane.firebaseapp.com",
  projectId: "novelplane",
  storageBucket: "novelplane.firebasestorage.app",
  messagingSenderId: "208383799577",
  appId: "1:208383799577:web:ca27cea78d7588d73e9588"
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
