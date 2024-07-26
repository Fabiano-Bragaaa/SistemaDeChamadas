import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3pkmjYCYAsyU_gzaYziDOIbJujX5Y9Dc",
  authDomain: "tickets-64c68.firebaseapp.com",
  projectId: "tickets-64c68",
  storageBucket: "tickets-64c68.appspot.com",
  messagingSenderId: "83976382453",
  appId: "1:83976382453:web:b9055685d32f423053a2bc",
  measurementId: "G-2W9111C8CC",
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, firestore, storage };
