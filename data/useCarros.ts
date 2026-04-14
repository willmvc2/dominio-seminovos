import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useCarros() {
  const [carros, setCarros] = useState<any[]>([]);

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
    const data = await buscarCarros();
    setCarros(data);
  }

  useEffect(() => {
    carregar();
  }, []);

  return {
    carros,
    recarregar: carregar, // 👈 importante
  };
}