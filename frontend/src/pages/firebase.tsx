// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/user.birthday.read');
export { auth, provider, signInWithPopup, signOut };