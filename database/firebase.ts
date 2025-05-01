import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfoaYgzVjeN5_Ka8ent9r-4LaG-UlYya8",
  authDomain: "base-sensores-d256e.firebaseapp.com",
  projectId: "base-sensores-d256e",
  storageBucket: "base-sensores-d256e.firebasestorage.app",
  messagingSenderId: "533360119827",
  appId: "1:533360119827:web:2bcb25bf30f8f594f1efe6",
  measurementId: "G-5HQJV98S0P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

