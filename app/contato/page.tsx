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
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="#25D366"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.009-.371-.011-.57-.011-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.89-9.884a9.82 9.82 0 0 1 7.021 2.91 9.83 9.83 0 0 1 2.897 7.027c-.003 5.45-4.437 9.884-9.924 9.884z" />
              </svg> (11) 98122-3969
            </a>

            <a
              href="https://wa.me/5511949086139"
              target="_blank"
              style={styles.link}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="#25D366"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.009-.371-.011-.57-.011-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.89-9.884a9.82 9.82 0 0 1 7.021 2.91 9.83 9.83 0 0 1 2.897 7.027c-.003 5.45-4.437 9.884-9.924 9.884z" />
              </svg> (11) 94908-6139
            </a>

            <br />

            <p style={styles.subtitle}>Instagram</p>

            <a
              href="https://instagram.com/dominioseminovos"
              target="_blank"
              style={styles.link}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="instagramGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFDC80" />
                    <stop offset="25%" stopColor="#FCAF45" />
                    <stop offset="50%" stopColor="#F77737" />
                    <stop offset="70%" stopColor="#E1306C" />
                    <stop offset="85%" stopColor="#C13584" />
                    <stop offset="100%" stopColor="#833AB4" />
                  </linearGradient>
                </defs>

                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="5"
                  fill="url(#instagramGradient)"
                />

                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                />

                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1.2"
                  fill="white"
                />
              </svg> @dominioseminovos
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