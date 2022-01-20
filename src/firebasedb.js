import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCjrJLTLJqp3RW1XTvJ1T85LpsZgwr40vY",
    authDomain: "instagram-clone-react-ap-4b53a.firebaseapp.com",
    projectId: "instagram-clone-react-ap-4b53a",
    storageBucket: "instagram-clone-react-ap-4b53a.appspot.com",
    messagingSenderId: "52571700950",
    appId: "1:52571700950:web:d639deb7b36da982c25377",
    measurementId: "G-2RLBY9T21X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth(app)
const storage = getStorage(app);

export { db, auth, storage }