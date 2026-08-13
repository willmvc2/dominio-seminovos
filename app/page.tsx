"use client";

import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import { useCarros } from "../data/useCarros";
import { useEffect, useState } from "react";
import { formatarPreco } from "@/data/formatarPreco";
import { supabase } from "@/app/lib/supabase";

export default function Home() {
  const router = useRouter();
  const { carros } = useCarros();
  const [paginaAtual, setPaginaAtual] = useState(1);
  const carrosPorPagina = 9;

  // 🔥 atualiza quando salva no admin
  useEffect(() => {
    const atualizar = () => { };

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

  const totalPaginas = Math.ceil(
    carrosOrdenados.length / carrosPorPagina
  );

  const inicio = (paginaAtual - 1) * carrosPorPagina;

  const carrosDaPagina = carrosOrdenados.slice(
    inicio,
    inicio + carrosPorPagina
  );

  async function abrirCarro(car: any) {
    if ((car.status || "disponivel") === "vendido") return;

    const novosCliques = (car.cliques ?? 0) + 1;

    const { error } = await supabase
      .from("carros")
      .update({ cliques: novosCliques })
      .eq("id", car.id);

    if (error) {
      console.log("Erro ao contabilizar clique:", error);
    }

    sessionStorage.setItem(
      "scrollY",
      window.scrollY.toString()
    );

    router.push(`/carro/${car.id}`);
  }

  if (!carros?.length) {
    return (
      <main
        style={{
          backgroundColor: "#0f172a",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="loading-neon">
          <span></span>
          <span></span>
        </div>

        <style jsx>{`
        .loading-neon {
          position: relative;
          width: 70px;
          height: 70px;
          animation: girar 1.2s linear infinite;
        }

        .loading-neon span {
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #00aaff;
          box-shadow:
            0 0 8px #00aaff,
            0 0 16px #00aaff,
            0 0 25px #008cff;
        }

        .loading-neon span:first-child {
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        .loading-neon span:last-child {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        @keyframes girar {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      </main>
    );
  }

  return (
    <main
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* CONTEÚDO PRINCIPAL */}
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          flex: 1,
        }}
      >
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
          ></div>
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
          {carrosDaPagina.map((car) => {
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
                  onClick={() => abrirCarro(car)}

                  style={{
                    cursor: isVendido ? "not-allowed" : "pointer",
                    opacity: isVendido ? 0.6 : 1,
                  }}
                >
                  <img
                    src={
                      Array.isArray(car.imagens)
                        ? car.imagens[0] || "/logo.png"
                        : typeof car.imagens === "string"
                          ? (() => {
                            try {
                              const lista = JSON.parse(car.imagens);
                              return Array.isArray(lista)
                                ? lista[0] || "/logo.png"
                                : "/logo.png";
                            } catch {
                              return "/logo.png";
                            }
                          })()
                          : "/logo.png"
                    }
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                    }}
                  />

                  <div style={{ padding: 15 }}>
                    <h2
                      style={{
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
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
                        abrirCarro(car);
                      }}

                      style={{
                        marginTop: 10,
                        width: "100%",
                        padding: 8,
                        background: "transparent",
                        border: "1px solid #3b82f6",
                        color: "#3b82f6",
                        borderRadius: 6,
                        cursor: isVendido
                          ? "not-allowed"
                          : "pointer",
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

        {totalPaginas > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
              margin: "20px 0 30px",
            }}
          >
            <button
              disabled={paginaAtual === 1}
              onClick={() => {
                setPaginaAtual((pagina) => pagina - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "1px solid #3b82f6",
                background: "transparent",
                color: paginaAtual === 1 ? "#64748b" : "#3b82f6",
                cursor: paginaAtual === 1 ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              ← Anterior
            </button>

            <span
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              {paginaAtual} / {totalPaginas}
            </span>

            <button
              disabled={paginaAtual === totalPaginas}
              onClick={() => {
                setPaginaAtual((pagina) => pagina + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "1px solid #3b82f6",
                background: "transparent",
                color:
                  paginaAtual === totalPaginas ? "#64748b" : "#3b82f6",
                cursor:
                  paginaAtual === totalPaginas ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              Próxima →
            </button>
          </div>
        )}

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

      <Footer />
    </main>
  );
}