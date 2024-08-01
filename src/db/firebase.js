// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, TwitterAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBktc06w0N249Vy7GikYVNYWrYqbXAqcOo",
  authDomain: "burpple-bookmark.firebaseapp.com",
  projectId: "burpple-bookmark",
  storageBucket: "burpple-bookmark.appspot.com",
  messagingSenderId: "744799603443",
  appId: "1:744799603443:web:06d577e8583429e9890586"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();

const database = getDatabase(app);
const rtdb = database;

export { db, rtdb, auth, googleProvider, twitterProvider }