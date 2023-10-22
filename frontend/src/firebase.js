import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDg1G2oYFZyyMsjWtqUu4ToxYWsjqVfpWk",
    authDomain: "maps-locat.firebaseapp.com",
    projectId: "maps-locat",
    storageBucket: "maps-locat.appspot.com",
    messagingSenderId: "789134742511",
    appId: "1:789134742511:web:380c9982e206125b9fdc1a",
    measurementId: "G-J8GGDXE46F"
  };

const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
// firebase.analytics();
const auth = app.auth();
// setPersistence(auth, browserSessionPersistence);

const analytics = getAnalytics();

const firebaseDb = getDatabase(app);

// auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
//   .then(() => {
//     // Session persistence is enabled
//   })
//   .catch((error) => {
//     console.error(error);
//   });

export  { auth, firebase , analytics , firebaseDb , db};
