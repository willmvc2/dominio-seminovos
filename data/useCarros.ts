import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export function useCarros() {
  const [carros, setCarros] = useState<any[]>([]);

  useEffect(() => {
    const ref = collection(db, "carros");

    const unsub = onSnapshot(ref, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCarros(lista);
    });

    return () => unsub();
  }, []);

  return { carros, setCarros };
}