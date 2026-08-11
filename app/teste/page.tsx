"use client";

import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import { useCarros } from "../data/useCarros";
import { useEffect } from "react";
import { formatarPreco } from "@/data/formatarPreco";

export default function Home() {
  const router = useRouter();
  const { carros } = useCarros();

  // 🔥 atualiza quando salva no admin
  useEffect(() => {
    const atualizar = () => {
  
    };

    window.addEventListener("carros-updated", atualizar);
    return () => window.removeEventListener("carros-updated", atualizar);
  }, []);

  // 🔥 restaura scroll
  useEffect(() => {
    const scroll = sessionStorage.getItem("scrollY");

    if (scroll) {
      setTimeout(() => {
        window.scrollTo(0, Number(scroll));
      }, 100);

      sessionStorage.removeItem("scrollY");
    }
  }, []);

  // 🔥 prioridade status
  const prioridade: any = {
    disponivel: 1,
    preparando: 2,
    vendido: 3,
  };

  const carrosOrdenados = [...carros].sort((a, b) => {
    const pA = prioridade[a.status || "disponivel"] || 99;
    const pB = prioridade[b.status || "disponivel"] || 99;

    if (pA !== pB) return pA - pB;
    return b.id - a.id;
  });

  if (!carros?.length) {
    return (
      <main style={{ color: "white", padding: 20 }}>
        Nenhum veículo cadastrado
      </main>
    );
  }

  return (
    <main
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column", // 🔥 CORREÇÃO IMPORTANTE
      }}
    >
      {/* CONTEÚDO PRINCIPAL */}
      <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", flex: 1 }}>

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
            const isVendido = status === "vendido";

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
                {/* STATUS */}
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

                {/* CARD */}
                <div
                  onClick={() => {
                    if (isVendido) return;

                    sessionStorage.setItem(
                      "scrollY",
                      window.scrollY.toString()
                    );

                    router.push(`/carro/${car.id}`);
                  }}
                  style={{
                    cursor: isVendido ? "not-allowed" : "pointer",
                    opacity: isVendido ? 0.6 : 1,
                  }}
                >
                  <img
                    src={
  Array.isArray(car.imagens)
    ? car.imagens[0]
    : typeof car.imagens === "string"
    ? JSON.parse(car.imagens)[0]
    : "/logo.png"
}
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                    }}
                  />

                  <div style={{ padding: 15 }}>
                    <h2 style={{ color: "white", fontWeight: "bold" }}>
                      {car.nome}
                    </h2>

                    <p style={{ color: "#9ca3af" }}>
                      {car.ano} • {car.cambio}
                    </p>

                    {status !== "vendido" && (
                      <p
                        style={{
                          color: "#3b82f6",
                          fontWeight: "bold",
                          marginTop: 5,
                        }}
                      >
                        {formatarPreco(car.preco)}
                      </p>
                    )}

                    <button
                      disabled={isVendido}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isVendido) return;
                        router.push(`/carro/${car.id}`);
                      }}
                      style={{
                        marginTop: 10,
                        width: "100%",
                        padding: 8,
                        background: "transparent",
                        border: "1px solid #3b82f6",
                        color: "#3b82f6",
                        borderRadius: 6,
                        cursor: isVendido ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        opacity: isVendido ? 0.5 : 1,
                      }}
                    >
                      Ver detalhes
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

      {/* 🔥 FOOTER (CORRETO AGORA) */}
      <Footer />
    </main>
  );
}