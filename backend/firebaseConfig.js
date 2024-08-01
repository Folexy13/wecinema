// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyDst7s0XVPLrGr7S0S0IMZ4e9T4Z_W8rVs",
    authDomain: "wecinemaco.firebaseapp.com",
    databaseURL: "https://wecinemaco-default-rtdb.firebaseio.com",
    projectId: "wecinemaco",
    storageBucket: "wecinemaco.appspot.com",
    messagingSenderId: "133384787906",
    appId: "1:133384787906:web:93ef08a61ffa389622285b",
    measurementId: "G-L7XZ0MBR1C"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/user.birthday.read');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

export { auth, googleProvider, app, database };
