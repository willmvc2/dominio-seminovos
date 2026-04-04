"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function NovoCarro() {
  const router = useRouter();

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

  // 🔥 SALVAR NO FIREBASE (CORRETO)
  async function salvarCarro() {
    console.log("🔥 SALVANDO NO FIREBASE");

    if (!nome || !preco) {
      alert("Preencha nome e preço");
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

      router.push("/admin");
    } catch (error) {
      console.error("❌ ERRO AO SALVAR:", error);
      alert("Erro ao salvar veículo");
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Cadastrar veículo</h1>

      <button onClick={() => router.push("/admin")}>
        ← Voltar
      </button>

      {/* IMAGEM */}
      <div>
        <img
          src={imagens[imagemAtual] || "https://picsum.photos/800/400"}
          style={{ width: "100%", maxHeight: 300, objectFit: "cover" }}
        />
      </div>

      {/* UPLOAD */}
      <input type="file" multiple onChange={adicionarImagem} />

      {/* MINIATURAS */}
      <div style={{ display: "flex", gap: 10 }}>
        {imagens.map((img, i) => (
          <div key={i}>
            <img
              src={img}
              onClick={() => setImagemAtual(i)}
              style={{ width: 80, height: 60, cursor: "pointer" }}
            />
            <button onClick={() => excluirImagem(i)}>X</button>
          </div>
        ))}
      </div>

      {/* FORM */}
      <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="Ano" value={ano} onChange={(e) => setAno(e.target.value)} />
        <input placeholder="KM" value={km} onChange={(e) => setKm(e.target.value)} />
        <input placeholder="Câmbio" value={cambio} onChange={(e) => setCambio(e.target.value)} />
        <input placeholder="Combustível" value={combustivel} onChange={(e) => setCombustivel(e.target.value)} />
        <input placeholder="Preço" value={preco} onChange={(e) => setPreco(e.target.value)} />

        <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />

        <input placeholder="Vídeo" value={video} onChange={(e) => setVideo(e.target.value)} />

        <button onClick={salvarCarro}>
          Salvar veículo
        </button>
      </div>
    </main>
  );
}