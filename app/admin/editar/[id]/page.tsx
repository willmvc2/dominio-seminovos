"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useCarros } from "../../../../data/useCarros";
import { supabase } from "@/lib/supabase";


async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");

      const maxWidth = 1200;

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        const scale = maxWidth / width;
        width = maxWidth;
        height = height * scale;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Erro ao comprimir imagem"));
          }
        },
        "image/webp",
        0.7
      );
    };

    reader.readAsDataURL(file);
  });
}

export default function EditarCarro() {
  const { carros, } = useCarros();
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const carro = carros.find((c) => c.id === id);

  const [form, setForm] = useState<any>(null);
  const [imagemAtual, setImagemAtual] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carro) {
      setForm({
        ...carro,
        imagens: Array.isArray(carro.imagens) ? carro.imagens : [],
      });
    }
  }, [carro]);

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTo({
      left: imagemAtual * 90,
      behavior: "smooth",
    });
  }, [imagemAtual]);

  function atualizar(campo: string, valor: any) {
    setForm((prev: any) => ({
      ...prev,
      [campo]: typeof valor === "function" ? valor(prev[campo]) : valor,
    }));
  }

  async function uploadImagem(e: any) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const compressed = await compressImage(file);

      const nomeArquivo = `${Date.now()}-${i}.webp`;

      const { error } = await supabase.storage
        .from("carros")
        .upload(nomeArquivo, compressed);

      if (error) {
        console.log(error);
        continue;
      }

      const { data } = supabase.storage
        .from("carros")
        .getPublicUrl(nomeArquivo);

      atualizar("imagens", (prev: string[]) => [
        ...(prev || form.imagens || []),
        data.publicUrl,
      ]);
    }

    const compressed = await compressImage(file);
    const nomeArquivo = `${Date.now()}-${Math.random()}.webp`;
    const { error } = await supabase.storage
      .from("carros")
      .upload(nomeArquivo, compressed as Blob);

    if (error) {
  alert("Erro ao enviar imagem");
  console.error((error as any).message);
  return;
}

    const { data } = supabase.storage
      .from("carros")
      .getPublicUrl(nomeArquivo);

    atualizar("imagens", [...form.imagens, data.publicUrl]);
  }

  function excluirImagem(index: number) {
    const novas = form.imagens.filter((_: any, i: number) => i !== index);
    atualizar("imagens", novas);
    setImagemAtual(0);
  }

  async function salvarAlteracao() {
    console.log("🔥 clicou salvar");
    console.log("ID:", id);
    console.log("FORM:", form);

    const { data, error } = await supabase
      .from("carros")
      .update({
        nome: form.nome,
        ano: form.ano,
        km: form.km,
        cambio: form.cambio,
        combustivel: form.combustivel,
        preco: Number(form.preco),
        descricao: form.descricao,
        video: form.video,
        imagens: form.imagens,
        status: form.status,
      })
      .eq("id", id);

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Salvo com sucesso!");
    window.dispatchEvent(new Event("carros-updated")); // 🔥 AQUI
    router.push("/admin");
  }

  if (!form) return <p style={{ color: "white" }}>Carregando...</p>;

  return (
    <main
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: 20,
        color: "white",
      }}
    >
      <div style={{ width: "100%", maxWidth: 500 }}>

        {/* VOLTAR */}
        <button
          onClick={() => router.push("/admin")}
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

        <h1 style={{ marginBottom: 10 }}>Editar veículo</h1>

        {/* 🔥 IMAGEM COM SETAS */}
        <div style={{ position: "relative" }}>
          <img
            src={form.imagens?.[imagemAtual] || "/logo.png"}
            style={{
              width: "100%",
              height: 270,
              objectFit: "cover",
              borderRadius: 10,
              marginBottom: 10,
            }}
          />

          {/* SETA ESQUERDA */}
          <button
            onClick={() =>
              setImagemAtual((prev) =>
                prev - 1 < 0 ? form.imagens.length - 1 : prev - 1
              )
            }
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.6)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: 45,
              height: 45,
              cursor: "pointer",
              fontSize: 20,
            }}
          >
            ‹
          </button>

          {/* SETA DIREITA */}
          <button
            onClick={() =>
              setImagemAtual((prev) =>
                prev + 1 >= form.imagens.length ? 0 : prev + 1
              )
            }
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.6)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: 45,
              height: 45,
              cursor: "pointer",
              fontSize: 20,
            }}
          >
            ›
          </button>
        </div>

        {/* MINIATURAS */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: 10,
            overflowX: "auto",
            marginBottom: 20
          }}
        >
          {(Array.isArray(form.imagens) ? form.imagens : []).map((img: string, index: number) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={img}
                onClick={() => setImagemAtual(index)}
                style={{
                  width: 80,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 6,
                  cursor: "pointer",
                  flexShrink: 0,
                  border: imagemAtual === index ? "2px solid #3b82f6" : "none",
                }}
              />

              <button
                onClick={() => excluirImagem(index)}
                style={{
                  position: "absolute",
                  top: -5,
                  right: -5,
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* UPLOAD */}
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={uploadImagem}
          style={{ display: "none" }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            marginBottom: 20,
            padding: 10,
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          📸 Inserir fotos
        </button>

        {/* FORM */}
        <div style={{ display: "grid", gap: 15 }}>

          {[
            { label: "Nome do veículo", campo: "nome" },
            { label: "Ano", campo: "ano" },
            { label: "KM", campo: "km" },
            { label: "Câmbio", campo: "cambio" },
            { label: "Combustível", campo: "combustivel" },
            { label: "Preço", campo: "preco" },
          ].map((item) => (
            <div key={item.campo}>
              <label style={{ fontSize: 14, color: "#9ca3af" }}>
                {item.label}
              </label>
              <input
                value={form[item.campo] || ""}
                onChange={(e) => atualizar(item.campo, e.target.value)}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #374151",
                  background: "#111827",
                  color: "white",
                }}
              />
            </div>
          ))}

          <div>
            <label style={{ fontSize: 14, color: "#9ca3af" }}>Descrição</label>
            <textarea
              value={form.descricao || ""}
              onChange={(e) => atualizar("descricao", e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1px solid #374151",
                background: "#111827",
                color: "white",
                minHeight: 80,
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 14, color: "#9ca3af" }}>
              Vídeo (YouTube)
            </label>
            <input
              value={form.video || ""}
              onChange={(e) => atualizar("video", e.target.value)}
              placeholder="Cole o link do YouTube"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1px solid #374151",
                background: "#111827",
                color: "white",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 14, color: "#9ca3af" }}>Status</label>
            <select
              value={form.status || "disponivel"}
              onChange={(e) => atualizar("status", e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1px solid #374151",
                background: "#111827",
                color: "white",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="disponivel">Disponível</option>
              <option value="vendido">Vendido</option>
              <option value="preparando">Preparando</option>
            </select>
          </div>

          <button
            onClick={salvarAlteracao}
            style={{
              padding: 12,
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            💾 Salvar alterações
          </button>

        </div>

      </div>
    </main>
  );
}