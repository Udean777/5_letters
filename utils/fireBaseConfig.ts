import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAV8Gz3nAV5CWvSxwoKzvUF37FstRkP5Cg",
  authDomain: "letters-c252b.firebaseapp.com",
  projectId: "letters-c252b",
  storageBucket: "letters-c252b.firebasestorage.app",
  messagingSenderId: "765642496694",
  appId: "1:765642496694:web:ba90084aa9d9b327a4a417",
};

const app = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
