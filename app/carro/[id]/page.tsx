"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useCarros } from "../../../data/useCarros";

export default function DetalheCarro() {
  const { carros } = useCarros();
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);
  const carro = carros.find((c) => c.id === id);

  const [imagemAtual, setImagemAtual] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const [entrada, setEntrada] = useState("");
  const [parcelas, setParcelas] = useState(36);
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [temCnh, setTemCnh] = useState(false);
  const [temTroca, setTemTroca] = useState(false);

  const carrosselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carrosselRef.current) {
      const container = carrosselRef.current;
      const active = container.children[imagemAtual] as HTMLElement;

      if (active) {
        active.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [imagemAtual]);

  if (!carro) return <p style={{ color: "white" }}>Carro não encontrado</p>;

  const linkWhatsapp = `https://wa.me/5511981223969?text=Olá, tenho interesse no ${carro.nome} ${carro.ano}`;

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    return url.replace("watch?v=", "embed/");
  };

  // 🔥 formata preço com R$
  const precoFormatado =
    typeof carro.preco === "string" && carro.preco.startsWith("R$")
      ? carro.preco
      : `R$ ${carro.preco}`;

  return (
    <main
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 800, color: "white" }}>
        {/* VOLTAR */}
        <button
          onClick={() => router.push("/")}
          style={{
            marginBottom: 20,
            padding: "8px 12px",
            background: "#374151",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          ← Voltar
        </button>

        {/* IMAGEM PRINCIPAL */}
        <div style={{ position: "relative" }}>
          <img
            src={carro.imagens?.[imagemAtual] || "/logo.png"}
            onClick={() => setFullscreen(true)}
            style={{
              width: "100%",
              height: "40vh",
              objectFit: "cover",
              borderRadius: 10,
            }}
          />

          <button
            onClick={() =>
              setImagemAtual((prev) =>
                prev - 1 < 0 ? carro.imagens.length - 1 : prev - 1
              )
            }
            style={arrowLeft}
          >
            ‹
          </button>

          <button
            onClick={() =>
              setImagemAtual((prev) =>
                prev + 1 >= carro.imagens.length ? 0 : prev + 1
              )
            }
            style={arrowRight}
          >
            ›
          </button>
        </div>

        {/* MINIATURAS + BOTÃO VIDEO */}
        <div style={{ position: "relative", marginTop: 10 }}>
          <div
            ref={carrosselRef}
            style={{
              display: "flex",
              gap: 10,
              overflowX: "auto",
              paddingRight: 110,
              scrollBehavior: "smooth",
            }}
          >
            {carro.imagens?.map((img, index) => (
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
            <div
              onClick={() => setVideoOpen(true)}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                height: "100%",
                width: 100,
                background: "#000",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "1px solid #333",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 20,
                  background: "red",
                  borderRadius: 4,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                    borderLeft: "10px solid white",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-40%, -50%)",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* INFO */}
        <div
          style={{
            background: "#111827",
            padding: 20,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <h1 style={{ fontSize: 24, fontWeight: "bold" }}>{carro.nome}</h1>

          <p>Ano: {carro.ano}</p>
          <p>KM: {carro.km || "-"}</p>
          <p>Câmbio: {carro.cambio}</p>
          <p>Combustível: {carro.combustivel || "-"}</p>

          <p style={{ fontSize: 22, color: "#3b82f6", fontWeight: "bold" }}>
            {precoFormatado}
          </p>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <a
              href={linkWhatsapp}
              target="_blank"
              style={{
                flex: 1,
                textAlign: "center",
                padding: 12,
                background: "#16a34a",
                color: "white",
                borderRadius: 8,
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              WhatsApp
            </a>
          </div>

          {/* SIMULAÇÃO */}
          <div style={{ marginTop: 20, display: "grid", gap: 10 }}>
            <p style={{ fontWeight: "bold" }}>
              Simulação para {carro.nome} - {precoFormatado}
            </p>

            <input
              placeholder="Valor de entrada (R$)"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              style={inputStyle}
            />

            <label>
              <input
                type="checkbox"
                checked={temTroca}
                onChange={() => setTemTroca(!temTroca)}
              />{" "}
              Veículo na troca
            </label>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[12, 24, 36, 48, 60].map((p) => (
                <button
                  key={p}
                  onClick={() => setParcelas(p)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    background: parcelas === p ? "#16a34a" : "#374151",
                    color: "white",
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
              style={inputStyle}
            />

            <input
              type="date"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
              style={inputStyle}
            />

            <label>
              <input
                type="checkbox"
                checked={temCnh}
                onChange={() => setTemCnh(!temCnh)}
              />{" "}
              Possui CNH
            </label>

            <a
              href={`https://wa.me/5511981223969?text=${encodeURIComponent(
                `Simulação do veículo: ${carro.nome}
Preço: ${precoFormatado}
Entrada: R$ ${entrada}
Parcelas: ${parcelas}x
CPF: ${cpf}
Nascimento: ${nascimento}
CNH: ${temCnh ? "Sim" : "Não"}
Troca: ${temTroca ? "Sim" : "Não"}`
              )}`}
              target="_blank"
              style={{
                padding: 12,
                background: "#16a34a",
                borderRadius: 8,
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Enviar simulação no WhatsApp
            </a>
          </div>
        </div>

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
                height="250"
                style={{ borderRadius: 10 }}
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* FULLSCREEN */}
        {fullscreen && (
          <div onClick={() => setFullscreen(false)} style={overlay}>
            <img
              src={carro.imagens?.[imagemAtual]}
              style={{ maxWidth: "95%", maxHeight: "95%" }}
            />
          </div>
        )}
      </div>
    </main>
  );
}

/* STYLES */
const inputStyle = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #374151",
  background: "#111827",
  color: "white",
};

const arrowLeft = {
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
  cursor: "pointer",
};

const arrowRight = {
  ...arrowLeft,
  left: "auto",
  right: 5,
};

const overlay = {
  position: "fixed",
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
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: 30,
  height: 30,
  marginBottom: 10,
  cursor: "pointer",
};