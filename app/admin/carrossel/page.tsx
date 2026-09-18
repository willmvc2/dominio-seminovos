"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ItemCarrossel = {
    id: number;
    imagem: string;
    ordem: number;
    ativo: boolean;
    created_at: string;
};

export default function CarrosselVendidos() {
    const router = useRouter();

    const [imagens, setImagens] = useState<ItemCarrossel[]>([]);
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);
    const [carregando, setCarregando] = useState(true);

    // ==========================
    // PROTEÇÃO DO ADMIN
    // ==========================
    useEffect(() => {
        const logado = sessionStorage.getItem("logado");

        if (logado !== "true") {
            router.push("/admin/login");
            return;
        }

        carregarImagens();
    }, []);

    // ==========================
    // BUSCAR IMAGENS
    // ==========================
    async function carregarImagens() {
        setCarregando(true);

        const { data, error } = await supabase
            .from("carrossel_vendidos")
            .select("*")
            .order("ordem", { ascending: true })
            .order("id", { ascending: false });

        if (error) {
            console.error(error);
            alert("Erro ao carregar as imagens.");
        } else {
            setImagens(data || []);
        }

        setCarregando(false);
    }

    // ==========================
    // COMPACTAR IMAGEM
    // ==========================
    function compactarImagem(file: File): Promise<File> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                const maxWidth = 800;
                const maxHeight = 800;

                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    const proporcao = Math.min(
                        maxWidth / width,
                        maxHeight / height
                    );

                    width = Math.round(width * proporcao);
                    height = Math.round(height * proporcao);
                }

                const canvas = document.createElement("canvas");

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");

                if (!ctx) {
                    URL.revokeObjectURL(url);
                    reject(new Error("Não foi possível processar a imagem."));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        URL.revokeObjectURL(url);

                        if (!blob) {
                            reject(new Error("Erro ao compactar imagem."));
                            return;
                        }

                        const nome =
                            file.name.replace(/\.[^/.]+$/, "") + ".webp";

                        const novoArquivo = new File([blob], nome, {
                            type: "image/webp",
                        });

                        resolve(novoArquivo);
                    },
                    "image/webp",
                    0.5
                );
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error("Imagem inválida."));
            };

            img.src = url;
        });
    }

    // ==========================
    // ESCOLHER FOTO
    // ==========================
    async function selecionarImagem(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const original = e.target.files?.[0];

        if (!original) return;

        try {
            const compactada = await compactarImagem(original);

            if (preview) {
                URL.revokeObjectURL(preview);
            }

            setArquivo(compactada);
            setPreview(URL.createObjectURL(compactada));
        } catch (error) {
            console.error(error);
            alert("Não foi possível processar essa imagem.");
        }
    }

    // ==========================
    // ENVIAR PARA SUPABASE
    // ==========================
    async function adicionarImagem() {
        if (!arquivo) {
            alert("Escolha uma imagem primeiro.");
            return;
        }

        setEnviando(true);

        try {
            const nomeArquivo =
                `${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2, 8)}.webp`;

            const { error: uploadError } = await supabase.storage
                .from("carrossel-vendidos")
                .upload(nomeArquivo, arquivo, {
                    contentType: "image/webp",
                    upsert: false,
                });

            if (uploadError) {
                throw uploadError;
            }

            const { data: publicUrl } = supabase.storage
                .from("carrossel-vendidos")
                .getPublicUrl(nomeArquivo);

            const proximaOrdem =
                imagens.length > 0
                    ? Math.max(...imagens.map((item) => item.ordem || 0)) + 1
                    : 1;

            const { error: insertError } = await supabase
                .from("carrossel_vendidos")
                .insert({
                    imagem: publicUrl.publicUrl,
                    ordem: proximaOrdem,
                    ativo: true,
                });

            if (insertError) {
                // Se falhar ao gravar na tabela,
                // remove a imagem que acabou de subir.
                await supabase.storage
                    .from("carrossel-vendidos")
                    .remove([nomeArquivo]);

                throw insertError;
            }

            if (preview) {
                URL.revokeObjectURL(preview);
            }

            setArquivo(null);
            setPreview(null);

            await carregarImagens();

            alert("Imagem adicionada ao carrossel!");
        } catch (error: any) {
            console.error(error);
            alert(
                "Erro ao adicionar imagem: " +
                (error?.message || "erro desconhecido")
            );
        } finally {
            setEnviando(false);
        }
    }

    // ==========================
    // EXCLUIR
    // ==========================
    async function excluirImagem(item: ItemCarrossel) {
        const confirmar = window.confirm(
            "Deseja excluir esta imagem do carrossel?"
        );

        if (!confirmar) return;

        try {
            const partes = item.imagem.split(
                "/storage/v1/object/public/carrossel-vendidos/"
            );

            const caminhoArquivo = partes[1]
                ? decodeURIComponent(partes[1])
                : null;

            if (caminhoArquivo) {
                const { error: storageError } = await supabase.storage
                    .from("carrossel-vendidos")
                    .remove([caminhoArquivo]);

                if (storageError) {
                    throw storageError;
                }
            }

            const { error } = await supabase
                .from("carrossel_vendidos")
                .delete()
                .eq("id", item.id);

            if (error) {
                throw error;
            }

            await carregarImagens();
        } catch (error: any) {
            console.error(error);
            alert(
                "Erro ao excluir imagem: " +
                (error?.message || "erro desconhecido")
            );
        }
    }

    // ==========================
    // FORMATAR TAMANHO
    // ==========================
    function tamanhoArquivo(bytes: number) {
        if (bytes < 1024) return `${bytes} bytes`;

        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return (
        <main
            style={{
                backgroundColor: "#0f172a",
                minHeight: "100vh",
                color: "white",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 1100,
                    margin: "0 auto",
                    padding: "25px 15px 60px",
                }}
            >
                {/* VOLTAR */}
                <button
                    onClick={() => router.push("/admin")}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#3b82f6",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: 15,
                        marginBottom: 25,
                    }}
                >
                    ← Voltar ao Admin
                </button>

                {/* TÍTULO */}
                <div style={{ marginBottom: 25 }}>
                    <h1
                        style={{
                            fontSize: 28,
                            margin: 0,
                            fontWeight: 800,
                        }}
                    >
                        🖼️ Carrossel (Fotos)
                    </h1>

                    <p
                        style={{
                            color: "#94a3b8",
                            marginTop: 8,
                        }}
                    >
                        Gerencie as imagens que aparecerão na Home do site.
                    </p>
                </div>

                {/* UPLOAD */}
                <div
                    style={{
                        background: "#111827",
                        border: "1px solid #1f2937",
                        borderRadius: 14,
                        padding: 20,
                        marginBottom: 30,
                    }}
                >
                    <h2
                        style={{
                            marginTop: 0,
                            fontSize: 20,
                        }}
                    >
                        Adicionar nova imagem
                    </h2>

                    <p
                        style={{
                            color: "#94a3b8",
                            fontSize: 14,
                        }}
                    >
                        A foto será reduzida para no máximo 800px e convertida
                        automaticamente para WebP com qualidade de 50%.
                    </p>

                    <label
                        style={{
                            display: "flex",
                            minHeight: 150,
                            marginTop: 18,
                            border: "2px dashed #334155",
                            borderRadius: 12,
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            cursor: "pointer",
                            padding: 20,
                            textAlign: "center",
                        }}
                    >
                        <span
                            style={{
                                fontSize: 35,
                                marginBottom: 10,
                            }}
                        >
                            ☁️
                        </span>

                        <strong>Selecionar uma foto</strong>

                        <span
                            style={{
                                color: "#94a3b8",
                                fontSize: 13,
                                marginTop: 5,
                            }}
                        >
                            JPG, PNG ou WEBP
                        </span>

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={selecionarImagem}
                            style={{ display: "none" }}
                        />
                    </label>

                    {/* PREVIEW */}
                    {preview && arquivo && (
                        <div
                            style={{
                                marginTop: 20,
                                background: "#0f172a",
                                borderRadius: 12,
                                padding: 15,
                            }}
                        >
                            <img
                                src={preview}
                                alt="Preview"
                                style={{
                                    display: "block",
                                    width: "100%",
                                    maxWidth: 500,
                                    maxHeight: 350,
                                    objectFit: "contain",
                                    margin: "0 auto",
                                    borderRadius: 10,
                                }}
                            />

                            <div
                                style={{
                                    textAlign: "center",
                                    color: "#94a3b8",
                                    fontSize: 13,
                                    marginTop: 12,
                                }}
                            >
                                Imagem compactada:{" "}
                                <strong style={{ color: "#22c55e" }}>
                                    {tamanhoArquivo(arquivo.size)}
                                </strong>
                            </div>

                            <button
                                onClick={adicionarImagem}
                                disabled={enviando}
                                style={{
                                    width: "100%",
                                    marginTop: 15,
                                    padding: "12px 15px",
                                    border: "none",
                                    borderRadius: 8,
                                    background: enviando
                                        ? "#475569"
                                        : "#3b82f6",
                                    color: "white",
                                    fontWeight: "bold",
                                    cursor: enviando
                                        ? "not-allowed"
                                        : "pointer",
                                    fontSize: 15,
                                }}
                            >
                                {enviando
                                    ? "Enviando..."
                                    : "➕ Adicionar ao carrossel"}
                            </button>
                        </div>
                    )}
                </div>

                {/* IMAGENS CADASTRADAS */}
                <div>
                    <h2
                        style={{
                            fontSize: 20,
                            marginBottom: 5,
                        }}
                    >
                        Imagens no carrossel ({imagens.length})
                    </h2>

                    <p
                        style={{
                            color: "#94a3b8",
                            fontSize: 14,
                            marginTop: 0,
                            marginBottom: 20,
                        }}
                    >
                        Estas são as imagens que serão exibidas no site.
                    </p>

                    {carregando ? (
                        <p style={{ color: "#94a3b8" }}>
                            Carregando imagens...
                        </p>
                    ) : imagens.length === 0 ? (
                        <div
                            style={{
                                background: "#111827",
                                border: "1px solid #1f2937",
                                borderRadius: 12,
                                padding: 30,
                                textAlign: "center",
                                color: "#94a3b8",
                            }}
                        >
                            Nenhuma imagem adicionada ainda.
                        </div>
                    ) : (
                        <div className="grid-carrossel">
                            {imagens.map((item, index) => (
                                <div
                                    key={item.id}
                                    style={{
                                        background: "#111827",
                                        border: "1px solid #1f2937",
                                        borderRadius: 12,
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "relative",
                                        }}
                                    >
                                        <img
                                            src={item.imagem}
                                            alt={`Vendido ${index + 1}`}
                                            style={{
                                                width: "100%",
                                                height: 180,
                                                objectFit: "cover",
                                                display: "block",
                                            }}
                                        />


                                    </div>

                                    <div style={{ padding: 12 }}>
                                        <div
                                            style={{
                                                color: "#94a3b8",
                                                fontSize: 12,
                                                marginBottom: 10,
                                            }}
                                        >
                                            #{index + 1}
                                        </div>

                                        <button
                                            onClick={() => excluirImagem(item)}
                                            style={{
                                                width: "100%",
                                                padding: 9,
                                                background: "transparent",
                                                border: "1px solid #dc2626",
                                                color: "#ef4444",
                                                borderRadius: 7,
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                            }}
                                        >
                                            🗑️ Excluir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <style jsx>{`
          .grid-carrossel {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
          }

          @media (max-width: 800px) {
            .grid-carrossel {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 500px) {
            .grid-carrossel {
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
            }
          }
        `}</style>
            </div>
        </main>
    );
}