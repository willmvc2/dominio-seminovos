"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useCarros } from "../../../../data/useCarros";

export default function EditarCarro() {
  const { carros, salvar } = useCarros();
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
        imagens: carro.imagens || [],
        status: carro?.status || "disponivel",
      });
    }
  }, [carro]);

  function atualizar(campo: string, valor: any) {
    setForm((prev: any) => ({ ...prev, [campo]: valor }));
  }

  function uploadImagem(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      atualizar("imagens", [...form.imagens, reader.result]);
    };
    reader.readAsDataURL(file);
  }

  function excluirImagem(index: number) {
    const novas = form.imagens.filter((_: any, i: number) => i !== index);
    atualizar("imagens", novas);
    setImagemAtual(0);
  }

  function salvarAlteracao() {
    const novaLista = carros.map((c) =>
      c.id === id ? form : c
    );

    salvar(novaLista);
    alert("Salvo com sucesso!");
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

        {/* IMAGEM */}
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

          <button
            onClick={() =>
              setImagemAtual((prev) =>
                prev - 1 < 0 ? form.imagens.length - 1 : prev - 1
              )
            }
            style={arrowLeft}
          >
            ‹
          </button>

          <button
            onClick={() =>
              setImagemAtual((prev) =>
                prev + 1 >= form.imagens.length ? 0 : prev + 1
              )
            }
            style={arrowRight}
          >
            ›
          </button>
        </div>

        {/* MINIATURAS */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
          {form.imagens.map((img: string, index: number) => (
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
                  border: imagemAtual === index ? "2px solid #3b82f6" : "none",
                }}
              />

              <button
                onClick={() => excluirImagem(index)}
                style={styles.deleteBtn}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={uploadImagem}
          style={{ display: "none" }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          style={styles.upload}
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
                style={styles.input}
              />
            </div>
          ))}

          <div>
            <label style={{ fontSize: 14, color: "#9ca3af" }}>Descrição</label>
            <textarea
              value={form.descricao || ""}
              onChange={(e) => atualizar("descricao", e.target.value)}
              style={styles.textarea}
            />
          </div>

          {/* VIDEO */}
          <div>
            <label style={{ fontSize: 14, color: "#9ca3af" }}>
              Vídeo (YouTube)
            </label>
            <input
              value={form.video || ""}
              onChange={(e) => atualizar("video", e.target.value)}
              placeholder="Cole o link do YouTube"
              style={styles.input}
            />
          </div>

          {/* STATUS */}
          <div>
            <label style={{ fontSize: 14, color: "#9ca3af" }}>
              Status
            </label>
            <select
              value={form.status || "disponivel"}
              onChange={(e) => atualizar("status", e.target.value)}
              style={styles.input}
            >
              <option value="disponivel">Disponível</option>
              <option value="preparando">Preparando</option>
              <option value="vendido">Vendido</option>
            </select>
          </div>

          <button onClick={salvarAlteracao} style={styles.save}>
            💾 Salvar alterações
          </button>

        </div>

      </div>
    </main>
  );
}

/* estilos */
const styles: any = {
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #374151",
    background: "#111827",
    color: "white",
  },
  textarea: {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #374151",
    background: "#111827",
    color: "white",
    minHeight: 80,
  },
  upload: {
    marginBottom: 20,
    padding: 10,
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  save: {
    padding: 12,
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  deleteBtn: {
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
  },
};

/* 🔥 CORREÇÃO DO ERRO AQUI */
const arrowLeft = {
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
};

const arrowRight = {
  ...arrowLeft,
  left: "auto",
  right: 10,
};