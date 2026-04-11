import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChb55jnm9_irSTEnf0s7ai_lZCIAKM0Cc",
  authDomain: "gymq-e46f1.firebaseapp.com",
  projectId: "gymq-e46f1",
  storageBucket: "gymq-e46f1.firebasestorage.app",
  messagingSenderId: "630139356900",
  appId: "1:630139356900:web:39550c8060b98298d94ef1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
