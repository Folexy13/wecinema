// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD_vZlgkqS51NVCkQ6GeaqaMo3F74A0ACI",
    authDomain: "wecinema-821f9.firebaseapp.com",
    databaseURL: "https://wecinema-821f9-default-rtdb.firebaseio.com/",
    projectId: "wecinema-821f9",
    storageBucket: "wecinema-821f9.appspot.com",
    messagingSenderId: "152315337920",
    appId: "wecinema-821f9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/user.birthday.read');
export { auth, provider, signInWithPopup, signOut };
