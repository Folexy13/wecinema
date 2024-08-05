// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyBFFVP4F_tq9yfgra1szbT1yWFh_SCCGMg",
    authDomain: "wecinema-5b6a4.firebaseapp.com",
    projectId: "wecinema-5b6a4",
    storageBucket: "wecinema-5b6a4.appspot.com",
    messagingSenderId: "962978250768",
    appId: "1:962978250768:web:21d326bc46b6e1874bca95",
    measurementId: "G-Y1ZC282HZK"
  };
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/user.birthday.read');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

export { auth, googleProvider, app, database };
