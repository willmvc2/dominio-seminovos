import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDunC-0PlpxM30NyROxdNsNA3Hd-XFlj2o",
  authDomain: "dominio-seminovos.firebaseapp.com",
  projectId: "dominio-seminovos",
  storageBucket: "dominio-seminovos.firebasestorage.app",
  messagingSenderId: "652942705429",
  appId: "1:652942705429:web:d36b58f92007345d7b5f1c"
};

const app = initializeApp(firebaseConfig);

// banco Firestore
export const db = getFirestore(app);