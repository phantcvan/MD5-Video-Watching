// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore, serverTimestamp } from "firebase/firestore";
import { FirebaseOptions } from "firebase/app";
import { FieldValue } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCn2nz8t5srUi7hv3UNnZgZ39MJFvtdQsY",
  authDomain: "clone-yt-15025.firebaseapp.com",
  projectId: "clone-yt-15025",
  storageBucket: "clone-yt-15025.appspot.com",
  messagingSenderId: "117894267015",
  appId: "1:117894267015:web:9a2da28e65c74994fcb822"
};
// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore();
const auth: Auth = getAuth();
const provider: GoogleAuthProvider = new GoogleAuthProvider();
const timestamp: FieldValue = serverTimestamp();

export { app, db, auth, timestamp, provider };
