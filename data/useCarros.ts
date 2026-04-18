import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useCarros() {
  const [carros, setCarros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function buscarCarros() {
    const { data, error } = await supabase
      .from("carros")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log("ERRO BUSCAR:", error);
      return [];
    }

    return data || [];
  }

  async function carregar() {
    setLoading(true);

    const data = await buscarCarros();
    setCarros(data);

    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  return {
    carros,
    loading, // 🔥 AGORA EXISTE
    recarregar: carregar,
  };
}