"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, CSSProperties } from "react";
import { useCarros } from "../../../data/useCarros";
import { formatarPreco } from "@/data/formatarPreco";

export default function DetalheCarro() {
  const { carros, loading } = useCarros();
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);
  const carro = carros.find((c) => c.id === id);

  const imagens = (() => {
    if (!carro?.imagens) return [];
    if (Array.isArray(carro.imagens)) return carro.imagens;

    try {
      const parsed = JSON.parse(carro.imagens);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const [imagemAtual, setImagemAtual] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  // SIMULAÇÃO
  const [entrada, setEntrada] = useState("");
  const [parcelas, setParcelas] = useState(36);
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [temCnh, setTemCnh] = useState<boolean | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTo({
      left: imagemAtual * 90,
      behavior: "smooth",
    });
  }, [imagemAtual]);

  // LOADING
  if (loading || !carro) {
    return (
      <>
        <div className="loader-container">
          <div className="orbit">
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>

        <style jsx>{`
          .loader-container {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0f172a;
          }

          .orbit {
            position: relative;
            width: 80px;
            height: 80px;
            animation: spin 2s linear infinite;
          }

          .dot {
            position: absolute;
            width: 12px;
            height: 12px;
            background: #0ea5e9;
            border-radius: 50%;
            box-shadow: 0 0 10px #0ea5e9, 0 0 20px #0ea5e9;
          }

          .dot:first-child {
            top: 0;
            left: 50%;
            transform: translateX(-50%);
          }

          .dot:last-child {
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </>
    );
  }

  const linkWhatsapp = `https://wa.me/5511981223969?text=Olá, tenho interesse no ${carro.nome} ${carro.ano}`;

  function getEmbedUrl(url: string) {
    if (!url) return "";

    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }

    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }

    if (url.includes("shorts/")) {
      const id = url.split("shorts/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }

    return url;
  }

  return (
    <main style={mainStyle}>
      <div style={container}>
        <button onClick={() => router.push("/")} style={backBtn}>
          ← Voltar
        </button>

        {/* IMAGEM PRINCIPAL */}
        <div style={{ position: "relative" }}>
          <img
  src={imagens[imagemAtual] || "/logo.png"}
  onClick={() => setFullscreen((prev) => !prev)}
  onContextMenu={(e) => e.preventDefault()}
  onDragStart={(e) => e.preventDefault()}
  style={mainImage}
/>

          <button
            onClick={() =>
              setImagemAtual((prev) =>
                prev - 1 < 0 ? imagens.length - 1 : prev - 1
              )
            }
            style={arrowLeft}
          >
            ‹
          </button>

          <button
            onClick={() =>
              setImagemAtual((prev) =>
                prev + 1 >= imagens.length ? 0 : prev + 1
              )
            }
            style={arrowRight}
          >
            ›
          </button>
        </div>

        {/* THUMBS */}
        <div style={thumbWrapper}>
          <div ref={scrollRef} style={thumbScroll}>
            {imagens.map((img: string, index: number) => (
              <img
                key={index}
                src={img}
                onClick={() => setImagemAtual(index)}
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
            <div onClick={() => setVideoOpen(true)} style={videoBtn}>
              <div style={playOuter}>
                <div style={playIcon} />
              </div>
            </div>
          )}
        </div>

        {/* INFO */}
        <div style={infoBox}>
          <h1 style={{ fontSize: 24, fontWeight: "bold" }}>{carro.nome}</h1>

          <p>Ano: {carro.ano}</p>
          <p>KM: {carro.km || "-"}</p>
          <p>Câmbio: {carro.cambio}</p>
          <p>Combustível: {carro.combustivel || "-"}</p>

          <p style={{ fontSize: 22, color: "#3b82f6", fontWeight: "bold" }}>
            {formatarPreco(carro.preco)}
          </p>

          <p style={{ whiteSpace: "pre-wrap" }}>
            {carro.descricao || "Sem descrição"}
          </p>

          <a href={linkWhatsapp} target="_blank" style={whatsBtn}>
            WhatsApp
          </a>

          {/* SIMULAÇÃO */}
          <div style={{ marginTop: 20, display: "grid", gap: 10 }}>
            <input
              placeholder="Valor de entrada"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              style={input}
            />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[12, 24, 36, 48, 60].map((p) => (
                <button
                  key={p}
                  onClick={() => setParcelas(p)}
                  style={{
                    padding: 6,
                    background: parcelas === p ? "#16a34a" : "#374151",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                  }}
                >
                  {p}x
                </button>
              ))}
            </div>

            <input
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              style={input}
            />

            <input
              placeholder="DD/MM/AAAA"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
              style={input}
            />

            <div>
              <p>Tem CNH?</p>

              <label>
                <input
                  type="checkbox"
                  checked={temCnh === true}
                  onChange={() => setTemCnh(true)}
                />{" "}
                Sim
              </label>

              <label style={{ marginLeft: 10 }}>
                <input
                  type="checkbox"
                  checked={temCnh === false}
                  onChange={() => setTemCnh(false)}
                />{" "}
                Não
              </label>
            </div>

            <a
              href={`https://wa.me/5511981223969?text=${encodeURIComponent(
                `Simulação:
${carro.nome}
Preço: ${formatarPreco(carro.preco)}
Entrada: ${entrada}
Parcelas: ${parcelas}x
CPF: ${cpf}
Nascimento: ${nascimento}
CNH: ${
                  temCnh === null ? "Não informado" : temCnh ? "Sim" : "Não"
                }`
              )}`}
              target="_blank"
              style={whatsBtn}
            >
              Enviar simulação
            </a>
          </div>
        </div>

        {/* FULLSCREEN IMAGEM (CORREÇÃO QUE ESTAVA FALTANDO) */}
        {fullscreen && (
  <div onClick={() => setFullscreen(false)} style={overlay}>
    
    <div style={{ position: "relative", maxWidth: "95%", maxHeight: "95%" }}>
      
      <img
  src={imagens[imagemAtual] || "/logo.png"}
  onClick={() => setFullscreen(false)}
  onContextMenu={(e) => e.preventDefault()}   // ❌ bloqueia botão direito
  onDragStart={(e) => e.preventDefault()}      // ❌ bloqueia arrastar
  style={{
    width: "100%",
    height: "auto",
    borderRadius: 10,
    userSelect: "none",
    
  }}
   />
      {/* 🔥 MARCA D'ÁGUA */}
      <div
  style={{
    position: "absolute",
    bottom: 60,
    left: 0,
    width: "100%",
    textAlign: "center",
    fontSize: "clamp(12px, 2.5vw, 18px)",
    fontWeight: "bold",
    color: "rgba(255,255,255,0.35)",
    pointerEvents: "none",
    letterSpacing: 1,
  }}
>
  DOMINIOSEMINOVOS.COM.BR
</div>

    </div>

  </div>
)}

        {/* VIDEO MODAL */}
        {videoOpen && (
          <div onClick={() => setVideoOpen(false)} style={overlay}>
            <div onClick={(e) => e.stopPropagation()} style={modal}>
              <button onClick={() => setVideoOpen(false)} style={closeBtn}>
                ✕
              </button>

              <iframe
                src={getEmbedUrl(carro.video)}
                width="100%"
                height="400"
                style={{ borderRadius: 10 }}
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* STYLES */

const mainStyle: CSSProperties = {
  backgroundColor: "#0f172a",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  padding: 20,
};

const container: CSSProperties = {
  width: "100%",
  maxWidth: 800,
  color: "white",
};

const backBtn: CSSProperties = {
  marginBottom: 20,
  padding: "8px 12px",
  background: "#374151",
  border: "none",
  borderRadius: 6,
  color: "white",
};

const mainImage: CSSProperties = {
  width: "100%",
  height: "35vh",
  objectFit: "cover",
  borderRadius: 10,
};

const thumbWrapper: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginTop: 10,
};

const thumbScroll: CSSProperties = {
  display: "flex",
  gap: 10,
  overflowX: "auto",
  flex: 1,
};

const videoBtn: CSSProperties = {
  minWidth: 130,
  height: 75,
  background: "#000",
  borderRadius: 6,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const playOuter: CSSProperties = {
  width: 30,
  height: 20,
  background: "red",
  borderRadius: 4,
  position: "relative",
};

const playIcon: CSSProperties = {
  width: 0,
  height: 0,
  borderTop: "6px solid transparent",
  borderBottom: "6px solid transparent",
  borderLeft: "10px solid white",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-40%, -50%)",
};

const infoBox: CSSProperties = {
  background: "#111827",
  padding: 20,
  borderRadius: 10,
  marginTop: 20,
};

const input: CSSProperties = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #374151",
  background: "#111827",
  color: "white",
};

const whatsBtn: CSSProperties = {
  display: "block",
  marginTop: 10,
  padding: 12,
  background: "#16a34a",
  color: "white",
  textAlign: "center",
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: "bold",
};

const arrowLeft: CSSProperties = {
  position: "absolute",
  left: 5,
  top: "50%",
  transform: "translateY(-50%)",
  background: "rgba(0,0,0,0.5)",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: 40,
  height: 40,
};

const arrowRight: CSSProperties = {
  ...arrowLeft,
  left: "auto",
  right: 5,
};

const overlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.9)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modal: CSSProperties = {
  width: "90%",
  maxWidth: 400,
  background: "#000",
  padding: 10,
  borderRadius: 10,
};

const closeBtn: CSSProperties = {
  background: "red",
  border: "none",
  borderRadius: "50%",
  width: 30,
  height: 30,
  color: "white",
};