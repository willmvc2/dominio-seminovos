"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useCarros } from "../../../data/useCarros";
import { formatarPreco } from "@/data/formatarPreco";

export default function DetalheCarro() {
  const { carros } = useCarros();
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);
  const carro = carros.find((c) => c.id === id);

  const imagens = Array.isArray(carro?.imagens)
    ? carro.imagens
    : [];

  const [imagemAtual, setImagemAtual] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const [entrada, setEntrada] = useState("");
  const [parcelas, setParcelas] = useState(36);
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [temCnh, setTemCnh] = useState(false);
  const [temTroca, setTemTroca] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // =========================
  // CARROSSEL / ARRASTO
  // =========================

  const [arrastoX, setArrastoX] = useState(0);

  const inicioArrasto = useRef<number | null>(null);
  const estaArrastando = useRef(false);
  const bloqueiaClique = useRef(false);

  useEffect(() => {
    if (!scrollRef.current) return;

    const itemWidth = 90;

    scrollRef.current.scrollTo({
      left: imagemAtual * itemWidth,
      behavior: "smooth",
    });
  }, [imagemAtual]);

  function iniciarArrasto(
    e: React.PointerEvent<HTMLDivElement>
  ) {
    if (imagens.length <= 1) return;

    inicioArrasto.current = e.clientX;
    estaArrastando.current = true;
    bloqueiaClique.current = false;

    setArrastoX(0);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch { }
  }

  function moverArrasto(
    e: React.PointerEvent<HTMLDivElement>
  ) {
    if (
      !estaArrastando.current ||
      inicioArrasto.current === null
    ) {
      return;
    }

    const distancia =
      e.clientX - inicioArrasto.current;

    setArrastoX(distancia);

    if (Math.abs(distancia) > 8) {
      bloqueiaClique.current = true;
    }
  }

  function finalizarArrasto() {
    if (!estaArrastando.current) return;

    estaArrastando.current = false;

    const distancia = arrastoX;

    setArrastoX(0);
    inicioArrasto.current = null;

    // Foi praticamente um clique
    if (Math.abs(distancia) < 45) {
      setTimeout(() => {
        bloqueiaClique.current = false;
      }, 50);

      return;
    }

    // ARRASTOU PARA ESQUERDA = PRÓXIMA
    if (distancia < 0) {
      setImagemAtual((prev) =>
        prev + 1 >= imagens.length
          ? 0
          : prev + 1
      );
    }

    // ARRASTOU PARA DIREITA = ANTERIOR
    if (distancia > 0) {
      setImagemAtual((prev) =>
        prev - 1 < 0
          ? imagens.length - 1
          : prev - 1
      );
    }

    setTimeout(() => {
      bloqueiaClique.current = false;
    }, 300);
  }

  function abrirFullscreen() {
    if (bloqueiaClique.current) return;

    setFullscreen(true);
  }

  // =========================

  if (!carro) {
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

  const linkWhatsapp =
    `https://wa.me/5511981223969?text=${encodeURIComponent(
      `Olá, tenho interesse no ${carro.nome} ${carro.ano}`
    )}`;

  const getEmbedUrl = (url: string) => {
    if (!url) return "";

    try {
      const parsed = new URL(url);

      let videoId = "";

      if (
        parsed.hostname.includes("youtube.com") &&
        parsed.pathname === "/watch"
      ) {
        videoId = parsed.searchParams.get("v") || "";
      } else if (parsed.hostname.includes("youtu.be")) {
        videoId = parsed.pathname.replace("/", "");
      } else if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.split("/shorts/")[1]?.split("/")[0] || "";
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.split("/embed/")[1]?.split("/")[0] || "";
      } else if (parsed.pathname.startsWith("/live/")) {
        videoId = parsed.pathname.split("/live/")[1]?.split("/")[0] || "";
      }

      if (!videoId) return url;

      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return url;
    }
  };

  return (
    <main style={mainStyle}>
      <div style={container}>

        {/* VOLTAR */}
        <button
          onClick={() => router.push("/")}
          style={backBtn}
        >
          ← Voltar
        </button>

        {/* IMAGEM PRINCIPAL COM DESLIZE */}
        <div
          onPointerDown={iniciarArrasto}
          onPointerMove={moverArrasto}
          onPointerUp={finalizarArrasto}
          onPointerCancel={finalizarArrasto}
          onClick={abrirFullscreen}
          style={{
            position: "relative",
            width: "100%",
            height: "40vh",
            overflow: "hidden",
            borderRadius: 10,
            touchAction: "pan-y",
            cursor:
              imagens.length > 1
                ? "grab"
                : "pointer",
          }}
        >
          {imagens.length > 0 ? (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                transform: `translateX(calc(-${imagemAtual * 100}% + ${arrastoX}px))`,
                transition: estaArrastando.current
                  ? "none"
                  : "transform 0.35s ease",
              }}
            >
              {imagens.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    flex: "0 0 100%",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    pointerEvents: "none",
                  }}
                />
              ))}
            </div>
          ) : (
            <img
              src="/logo.png"
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
          )}

          {/* INDICADORES */}
          {imagens.length > 1 && (
            <div style={dotsContainer}>
              {imagens.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width:
                      imagemAtual === index
                        ? 8
                        : 6,
                    height:
                      imagemAtual === index
                        ? 8
                        : 6,
                    borderRadius: "50%",
                    background:
                      imagemAtual === index
                        ? "white"
                        : "rgba(255,255,255,0.5)",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* MINIATURAS */}
        <div style={thumbWrapper}>
          <div
            ref={scrollRef}
            style={thumbScroll}
          >
            {imagens.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() =>
                  setImagemAtual(index)
                }
                style={{
                  width: 80,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 6,
                  cursor: "pointer",
                  flexShrink: 0,
                  border:
                    imagemAtual === index
                      ? "2px solid #16a34a"
                      : "2px solid transparent",
                }}
              />
            ))}
          </div>

          {carro.video && (
            <div
              onClick={() =>
                setVideoOpen(true)
              }
              style={videoBtn}
            >
              <div style={playOuter}>
                <div style={playIcon} />
              </div>
            </div>
          )}
        </div>

        {/* INFO */}
        <div style={infoBox}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            {carro.nome}
          </h1>

          <p>Ano: {carro.ano}</p>
          <p>KM: {carro.km || "-"}</p>
          <p>Câmbio: {carro.cambio}</p>

          <p>
            Combustível:{" "}
            {carro.combustivel || "-"}
          </p>

          <p
            style={{
              fontSize: 22,
              color: "#3b82f6",
              fontWeight: "bold",
            }}
          >
            {formatarPreco(carro.preco)}
          </p>

          <p style={{ whiteSpace: "pre-wrap" }}>
            {carro.descricao ||
              "Sem descrição"}
          </p>

          <a
            href={linkWhatsapp}
            target="_blank"
            style={whatsBtn}
          >
            WhatsApp
          </a>

          {/* SIMULAÇÃO */}
          <div
            style={{
              marginTop: 20,
              display: "grid",
              gap: 10,
            }}
          >
            <input
              placeholder="Valor de entrada"
              value={entrada}
              onChange={(e) =>
                setEntrada(e.target.value)
              }
              style={input}
            />

            <label>
              <input
                type="checkbox"
                checked={temTroca}
                onChange={() =>
                  setTemTroca(!temTroca)
                }
              />{" "}
              Troca
            </label>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {[12, 24, 36, 48, 60].map(
                (p) => (
                  <button
                    key={p}
                    onClick={() =>
                      setParcelas(p)
                    }
                    style={{
                      padding: 6,
                      background:
                        parcelas === p
                          ? "#16a34a"
                          : "#374151",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                    }}
                  >
                    {p}x
                  </button>
                )
              )}
            </div>

            <input
              placeholder="CPF"
              value={cpf}
              onChange={(e) =>
                setCpf(e.target.value)
              }
              style={input}
            />

            <input
              type="date"
              value={nascimento}
              onChange={(e) =>
                setNascimento(e.target.value)
              }
              style={input}
            />

            <label>
              <input
                type="checkbox"
                checked={temCnh}
                onChange={() =>
                  setTemCnh(!temCnh)
                }
              />{" "}
              CNH
            </label>

            <a
              href={`https://wa.me/5511981223969?text=${encodeURIComponent(
                `Simulação:
${carro.nome}
Preço: ${formatarPreco(carro.preco)}
Entrada: ${entrada}
Parcelas: ${parcelas}x
CPF: ${cpf}
Nascimento: ${nascimento}
CNH: ${temCnh ? "Sim" : "Não"}
Troca: ${temTroca ? "Sim" : "Não"}`
              )}`}
              target="_blank"
              style={whatsBtn}
            >
              Enviar simulação
            </a>
          </div>
        </div>

        {/* VIDEO MODAL */}
        {videoOpen && (
          <div
            onClick={() =>
              setVideoOpen(false)
            }
            style={overlay}
          >
            <div
              onClick={(e) =>
                e.stopPropagation()
              }
              style={modal}
            >
              <button
                onClick={() =>
                  setVideoOpen(false)
                }
                style={closeBtn}
              >
                ✕
              </button>

              <iframe
                src={getEmbedUrl(
                  carro.video
                )}
                width="100%"
                height="550"
                style={{
                  borderRadius: 10,
                }}
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* FULLSCREEN */}
        {fullscreen && (
          <div
            onClick={() =>
              setFullscreen(false)
            }
            style={{
              ...overlay,
              cursor: "pointer",
            }}
          >
            <img
              src={
                imagens[imagemAtual] ||
                "/logo.png"
              }
              draggable={false}
              style={{
                maxWidth: "95%",
                maxHeight: "95%",
                objectFit: "contain",
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}

/* ================= STYLES ================= */

const mainStyle = {
  backgroundColor: "#0f172a",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  padding: 20,
};

const container = {
  width: "100%",
  maxWidth: 800,
  color: "white",
};

const backBtn = {
  marginBottom: 20,
  padding: "8px 12px",
  background: "#374151",
  border: "none",
  borderRadius: 6,
  color: "white",
};

const thumbWrapper = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginTop: 10,
};

const thumbScroll = {
  display: "flex",
  gap: 10,
  overflowX: "auto" as const,
  flex: 1,
};

const videoBtn = {
  minWidth: 100,
  height: 68,
  background: "#000",
  borderRadius: 6,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
};

const playOuter = {
  width: 30,
  height: 20,
  background: "red",
  borderRadius: 4,
  position: "relative" as const,
};

const playIcon = {
  width: 0,
  height: 0,
  borderTop: "6px solid transparent",
  borderBottom: "6px solid transparent",
  borderLeft: "10px solid white",
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-40%, -50%)",
};

const infoBox = {
  background: "#111827",
  padding: 20,
  borderRadius: 10,
  marginTop: 20,
};

const input = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #374151",
  background: "#111827",
  color: "white",
};

const whatsBtn = {
  display: "block",
  marginTop: 10,
  padding: 12,
  background: "#16a34a",
  color: "white",
  textAlign: "center" as const,
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: "bold",
};

const dotsContainer = {
  position: "absolute" as const,
  bottom: 10,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: 5,
  background: "rgba(0,0,0,0.35)",
  padding: "4px 6px",
  borderRadius: 20,
  zIndex: 5,
};

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.9)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modal = {
  width: "90%",
  maxWidth: 400,
  background: "#000",
  padding: 10,
  borderRadius: 10,
};

const closeBtn = {
  background: "red",
  border: "none",
  borderRadius: "50%",
  width: 30,
  height: 30,
  color: "white",
};