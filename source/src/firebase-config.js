// import firebase from 'firebase/app'
// import 'firebase/auth'

// // Initialize Firebase with api key from .env
// const app = firebase.initializeApp({
//     apiKey: process.env.REACT_APP_FIREBASE_apiKey,
//     authDomain: process.env.REACT_APP_FIREBASE_authDomain,
//     projectId: process.env.REACT_APP_FIREBASE_projectId,
//     storageBucket: process.env.REACT_APP_FIREBASE_storageBucket,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_messagingSenderId,
//     appId: process.env.REACT_APP_FIREBASE_appId
// })
// 
// export const auth = app.auth()
// export default app

// ----------1/27/2022 

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1XLxVgee_uOq8H3hPQGqElQrzJbexFHA",
  authDomain: "oasissit-717e4.firebaseapp.com",
  projectId: "oasissit-717e4",
  storageBucket: "oasissit-717e4.appspot.com",
  messagingSenderId: "1067519905955",
  appId: "1:1067519905955:web:15d505db648da229fa6f16",
  measurementId: "G-L3TMP8Y9HH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firebase Database
export const db = getFirestore(app);
// Authentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();