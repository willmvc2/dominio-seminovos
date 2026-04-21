"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCarros } from "../../data/useCarros";
import { formatarPreco } from "@/data/formatarPreco";
import { supabase } from "@/lib/supabase";

async function excluirCarro(id: number) {
  const confirmacao = window.confirm("Tem certeza que deseja excluir?");
  if (!confirmacao) return;

  const { error } = await supabase
    .from("carros")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Carro excluído com sucesso");

  window.location.reload(); // atualiza lista
}

export default function Admin() {
  const router = useRouter();
  const { carros, } = useCarros();

  useEffect(() => {
  const logado = sessionStorage.getItem("logado");

  if (logado !== "true") {
    router.push("/admin/login");
  }
}, []);

  if (!carros) return null;

  // 🔥 ORDENAÇÃO POR STATUS
  const statusOrder: Record<string, number> = {
    disponivel: 1,
    preparando: 2,
    vendido: 3,
  };

  const carrosOrdenados = [...carros].sort((a, b) => {
    const statusA =
      statusOrder[(a.status || "disponivel").toLowerCase().trim()] ?? 999;

    const statusB =
      statusOrder[(b.status || "disponivel").toLowerCase().trim()] ?? 999;

    if (statusA !== statusB) return statusA - statusB;

    return b.id - a.id;
  });

  return (
    <main
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1200 }}>

        {/* TOPO */}
        <div style={{ backgroundColor: "black", width: "100%" }}>
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "15px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            

            <button
              onClick={() => router.push("/admin/novo")}
              style={{
                padding: "8px 12px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: 6,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              ➕ Novo veículo
            </button>
          </div>
        </div>

        {/* GRID */}
        <div
          className="grid"
          style={{
            maxWidth: 1100,
            margin: "20px auto",
            padding: 10,
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          {carrosOrdenados.map((car) => {
            const status = car.status || "disponivel";

            return (
              <div
                key={car.id}
                style={{
                  position: "relative",
                  background: "#111827",
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid #1f2937",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
                }}
              >

                {/* FAIXA STATUS */}
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    left: -60,
                    transform: "rotate(-45deg)",
                    width: 220,
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "white",
                    padding: "8px 0",
                    background:
                      status === "vendido"
                        ? "#dc2626"
                        : status === "preparando"
                        ? "#374151"
                        : "#16a34a",
                    zIndex: 10,
                    fontSize: 13,
                  }}
                >
                  {status.toUpperCase()}
                </div>

                {/* BOTÃO EDITAR */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/admin/editar/${car.id}`);
                  }}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "rgba(0,0,0,0.8)",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 8px",
                    cursor: "pointer",
                    zIndex: 20,
                  }}
                >
                  ⚙️
                </button>

                {/* CARD */}
                <div
                  onClick={() => router.push(`/admin/editar/${car.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
  src={
    Array.isArray(car.imagens) && car.imagens.length > 0
      ? car.imagens[0]
      : "/logo.png"
  }
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                    }}
                  />

                  <div style={{ paddingTop: 10 }}>
  <h2 style={{ color: "white", fontWeight: "bold" }}>
    {car.nome}
  </h2>

  <p style={{ color: "#9ca3af" }}>
    {car.ano} • {car.cambio}
  </p>

  <p
    style={{
      color: "#3b82f6",
      fontWeight: "bold",
      marginTop: 5,
    }}
  >
    {formatarPreco(car.preco)}
  </p>

  <div
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(59,130,246,0.12)",
    color: "#3b82f6",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    marginTop: 8,
    border: "1px solid rgba(59,130,246,0.4)",
    boxShadow: "0 0 8px rgba(59,130,246,0.2)",
  }}
>
  {/* 👁 SVG PROFISSIONAL */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="#3b82f6"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 
      8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 
      7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>

  {car.cliques ?? 0} cliques
</div>

  {/* BOTÃO VER DETALHES (APENAS 1) */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      router.push(`/admin/editar/${car.id}`);
    }}
    style={{
      marginTop: 10,
      width: "100%",
      padding: 8,
      background: "transparent",
      border: "1px solid #3b82f6",
      color: "#3b82f6",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Ver detalhes
  </button>

  {/* BOTÃO EXCLUIR */}
  <button
    onClick={(e) => {
  e.stopPropagation();
  excluirCarro(car.id);
}}
    style={{
      marginTop: 8,
      width: "100%",
      padding: 8,
      background: "transparent",
      border: "1px solid #dc2626",
      color: "#dc2626",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Excluir veículo
  </button>
</div>
                </div>
              </div>
            );
          })}
        </div>
        

        {/* RESPONSIVO */}
        <style jsx>{`
          @media (max-width: 900px) {
            .grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }

          @media (max-width: 600px) {
            .grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

      </div>
    </main>
  );
}