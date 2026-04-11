'use client'; // 1. Isso avisa a Vercel que o código roda no navegador

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 2. Suas variáveis que já configuramos
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 3. Segurança: Só inicializa se já não houver um app rodando
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 4. Exporta o banco de dados
export const db = getFirestore(app);