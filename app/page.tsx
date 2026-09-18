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


        {/* NEGÓCIOS FEITOS */}
        {imagensVendidos.length > 0 && (
          <section className="negocios-section">

            <div className="negocios-cabecalho">
              <div className="negocios-linha1">
                Negócios feitos pela
              </div>

              <div className="negocios-linha2">
                Domínio Seminovos
              </div>

              <div className="negocios-traco"></div>
            </div>

            <div className="negocios-janela">

              <div className="negocios-pista">

                {/* PRIMEIRA SEQUÊNCIA */}
                {[...imagensVendidos, ...imagensVendidos, ...imagensVendidos, ...imagensVendidos].map(
                  (item, index) => (
                    <div
                      className="negocio-foto"
                      key={`${item.id}-${index}`}
                    >
                      <img
                        src={item.imagem}
                        alt="Negócio realizado pela Domínio Seminovos"
                      />
                    </div>
                  )
                )}

                {/* REPETIÇÃO PARA O LOOP NÃO DAR PULO */}
                {imagensVendidos.map((item) => (
                  <div
                    className="negocio-foto"
                    key={`copia-${item.id}`}
                  >
                    <img
                      src={item.imagem}
                      alt=""
                    />
                  </div>
                ))}

              </div>

            </div>

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
        )}

        {/* CARROSSEL E RESPONSIVO */}
        <style jsx>{`

  /* ========================================
   NEGÓCIOS FEITOS
======================================== */

.negocios-section {
  width: 100%;
  padding: 42px 0 32px;
  overflow: hidden;

  background:
    radial-gradient(
      ellipse at center,
      rgba(0, 76, 180, 0.18) 0%,
      rgba(15, 23, 42, 0) 65%
    );
}

/* TÍTULO */

.negocios-cabecalho {
  text-align: center;
  margin-bottom: 35px;
}

.negocios-linha1 {
  color: #b6bdca;
  font-size: 25px;
  font-style: italic;
  font-weight: 400;
  line-height: 1.1;
}

.negocios-linha2 {
  color: #eaf2ff;
  font-size: 34px;
  font-style: italic;
  font-weight: 900;
  line-height: 1.2;

  text-shadow:
    0 0 8px rgba(59, 130, 246, 0.8),
    0 0 18px rgba(37, 99, 235, 0.5);
}

.negocios-traco {
  width: 200px;
  height: 2px;
  margin: 10px auto 0;

  background: linear-gradient(
    90deg,
    transparent,
    #2563eb,
    #60a5fa,
    #2563eb,
    transparent
  );

  box-shadow:
    0 0 8px #2563eb;
}

/* JANELA DO CARROSSEL */

.negocios-janela {
  width: 100%;
  overflow: hidden;
  position: relative;

  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 6%,
    black 94%,
    transparent 100%
  );

  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 6%,
    black 94%,
    transparent 100%
  );
}

/* PISTA */

.negocios-pista {
  --gap: 22px;

  display: flex;
  align-items: center;
  width: max-content;
  gap: var(--gap);

  animation: negociosMovimento 28s linear infinite;
  will-change: transform;
}

/* QUADRADOS DAS FOTOS */

.negocio-foto {
  flex: 0 0 auto;

  width: 270px;
  height: 170px;

  border-radius: 15px;
  overflow: hidden;

  border: 2px solid rgba(59, 130, 246, 0.9);

  background: #111827;

  box-shadow:
    0 0 8px rgba(59, 130, 246, 0.8),
    0 0 20px rgba(37, 99, 235, 0.25),
    0 8px 20px rgba(0, 0, 0, 0.55);
}

.negocio-foto img {
  width: 100%;
  height: 100%;

  display: block;
  object-fit: cover;
}

/* ESQUERDA → DIREITA */

@keyframes negociosMovimento {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(-50% - (var(--gap) / 2)));
  }
}


/* NOSSO ESTOQUE */

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


/* TABLET */

@media (max-width: 900px) {

  .grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  .negocio-foto {
    width: 230px;
    height: 145px;
  }

  .negocios-pista {
    gap: 14px;
  }
}


/* CELULAR */

@media (max-width: 600px) {

  .grid {
    grid-template-columns: 1fr !important;
  }

  .negocios-section {
    padding: 25px 0 20px;
  }

  .negocios-cabecalho {
    margin-bottom: 22px;
  }

  .negocios-linha1 {
    font-size: 17px;
  }

  .negocios-linha2 {
    font-size: 24px;
  }

  .negocios-traco {
    width: 145px;
    margin-top: 7px;
  }

  .negocio-foto {
    width: 165px;
    height: 105px;
    border-radius: 10px;
    border-width: 1px;
  }

  .negocios-pista {
    gap: 10px;
    animation-duration: 22s;
  }

  .titulo-estoque {
    font-size: 24px;
    margin-top: 12px;
    padding: 0 15px;
  }
}

`}</style>

      </div>

      <Footer />
    </main>
  );
}