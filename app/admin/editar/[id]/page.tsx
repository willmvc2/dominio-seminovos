"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useCarros } from "../../../../data/useCarros";
import { supabase } from "@/app/lib/supabase";

export default function EditarCarro() {
  const { carros, atualizarCarro } = useCarros();
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const carro = carros.find((c) => c.id === id);

  const [form, setForm] = useState<any>(null);
  const [imagemAtual, setImagemAtual] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (carro) {
      setForm({
        ...carro,
        imagens: Array.isArray(carro.imagens) ? carro.imagens : [],
      });
    }
  }, [carro]);

  function atualizar(campo: string, valor: any) {
    setForm((prev: any) => ({ ...prev, [campo]: valor }));
  }

  // COMPACTAR IMAGEM
  async function compactarImagem(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const urlTemporaria = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(urlTemporaria);

        const MAX_SIZE = 1400;

        let largura = img.width;
        let altura = img.height;

        if (largura > MAX_SIZE || altura > MAX_SIZE) {
          if (largura > altura) {
            altura = Math.round((altura * MAX_SIZE) / largura);
            largura = MAX_SIZE;
          } else {
            largura = Math.round((largura * MAX_SIZE) / altura);
            altura = MAX_SIZE;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = largura;
        canvas.height = altura;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Não foi possível processar a imagem"));
          return;
        }

        ctx.drawImage(img, 0, 0, largura, altura);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Erro ao compactar imagem"));
              return;
            }

            resolve(blob);
          },
          "image/webp",
          0.78
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(urlTemporaria);
        reject(new Error("Erro ao carregar imagem"));
      };

      img.src = urlTemporaria;
    });
  }

  // UPLOAD COMPACTADO PARA SUPABASE
  async function uploadImagem(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const novasUrls: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const imagemCompactada = await compactarImagem(file);

        const nomeArquivo = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.webp`;

        const { error } = await supabase.storage
          .from("carros")
          .upload(nomeArquivo, imagemCompactada, {
            contentType: "image/webp",
          });

        if (error) {
          console.log(error);
          alert("Erro ao enviar imagem");
          return;
        }

        const url = `https://totdnqrhmgsjqvswujho.supabase.co/storage/v1/object/public/carros/${nomeArquivo}`;

        novasUrls.push(url);
      } catch (error) {
        console.log(error);
        alert("Erro ao processar imagem");
        return;
      }
    }

    atualizar("imagens", [...form.imagens, ...novasUrls]);

    e.target.value = "";
  }

  function excluirImagem(index: number) {
    const novas = form.imagens.filter((_: any, i: number) => i !== index);
    atualizar("imagens", novas);
    setImagemAtual(0);
  }

  async function salvarAlteracao() {
    const sucesso = await atualizarCarro(id, form);

    if (sucesso) {
      alert("Salvo com sucesso!");
      router.push("/admin");
    }
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
      <div style={{ width: "100%", maxWidth: 700 }}>

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

        <h1 style={{ marginBottom: 20 }}>Editar veículo</h1>

        {/* 🔥 IMAGEM COM SETAS */}
        <div style={{ position: "relative" }}>
          <img
            src={form.imagens?.[imagemAtual] || "/logo.png"}
            style={{
              width: "100%",
              height: 360,
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
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          {(Array.isArray(form.imagens) ? form.imagens : []).map(
            (img: string, index: number) => (
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
                    border:
                      imagemAtual === index
                        ? "2px solid #3b82f6"
                        : "none",
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
            )
          )}
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
                onChange={(e) =>
                  atualizar(item.campo, e.target.value)
                }
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
            <label
              style={{
                fontSize: 14,
                color: "#9ca3af",
              }}
            >
              Descrição
            </label>

            <textarea
              value={form.descricao || ""}
              onChange={(e) =>
                atualizar("descricao", e.target.value)
              }
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
            <label
              style={{
                fontSize: 14,
                color: "#9ca3af",
              }}
            >
              Vídeo (YouTube)
            </label>

            <input
              value={form.video || ""}
              onChange={(e) =>
                atualizar("video", e.target.value)
              }
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
            <label
              style={{
                fontSize: 14,
                color: "#9ca3af",
              }}
            >
              Status
            </label>

            <select
              value={form.status || "disponivel"}
              onChange={(e) =>
                atualizar("status", e.target.value)
              }
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