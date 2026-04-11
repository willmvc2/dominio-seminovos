"use client";

import { useEffect, useState } from "react";

export function useCarros() {
  const [carros, setCarros] = useState<any[]>([]);

  function carregar() {
    const data = JSON.parse(localStorage.getItem("carros") || "[]");
    setCarros(data);
  }

  useEffect(() => {
    carregar();

    const atualizar = () => carregar();

    window.addEventListener("carros-updated", atualizar);
    window.addEventListener("storage", atualizar);

    return () => {
      window.removeEventListener("carros-updated", atualizar);
      window.removeEventListener("storage", atualizar);
    };
  }, []);

  function salvar(novos: any[]) {
    setCarros(novos);
    localStorage.setItem("carros", JSON.stringify(novos));
    window.dispatchEvent(new Event("carros-updated"));
  }

  function excluir(id: number) {
  const atual = JSON.parse(localStorage.getItem("carros") || "[]");

  const filtrados = atual.filter((c: any) => c.id !== id);

  localStorage.setItem("carros", JSON.stringify(filtrados));

  setCarros(filtrados);

  window.dispatchEvent(new Event("carros-updated"));
}

  return { carros, salvar, excluir };
}