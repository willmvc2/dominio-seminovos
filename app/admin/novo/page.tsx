"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCarros } from "../../../data/useCarros";
import { supabase } from "@/app/lib/supabase";

export default function NovoCarro() {
  const router = useRouter();
  const { carros, salvar } = useCarros();

  const [imagemAtual, setImagemAtual] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const [nome, setNome] = useState("");
  const [ano, setAno] = useState("");
  const [km, setKm] = useState("");
  const [cambio, setCambio] = useState("");
  const [combustivel, setCombustivel] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [video, setVideo] = useState("");

  const [imagens, setImagens] = useState<string[]>([]);

  // ✅ UPLOAD REAL PARA SUPABASE
  async function adicionarImagem(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const nomeArquivo = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("carros")
        .upload(nomeArquivo, file);

      if (error) {
        alert("Erro ao enviar imagem");
        console.log(error);
        return;
      }

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/carros/${nomeArquivo}`;

      urls.push(url);
    }

    setImagens((prev) => [...prev, ...urls]);
  }

  function excluirImagem(index: number) {
    const novas = imagens.filter((_, i) => i !== index);
    setImagens(novas);

    if (imagemAtual >= novas.length) {
      setImagemAtual(Math.max(novas.length - 1, 0));
    }
  }

  function salvarCarro() {
    if (!nome || !preco) {
      alert("Preencha pelo menos nome e preço");
      return;
    }

    const novo = {
  nome,
  ano,
  km,
  cambio,
  combustivel,
  preco,
  descricao,
  video,
  imagens,
  status: "disponivel", // 👈 ADICIONA ISSO
};

    salvar(novo);

    router.push("/admin");
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>

        <button onClick={() => router.push("/admin")} style={styles.back}>
          ← Voltar
        </button>

        {/* IMAGEM PRINCIPAL */}
        <div style={{ position: "relative" }}>
          <img
            src={imagens[imagemAtual] || "/logo.png"}
            onClick={() => {
              if (imagens.length === 0) {
                document.querySelector<HTMLInputElement>('input[type="file"]')?.click();
              } else {
                setFullscreen(true);
              }
            }}
            style={styles.mainImage}
          />

          {imagens.length === 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: 18,
                background: "rgba(0,0,0,0.4)",
                borderRadius: 10,
                cursor: "pointer",
              }}
              onClick={() =>
                document.querySelector<HTMLInputElement>('input[type="file"]')?.click()
              }
            >
              📸 Inserir fotos
            </div>
          )}
        </div>

        {/* MINIATURAS */}
        <div style={styles.thumbs}>
          {imagens.map((img, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img
                src={img}
                onClick={() => setImagemAtual(i)}
                style={{
                  ...styles.thumb,
                  border:
                    imagemAtual === i
                      ? "2px solid #16a34a"
                      : "2px solid transparent",
                }}
              />

              <button
                onClick={() => excluirImagem(i)}
                style={styles.deleteBtn}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* UPLOAD */}
        <label style={styles.upload}>
          📸 Inserir fotos
          <input type="file" multiple hidden onChange={adicionarImagem} />
        </label>

        {/* FORM */}
        <div style={styles.form}>
          <input placeholder="Nome do veículo" value={nome} onChange={(e) => setNome(e.target.value)} style={styles.input} />
          <input placeholder="Ano" value={ano} onChange={(e) => setAno(e.target.value)} style={styles.input} />
          <input placeholder="KM" value={km} onChange={(e) => setKm(e.target.value)} style={styles.input} />
          <input placeholder="Câmbio" value={cambio} onChange={(e) => setCambio(e.target.value)} style={styles.input} />
          <input placeholder="Combustível" value={combustivel} onChange={(e) => setCombustivel(e.target.value)} style={styles.input} />
          <input placeholder="Preço" value={preco} onChange={(e) => setPreco(e.target.value)} style={styles.input} />

          <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} style={styles.textarea} />

          <input placeholder="Vídeo YouTube" value={video} onChange={(e) => setVideo(e.target.value)} style={styles.input} />

          <button onClick={salvarCarro} style={styles.save}>
            Salvar veículo
          </button>
        </div>
      </div>

      {/* FULLSCREEN */}
      {fullscreen && (
        <div onClick={() => setFullscreen(false)} style={styles.fullscreen}>
          <img src={imagens[imagemAtual]} style={styles.fullImg} />
        </div>
      )}
    </main>
  );
}

/* STYLES */

const styles: any = {
  main: { background: "#0f172a", minHeight: "100vh", padding: 20 },
  container: { maxWidth: 900, margin: "0 auto", color: "white" },

  back: {
    marginBottom: 20,
    padding: "8px 12px",
    background: "#374151",
    color: "white",
    border: "none",
    borderRadius: 6,
  },

  mainImage: {
    width: "100%",
    height: 300,
    objectFit: "cover",
    borderRadius: 10,
  },

  thumbs: {
    display: "flex",
    gap: 10,
    marginTop: 10,
    overflowX: "auto",
  },

  thumb: {
    width: 80,
    height: 60,
    objectFit: "cover",
    borderRadius: 6,
    cursor: "pointer",
  },

  deleteBtn: {
    position: "absolute",
    top: 2,
    right: 2,
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: 20,
    height: 20,
    fontSize: 12,
    cursor: "pointer",
  },

  upload: {
    display: "block",
    marginTop: 10,
    padding: 10,
    background: "#1f2937",
    borderRadius: 8,
    textAlign: "center",
    cursor: "pointer",
  },

  form: {
    marginTop: 20,
    display: "grid",
    gap: 10,
    background: "#111827",
    padding: 20,
    borderRadius: 10,
  },

  input: {
    padding: 10,
    borderRadius: 6,
    background: "#0f172a",
    border: "1px solid #374151",
    color: "white",
  },

  textarea: {
    padding: 10,
    minHeight: 80,
    borderRadius: 6,
    background: "#0f172a",
    border: "1px solid #374151",
    color: "white",
  },

  save: {
    padding: 12,
    background: "#16a34a",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
    color: "white",
  },

  fullscreen: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.95)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  fullImg: {
    maxWidth: "95%",
    maxHeight: "95%",
  },
};