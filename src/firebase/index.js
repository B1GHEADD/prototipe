import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfr_l7QzNOriq6XhK9jImPVVlR0o9nK7Y",
  authDomain: "pui-project-e305b.firebaseapp.com",
  projectId: "pui-project-e305b",
  storageBucket: "pui-project-e305b.appspot.com",
  messagingSenderId: "480238398380",
  appId: "1:480238398380:web:c9fe7662bbd244ff8be809",
  measurementId: "G-XV8421QX37",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth };
