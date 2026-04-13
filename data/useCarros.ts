"use client";

import { useEffect, useState } from "react";
import { supabase } from "../app/lib/supabase";

export function useCarros() {
  const [carros, setCarros] = useState<any[]>([]);

  async function carregar() {
    const { data, error } = await supabase
      .from("carros")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Erro ao buscar carros:", error);
      return;
    }

    setCarros(
  (data || []).map((car) => {
    let imagens: string[] = [];

    if (Array.isArray(car.imagens)) {
      imagens = car.imagens;
    } else {
      try {
        imagens = JSON.parse(car.imagens || "[]");
      } catch {
        imagens = [];
      }
    }

    return {
          ...car,
          imagens,
        };
      })
    );
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(novo: any) {
    const payload = {
      ...novo,
      imagens: Array.isArray(novo.imagens) ? novo.imagens : [],
    };

    const { data, error } = await supabase
      .from("carros")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Erro ao salvar:", error);
      return;
    }

    setCarros((prev) => [data, ...prev]);
  }

  async function excluir(id: number) {
    const { error } = await supabase
      .from("carros")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao excluir:", error);
      return;
    }

    setCarros((prev) => prev.filter((c) => c.id !== id));
  }

  return { carros, salvar, excluir };
}