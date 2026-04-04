import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPVH4Z-X4EEDRHQ6jbOz-7bKIJ0GEKE7I",
  authDomain: "site-dominio-1265e.firebaseapp.com",
  projectId: "site-dominio-1265e",
  storageBucket: "site-dominio-1265e.firebasestorage.app",
  messagingSenderId: "297737814734",
  appId: "1:297737814734:web:22ad2b2c569ef52b87869f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);