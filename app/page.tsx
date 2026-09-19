"use client";

import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import { useCarros } from "../data/useCarros";
import { useEffect, useRef, useState } from "react";
import { formatarPreco } from "@/data/formatarPreco";
import { supabase } from "@/app/lib/supabase";

export default function Home() {
  const router = useRouter();
  const { carros } = useCarros();
  const [paginaAtual, setPaginaAtual] = useState(1);
  const carrosPorPagina = 9;
  const gridRef = useRef<HTMLDivElement>(null);
  const [imagensVendidos, setImagensVendidos] = useState<any[]>([]);
  const [slideAtual, setSlideAtual] = useState(0);
  // ==========================================
  // CARROSSEL DE VEÍCULOS VENDIDOS
  // ==========================================

  // Busca as imagens cadastradas no Supabase
  useEffect(() => {
    async function carregarVendidos() {
      const { data, error } = await supabase
        .from("carrossel_vendidos")
        .select("*")
        .eq("ativo", true)
        .order("ordem", { ascending: true });

      if (error) {
        console.log("Erro ao carregar carrossel:", error);
        return;
      }

      console.log("CARROSSEL VENDIDOS:", data);

      setImagensVendidos(data || []);
    }

    carregarVendidos();
  }, []);

  // SLIDE AUTOMÁTICO
  useEffect(() => {
    if (imagensVendidos.length <= 1) return;

    const intervalo = setInterval(() => {
      setSlideAtual((atual) =>
        atual === imagensVendidos.length - 1 ? 0 : atual + 1
      );
    }, 4000);

    return () => clearInterval(intervalo);
  }, [imagensVendidos.length]);


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


        {/* SLIDE PRINCIPAL */}
        {imagensVendidos.length > 0 && (
          <section className="hero-slider">

            <div className="slides-container">
              {imagensVendidos.map((item, index) => (
                <div
                  key={item.id}
                  className={`hero-slide ${index === slideAtual ? "ativo" : ""
                    }`}
                >
                  <img
                    src={item.imagem}
                    alt="Domínio Seminovos"
                  />

                  <div className="slide-sombra"></div>

                  <div className="slide-texto">
                    <span>Negócios feitos pela</span>
                    <strong>Domínio Seminovos</strong>
                  </div>
                </div>
              ))}
            </div>

            {imagensVendidos.length > 1 && (
              <>
                <button
                  className="slide-seta slide-anterior"
                  onClick={() =>
                    setSlideAtual((atual) =>
                      atual === 0
                        ? imagensVendidos.length - 1
                        : atual - 1
                    )
                  }
                  aria-label="Slide anterior"
                >
                  ‹
                </button>

                <button
                  className="slide-seta slide-proximo"
                  onClick={() =>
                    setSlideAtual((atual) =>
                      atual === imagensVendidos.length - 1
                        ? 0
                        : atual + 1
                    )
                  }
                  aria-label="Próximo slide"
                >
                  ›
                </button>

                <div className="slide-bolinhas">
                  {imagensVendidos.map((item, index) => (
                    <button
                      key={item.id}
                      className={`slide-bolinha ${index === slideAtual ? "ativa" : ""
                        }`}
                      onClick={() => setSlideAtual(index)}
                      aria-label={`Ir para slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

          </section>
        )}



        <div className="titulo-estoque">
          Nosso Estoque
        </div>

        {/* GRID */}
        <div
          ref={gridRef}
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

        {
          totalPaginas > 1 && (
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
                  setPaginaAtual((pagina) => pagina + 1);

                  setTimeout(() => {
                    gridRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 100);
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

                  setTimeout(() => {
                    gridRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 100);
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
          )
        }

        {/* CARROSSEL E RESPONSIVO */}
        <style jsx>{`

  /* ========================================
   SLIDE PRINCIPAL
======================================== */

.hero-slider {
  position: relative;
  width: calc(100% - 40px);
  height: 400px;
  margin: 20px auto 0;
  overflow: hidden;
  background: #020617;
  border-radius: 18px;
}

.slides-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  transform: scale(1.04);
  transition:
    opacity 1s ease,
    transform 5s ease,
    visibility 1s ease;
}

.hero-slide.ativo {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  z-index: 1;
}

.hero-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* DEGRADÊ SOBRE A FOTO */
.slide-sombra {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(2, 6, 23, 0.82) 0%,
      rgba(2, 6, 23, 0.38) 45%,
      rgba(2, 6, 23, 0.05) 75%
    ),
    linear-gradient(
      0deg,
      rgba(2, 6, 23, 0.45) 0%,
      transparent 45%
    );
}

/* TEXTO */
.slide-texto {
  position: absolute;
  z-index: 2;
  left: 7%;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  text-shadow: 0 3px 15px rgba(0, 0, 0, 0.8);
}

.slide-texto span {
  color: #e5e7eb;
  font-size: 25px;
  font-style: italic;
  font-weight: 400;
}

.slide-texto strong {
  margin-top: 3px;
  color: white;
  font-size: 43px;
  line-height: 1.05;
  font-style: italic;
  font-weight: 900;
  text-shadow:
    0 0 12px rgba(59, 130, 246, 0.8),
    0 0 25px rgba(37, 99, 235, 0.45);
}

/* SETAS */
.slide-seta {
  position: absolute;
  z-index: 5;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  background: rgba(2, 6, 23, 0.45);
  color: white;
  font-size: 38px;
  line-height: 40px;
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition: 0.25s;
}

.slide-seta:hover {
  background: rgba(37, 99, 235, 0.8);
  border-color: #60a5fa;
}

.slide-anterior {
  left: 20px;
}

.slide-proximo {
  right: 20px;
}

/* BOLINHAS */
.slide-bolinhas {
  position: absolute;
  z-index: 5;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 9px;
}

.slide-bolinha {
  width: 10px;
  height: 10px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  transition: 0.3s;
}

.slide-bolinha.ativa {
  width: 28px;
  border-radius: 10px;
  background: #3b82f6;
  box-shadow: 0 0 10px #3b82f6;
}

/* TABLET */
@media (max-width: 900px) {

  .grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  .hero-slider {
    height: 400px;
  }

  .slide-texto strong {
    font-size: 36px;
  }

  .slide-texto span {
    font-size: 21px;
  }
}


/* CELULAR */
@media (max-width: 600px) {

  .grid {
    grid-template-columns: 1fr !important;
  }

  .hero-slider {
    height: 200px;
  }

  .slide-texto {
    left: 14%;
    top: 50%;
  }

  .slide-texto span {
    font-size: 10px;
  }

  .slide-texto strong {
    font-size: 20px;
  }

  .slide-seta {
    width: 36px;
    height: 36px;
    font-size: 28px;
    line-height: 30px;
  }

  .slide-anterior {
    left: 10px;
  }

  .slide-proximo {
    right: 10px;
  }

  .slide-bolinhas {
    bottom: 12px;
  }

  .slide-bolinha {
    width: 8px;
    height: 8px;
  }

  .slide-bolinha.ativa {
    width: 22px;
  }

  .titulo-estoque {
  width: 100%;
  max-width: 1100px;
  margin: 20px auto 0;
  padding: 0 10px;
  color: white;
  font-size: 30px;
  font-weight: 900;
  box-sizing: border-box;
}
}


`}</style>

      </div >

      <Footer />
    </main >
  );
}