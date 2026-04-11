"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// 🔥 SUPABASE CLIENT (TESTE)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Teste() {
  const router = useRouter();

  const [carros, setCarros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 BUSCAR CARROS
  const fetchCarros = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("carros")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log("Erro ao buscar:", error.message);
    } else {
      setCarros(data || []);
    }

    setLoading(false);
  };

  // 🔥 SALVAR CARRO TESTE
  const adicionarCarro = async () => {
    const novoCarro = {
  nome: "Carro teste",
  ano: "2024",
  km: "0",
  cambio: "Automático",
  combustivel: "Flex",
  preco: "50000",
  descricao: "Carro teste",
  video: "",
  imagens: ["/logo.png"],
  status: "disponivel",
};

    const { error } = await supabase
      .from("carros")
      .insert([novoCarro]);

    if (error) {
      alert("Erro ao salvar: " + error.message);
      console.log(error);
    } else {
      alert("Carro salvo no Supabase!");
      fetchCarros();
    }
  };

  useEffect(() => {
    fetchCarros();
  }, []);

  return (
    <main
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        padding: 20,
        color: "white",
      }}
    >
      <h1>🔥 TESTE SUPABASE</h1>

      <button
        onClick={adicionarCarro}
        style={{
          padding: 10,
          marginTop: 20,
          background: "#16a34a",
          border: "none",
          borderRadius: 8,
          color: "white",
          cursor: "pointer",
        }}
      >
        + Adicionar carro no Supabase
      </button>

      <hr style={{ margin: "20px 0" }} />

      {loading ? (
        <p>Carregando...</p>
      ) : carros.length === 0 ? (
        <p>Nenhum carro encontrado</p>
      ) : (
        carros.map((car) => (
          <div
            key={car.id}
            style={{
              padding: 10,
              marginBottom: 10,
              background: "#111827",
              borderRadius: 8,
            }}
          >
            <h3>{car.nome}</h3>
            <p>{car.ano} • {car.cambio}</p>
            <p>R$ {car.preco}</p>
          </div>
        ))
      )}
    </main>
  );
}