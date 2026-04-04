import { useEffect, useState } from "react";

export function useCarros() {
  const [carros, setCarros] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("carros");
    if (data) {
      setCarros(JSON.parse(data));
    }
  }, []);

  function salvar(novaLista: any[]) {
    setCarros(novaLista);
    localStorage.setItem("carros", JSON.stringify(novaLista));

    // 🔥 ISSO AQUI É O QUE FALTAVA
    window.dispatchEvent(new Event("carros-updated"));
  }

  return { carros, setCarros, salvar };
}