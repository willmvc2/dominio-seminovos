"use client";

import { useRouter } from "next/navigation";
import { useCarros } from "../../data/useCarros";

export default function Admin() {
  const router = useRouter();
  const { carros } = useCarros();

  if (!carros) return null;

  // 🔥 PRIORIDADE
  const prioridade: any = {
    disponivel: 1,
    preparando: 2,
    vendido: 3,
  };

  // 🔥 ORDENAÇÃO
  const carrosOrdenados = [...carros].sort((a, b) => {
    const statusA = a.status || "disponivel";
    const statusB = b.status || "disponivel";

    const pA = prioridade[statusA] || 99;
    const pB = prioridade[statusB] || 99;

    if (pA !== pB) {
      return pA - pB;
    }

    return b.id - a.id;
  });

  return (
    <main
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1200 }}>

        {/* TOPO */}
        <div style={{ backgroundColor: "black", width: "100%" }}>
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "15px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <img
              src="/logo.png"
              style={{
                height: 100,
                width: 300,
                objectFit: "fill",
              }}
            />

            <button
              onClick={() => router.push("/admin/novo")}
              style={{
                padding: "8px 12px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: 6,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              ➕ Novo veículo
            </button>
          </div>
        </div>

        {/* GRID */}
        <div
          className="grid"
          style={{
            maxWidth: 1100,
            margin: "20px auto",
            padding: 10,
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          {carrosOrdenados.map((car) => {
            const status = car.status || "disponivel";

            return (
              <div
                key={car.id}
                style={{
                  position: "relative",
                  background: "#111827",
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid #1f2937",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
                }}
              >

                {/* FAIXA STATUS CENTRALIZADA */}
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    left: -60,
                    transform: "rotate(-45deg)",
                    width: 220,
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "white",
                    padding: "8px 0",
                    background:
                      status === "vendido"
                        ? "#dc2626"
                        : status === "preparando"
                        ? "#374151"
                        : "#16a34a",
                    zIndex: 10,
                    fontSize: 13,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {status.toUpperCase()}
                </div>

                {/* BOTÃO EDITAR (ENGRENAGEM) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/admin/editar/${car.id}`);
                  }}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "rgba(0,0,0,0.8)",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 8px",
                    cursor: "pointer",
                    zIndex: 20,
                  }}
                >
                  ⚙️
                </button>

                {/* CARD */}
                <div
                  onClick={() => router.push(`/admin/editar/${car.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={car.imagens?.[0] || "/logo.png"}
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                    }}
                  />

                  <div style={{ padding: 15 }}>
                    <h2 style={{ color: "white", fontWeight: "bold" }}>
                      {car.nome}
                    </h2>

                    <p style={{ color: "#9ca3af" }}>
                      {car.ano} • {car.cambio}
                    </p>

                    {/* 🔥 PREÇO FORMATADO */}
                    <p
                      style={{
                        color: "#3b82f6",
                        fontWeight: "bold",
                        marginTop: 5,
                      }}
                    >
                      {Number(car.preco).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </p>

                    {/* BOTÃO DETALHES */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/editar/${car.id}`);
                      }}
                      style={{
                        marginTop: 10,
                        width: "100%",
                        padding: 8,
                        background: "transparent",
                        border: "1px solid #3b82f6",
                        color: "#3b82f6",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RESPONSIVO */}
        <style jsx>{`
          @media (max-width: 900px) {
            .grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }

          @media (max-width: 600px) {
            .grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

      </div>
    </main>
  );
}