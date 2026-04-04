"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export default function NovoCarro() {
  const router = useRouter();

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

  function adicionarImagem(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const novas: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        novas.push(reader.result as string);

        if (novas.length === files.length) {
          setImagens((prev) => [...prev, ...novas]);
        }
      };

      reader.readAsDataURL(file);
    });
  }

  function excluirImagem(index: number) {
    const novas = imagens.filter((_, i) => i !== index);
    setImagens(novas);

    if (imagemAtual >= novas.length) {
      setImagemAtual(Math.max(novas.length - 1, 0));
    }
  }

  // 🔥 FUNÇÃO FINAL ESTÁVEL
  async function salvarCarro() {
    console.log("👉 CLIQUE DETECTADO");

    if (!db) {
      console.error("Firebase DB não inicializado");
      alert("Erro de conexão com banco");
      return;
    }

    if (!nome || !preco) {
      alert("Preencha nome e preço");
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
      status: "disponivel",
      criadoEm: Date.now(),
    };

    console.log("📦 ENVIANDO:", novo);

    try {
      const ref = await addDoc(collection(db, "carros"), novo);

      console.log("✅ SALVO COM ID:", ref.id);

      alert("Carro salvo com sucesso!");

      router.push("/admin");
    } catch (error: any) {
      console.error("❌ ERRO FIREBASE:", error?.message || error);
      alert("Erro ao salvar veículo");
    }
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
            src={imagens[imagemAtual] || "https://via.placeholder.com/800x400"}
            onClick={() => setFullscreen(true)}
            style={styles.mainImage}
          />

          {imagens.length === 0 && (
            <div
              onClick={() => document.getElementById("fileInput")?.click()}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 18,
                fontWeight: "bold",
                background: "rgba(0,0,0,0.4)",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Inserir imagem
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
                  border: imagemAtual === i ? "2px solid #16a34a" : "2px solid transparent",
                }}
              />

              <button onClick={() => excluirImagem(i)} style={styles.deleteBtn}>
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* UPLOAD */}
        <label style={styles.upload}>
          📸 Inserir fotos
          <input id="fileInput" type="file" multiple hidden onChange={adicionarImagem} />
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

          <button
  type="button"
  onClick={() => {
    console.log("🔥 BOTÃO FOI CLICADO");
    salvarCarro();
  }}
  style={styles.save}
>
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