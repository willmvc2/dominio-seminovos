"use client";

import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import { useCarros } from "../data/useCarros";
import { useEffect, useRef, useState } from "react";
import { formatarPreco } from "@/data/formatarPreco";
import { supabase } from "@/app/lib/supabase";
import { ShieldCheck, BadgeCheck, Handshake } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { carros } = useCarros();
  const [paginaAtual, setPaginaAtual] = useState(1);
  const carrosPorPagina = 9;
  const gridRef = useRef<HTMLDivElement>(null);
  const [imagensVendidos, setImagensVendidos] = useState<any[]>([]);
  const [slideAtual, setSlideAtual] = useState(0);

  const [arrasteX, setArrasteX] = useState(0);
  const [animandoSlide, setAnimandoSlide] = useState(true);

  const arrastandoSlide = useRef(false);
  const inicioArrasteX = useRef(0);
  const larguraSlide = useRef(0);
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
  // SLIDE AUTOMÁTICO - LOOP INFINITO
  useEffect(() => {
    if (imagensVendidos.length <= 1) return;

    const intervalo = setInterval(() => {
      if (!arrastandoSlide.current) {
        setAnimandoSlide(true);
        setSlideAtual((atual) => atual + 1);
      }
    }, 4000);

    return () => clearInterval(intervalo);
  }, [imagensVendidos.length]);

  // QUANDO CHEGAR NA CÓPIA DO PRIMEIRO SLIDE,
  // VOLTA PARA O PRIMEIRO SEM ANIMAÇÃO
  useEffect(() => {
    if (
      imagensVendidos.length > 1 &&
      slideAtual === imagensVendidos.length
    ) {
      const timer = setTimeout(() => {
        setAnimandoSlide(false);
        setSlideAtual(0);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimandoSlide(true);
          });
        });
      }, 650);

      return () => clearTimeout(timer);
    }
  }, [slideAtual, imagensVendidos.length]);


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

            <div
              className="slides-container"

              onPointerDown={(e) => {
                arrastandoSlide.current = true;
                inicioArrasteX.current = e.clientX;
                larguraSlide.current = e.currentTarget.clientWidth;

                e.currentTarget.setPointerCapture(e.pointerId);
              }}

              onPointerMove={(e) => {
                if (!arrastandoSlide.current) return;

                const movimento =
                  e.clientX - inicioArrasteX.current;

                setArrasteX(movimento);
              }}

              onPointerUp={() => {
                if (!arrastandoSlide.current) return;

                arrastandoSlide.current = false;

                const limite = larguraSlide.current * 0.2;

                if (arrasteX < -limite) {
                  setSlideAtual((atual) =>
                    atual === imagensVendidos.length - 1
                      ? 0
                      : atual + 1
                  );
                } else if (arrasteX > limite) {
                  setSlideAtual((atual) =>
                    atual === 0
                      ? imagensVendidos.length - 1
                      : atual - 1
                  );
                }

                setArrasteX(0);
              }}

              onPointerCancel={() => {
                arrastandoSlide.current = false;
                setArrasteX(0);
              }}

              style={{
                transform: `translateX(calc(-${slideAtual * 100}% + ${arrasteX}px))`,

                transition:
                  arrastandoSlide.current || !animandoSlide
                    ? "none"
                    : "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)",

                touchAction: "pan-y",

                cursor: arrastandoSlide.current
                  ? "grabbing"
                  : "grab",
              }}
            >

              {imagensVendidos.map((item) => (
                <div
                  key={item.id}
                  className="hero-slide"
                >
                  <img
                    src={item.imagem}
                    alt="Domínio Seminovos"
                    draggable={false}
                  />

                  <div className="slide-sombra"></div>

                  <div className="slide-texto">

                    <div className="slide-subtitulo">
                      <i></i>
                      <span>Negócios feitos pela</span>
                      <i></i>
                    </div>

                    <strong>DOMÍNIO SEMINOVOS</strong>

                    <p className="slide-frase">
                      SONHOS QUE GANHAM NOVAS HISTÓRIAS.
                    </p>

                    <div className="slide-diferenciais">

                      <div className="diferencial">
                        <ShieldCheck className="diferencial-icone" />
                        <span>CONFIANÇA</span>
                      </div>

                      <div className="diferencial-separador"></div>

                      <div className="diferencial">
                        <BadgeCheck className="diferencial-icone" />
                        <span>QUALIDADE</span>
                      </div>

                      <div className="diferencial-separador"></div>

                      <div className="diferencial">
                        <Handshake className="diferencial-icone" />
                        <span>SEMPRE COM VOCÊ</span>
                      </div>

                    </div>

                  </div>
                </div>
              ))}

              {/* CÓPIA DO PRIMEIRO SLIDE PARA LOOP INFINITO */}
              {imagensVendidos.length > 1 && (
                <div className="hero-slide">
                  <img
                    src={imagensVendidos[0].imagem}
                    alt="Domínio Seminovos"
                    draggable={false}
                  />

                  <div className="slide-sombra"></div>

                  <div className="slide-texto">

                    <div className="slide-subtitulo">
                      <i></i>
                      <span>Negócios feitos pela</span>
                      <i></i>
                    </div>

                    <strong>DOMÍNIO SEMINOVOS</strong>

                    <p className="slide-frase">
                      SONHOS QUE GANHAM NOVAS HISTÓRIAS.
                    </p>

                    <div className="slide-diferenciais">

                      <div className="diferencial">
                        <ShieldCheck className="diferencial-icone" />
                        <span>CONFIANÇA</span>
                      </div>

                      <div className="diferencial-separador"></div>

                      <div className="diferencial">
                        <BadgeCheck className="diferencial-icone" />
                        <span>QUALIDADE</span>
                      </div>

                      <div className="diferencial-separador"></div>

                      <div className="diferencial">
                        <Handshake className="diferencial-icone" />
                        <span>SEMPRE COM VOCÊ</span>
                      </div>

                    </div>

                  </div>
                </div>
              )}

            </div>


            {/* BOLINHAS */}
            {imagensVendidos.length > 1 && (
              <div className="slide-bolinhas">
                {imagensVendidos.map((item, index) => (
                  <button
                    key={item.id}
                    className={`slide-bolinha ${index === slideAtual ? "ativa" : ""
                      }`}
                    onClick={() => {
                      setSlideAtual(index);
                      setArrasteX(0);
                    }}
                    aria-label={`Ir para slide ${index + 1}`}
                  />
                ))}
              </div>
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
                  setPaginaAtual((pagina) => pagina - 1);

                  setTimeout(() => {
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
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
  width: 100%;
  max-width: none;
  aspect-ratio: 16 / 7;
  margin: 0;
  overflow: hidden;
  background: #020617;
}

.slides-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  will-change: transform;
}

.hero-slide {
  position: relative;
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
}

.hero-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  pointer-events: none;
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

/* TEXTO PREMIUM */
.slide-texto {
  position: absolute;
  z-index: 2;
  left: 7%;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #ffffff;
}


/* NEGÓCIOS FEITOS PELA */
.slide-subtitulo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.slide-subtitulo span {
  color: rgba(255, 255, 255, 0.88);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  white-space: nowrap;
}

.slide-subtitulo i {
  display: block;
  width: 42px;
  height: 1px;
  background: #3b82f6;
}


/* DOMÍNIO SEMINOVOS */
.slide-texto strong {
  color: #ffffff;
  font-size: 44px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -1.5px;
  white-space: nowrap;
  text-shadow: 0 3px 14px rgba(0, 0, 0, 0.65);
}


/* SONHOS QUE GANHAM NOVAS HISTÓRIAS */
.slide-frase {
  margin: 14px 0 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 3.2px;
  white-space: nowrap;
}


/* CONFIANÇA / QUALIDADE / SEMPRE COM VOCÊ */
.slide-diferenciais {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 22px;
}

.diferencial {
  display: flex;
  align-items: center;
  gap: 7px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 5px;
  font-weight: 600;
  letter-spacing: 1px;
  white-space: nowrap;
}

.diferencial-icone {
  width: 17px;
  height: 17px;
  color: #3b82f6;
  stroke-width: 1.7;
  flex-shrink: 0;
}

.diferencial-separador {
  width: 1px;
  height: 20px;
  background: rgba(59, 130, 246, 0.35);
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
    font-size: 10px;
  }
}


/* CELULAR */
@media (max-width: 600px) {

.slide-frase {
  margin-top: 7px;
  font-size: 11px;
  line-height: 1.3;
  letter-spacing: 0.4px;
}

  .grid {
    grid-template-columns: 1fr !important;
  }

  .hero-slider {
    height: 200px;
  }

  .slide-texto {
  left: 5%;
  top: 50%;
  width: 90%;
}

/* NEGÓCIOS FEITOS PELA */
.slide-subtitulo {
  gap: 6px;
  margin-bottom: 5px;
}

.slide-subtitulo span {
  font-size: 6px;
  letter-spacing: 1.4px;
}

.slide-subtitulo i {
  width: 18px;
}

/* DOMÍNIO SEMINOVOS */
.slide-texto strong {
  font-size: 18px;
  line-height: 1;
  letter-spacing: -0.4px;
}

/* SONHOS QUE GANHAM NOVAS HISTÓRIAS */
.slide-frase {
  margin-top: 7px;
  font-size: 6px;
  line-height: 1.2;
  letter-spacing: 1.2px;
}

/* CONFIANÇA / QUALIDADE / SEMPRE COM VOCÊ */
.slide-diferenciais {
  gap: 8px;
  margin-top: 10px;
}

.diferencial {
  gap: 3px;
  font-size: 5px !important;
  letter-spacing: 0.3px;
}

.diferencial span {
  font-size: 6px !important;
}

.diferencial-icone {
  width: 5px !important;
  height: 5px !important;
  min-width: 5px !important;
  stroke-width: 1.0;
}

.diferencial-separador {
  width: 1px;
  height: 9px;
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