"use client";

import { useRouter } from "next/navigation";
import { Phone, MessageCircle, Camera } from "lucide-react";

export default function Contato() {
  const router = useRouter();

  return (
    <main style={styles.main}>
      <div style={styles.container}>

        <button onClick={() => router.push("/")} style={styles.back}>
          ← Voltar
        </button>

        <div style={styles.box}>
          <h1 style={styles.title}>Contato</h1>

          <div style={styles.text}>

            <p>Fale Conosco</p>
            <p>Estamos prontos para ajudá-lo a encontrar o veículo para sua necessidade!</p>

            <br />

            <p style={styles.subtitle}>WhatsApp</p>

            <a
              href="https://wa.me/5511981223969"
              target="_blank"
              style={styles.link}
            >
              <MessageCircle size={18} /> (11) 98122-3969
            </a>

            <a
              href="https://wa.me/5511949086139"
              target="_blank"
              style={styles.link}
            >
              <MessageCircle size={18} /> (11) 94908-6139
            </a>

            <br />

            <p style={styles.subtitle}>Instagram</p>

            <a
              href="https://instagram.com/dominioseminovos"
              target="_blank"
              style={styles.link}
            >
              <Camera size={18} /> @dominioseminovos
            </a>

            <br />

            <p style={styles.subtitle}>Endereço</p>
            <p>Rua Joaquim Felicio 146 - Cidade Centenario -
               São Paulo - SP
            </p>

          </div>
        </div>

      </div>
    </main>
  );
}

const styles: any = {
  main: {
    background: "#0f172a",
    minHeight: "100vh",
    padding: 20,
  },

  container: {
    maxWidth: 900,
    margin: "0 auto",
    color: "white",
  },

  back: {
    marginBottom: 20,
    padding: "8px 12px",
    background: "#374151",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  box: {
    background: "#111827",
    padding: 25,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
  },

  title: {
    fontSize: 26,
    marginBottom: 15,
  },

  subtitle: {
    marginTop: 10,
    fontWeight: "bold",
  },

  text: {
    lineHeight: 1.8,
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#3b82f6",
    textDecoration: "none",
    marginTop: 6,
  },
};