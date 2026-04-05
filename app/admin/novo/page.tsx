"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function NovoCarro() {
  const router = useRouter();

  // Estados do formulário
  const [imagemAtual, setImagemAtual] = useState(0);
  const [nome, setNome] = useState("");
  const [ano, setAno] = useState("");
  const [km, setKm] = useState("");
  const [cambio, setCambio] = useState("");
  const [combustivel, setCombustivel] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [video, setVideo] = useState("");
  const [imagens, setImagens] = useState<string[]>([]);

  // Função para adicionar imagens
  function adicionarImagem(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const novas: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result) {
          novas.push(reader.result as string);

          if (novas.length === files.length) {
            setImagens((prev) => [...prev, ...novas]);
          }
        }
      };

      reader.readAsDataURL(file);
    });
  }

  // Função para excluir imagem
  function excluirImagem(index: number) {
    const novas = imagens.filter((_, i) => i !== index);
    setImagens(novas);

    if (imagemAtual >= novas.length) {
      setImagemAtual(Math.max(novas.length - 1, 0));
    }
  }

  // Função para salvar no Firebase
  async function salvarCarro() {
    console.log("🔥 CLICOU SALVAR");

    if (!nome || !ano || !preco) {
      alert("Preencha pelo menos Nome, Ano e Preço");
      return;
    }

    try {
      const novoCarro = {
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

      const ref = await addDoc(collection(db, "carros"), novoCarro);

      console.log("✅ SALVO COM ID:", ref.id);
      alert("Carro salvo com sucesso!");

      // Limpa formulário
      setNome("");
      setAno("");
      setKm("");
      setCambio("");
      setCombustivel("");
      setPreco("");
      setDescricao("");
      setVideo("");
      setImagens([]);

      router.push("/admin");
    } catch (error) {
      console.error("❌ ERRO AO SALVAR:", error);
      alert("Erro ao salvar veículo. Veja o console.");
    }
  }

  return (
    <main style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>Cadastrar Novo Veículo</h1>

      <button 
        onClick={() => router.push("/admin")}
        style={{ marginBottom: 20, padding: "8px 16px" }}
      >
        ← Voltar para Admin
      </button>

      {/* Preview da imagem principal */}
      <div style={{ marginBottom: 15 }}>
        <img
          src={imagens[imagemAtual] || "https://picsum.photos/800/400?text=Sem+Imagem"}
          alt="Preview do veículo"
          style={{ 
            width: "100%", 
            maxHeight: 320, 
            objectFit: "cover",
            borderRadius: 8 
          }}
        />
      </div>

      {/* Upload de imagens */}
      <div style={{ marginBottom: 15 }}>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={adicionarImagem} 
        />
        <p style={{ fontSize: 14, color: "#666", marginTop: 5 }}>
          Você pode selecionar várias imagens de uma vez
        </p>
      </div>

      {/* Miniaturas */}
      {imagens.length > 0 && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
          {imagens.map((img, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img
                src={img}
                alt={`Miniatura ${i}`}
                onClick={() => setImagemAtual(i)}
                style={{ 
                  width: 80, 
                  height: 60, 
                  objectFit: "cover", 
                  cursor: "pointer",
                  border: imagemAtual === i ? "3px solid #0070f3" : "1px solid #ccc",
                  borderRadius: 4
                }}
              />
              <button 
                onClick={() => excluirImagem(i)}
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: 22,
                  height: 22,
                  cursor: "pointer",
                  fontSize: 14
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Formulário */}
      <div style={{ display: "grid", gap: 12 }}>
        <input 
          placeholder="Nome do veículo *" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
        />
        <input 
          placeholder="Ano *" 
          value={ano} 
          onChange={(e) => setAno(e.target.value)} 
        />
        <input 
          placeholder="KM" 
          value={km} 
          onChange={(e) => setKm(e.target.value)} 
        />
        <input 
          placeholder="Câmbio" 
          value={cambio} 
          onChange={(e) => setCambio(e.target.value)} 
        />
        <input 
          placeholder="Combustível" 
          value={combustivel} 
          onChange={(e) => setCombustivel(e.target.value)} 
        />
        <input 
          placeholder="Preço *" 
          value={preco} 
          onChange={(e) => setPreco(e.target.value)} 
        />

        <textarea 
          placeholder="Descrição do veículo" 
          value={descricao} 
          onChange={(e) => setDescricao(e.target.value)} 
          rows={4}
        />

        <input 
          placeholder="Link do vídeo (YouTube, etc)" 
          value={video} 
          onChange={(e) => setVideo(e.target.value)} 
        />

        <button 
          onClick={salvarCarro}
          style={{ 
            padding: "14px", 
            fontSize: 16, 
            background: "#0070f3", 
            color: "white", 
            border: "none", 
            borderRadius: 6,
            cursor: "pointer",
            marginTop: 10
          }}
        >
          Salvar Veículo no Firebase
        </button>
      </div>
    </main>
  );
}