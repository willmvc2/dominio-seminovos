import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useCarros() {
  const [carros, setCarros] = useState<any[]>([]);

  useEffect(() => {
    async function carregar() {
      try {
        const snapshot = await getDocs(collection(db, "carros"));

        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCarros(lista);
      } catch (error) {
        console.error("❌ ERRO AO BUSCAR CARROS:", error);
      }
    }

    carregar();
  }, []);

  return { carros };
}