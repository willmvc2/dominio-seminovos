"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const [ativo, setAtivo] = useState("Estoque");
  const [mobile, setMobile] = useState(false);

  const router = useRouter();

  // ✅ SEM CONTATO NO MENU
  const itens = ["Estoque", "Ficha Cadastral", "Sobre nós"];

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  function navegar(item: string) {
    setAtivo(item);

    if (item === "Estoque") router.push("/");
    if (item === "Ficha Cadastral") router.push("/ficha");
    if (item === "Clientes") router.push("/clientes");
    if (item === "Sobre nós") router.push("/sobre");

    setOpen(false);
  }

  function faleConosco() {
    if (window.location.pathname === "/contato") {
      router.back();
    } else {
      router.push("/contato");
    }

    setOpen(false);
  }

  return (
    <header style={styles.header}>
      <div style={styles.container}>

        {/* LOGO */}
        <img src="/logo.png" style={styles.logo} />

        {/* DESKTOP */}
        {!mobile && (
          <div style={styles.right}>
            <nav style={styles.nav}>
              {itens.map((item) => (
                <a
                  key={item}
                  onClick={() => navegar(item)}
                  style={{
                    ...styles.link,
                    ...(ativo === item ? styles.linkAtivo : {}),
                  }}
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* ✅ BOTÃO CONTATO FUNCIONANDO */}
            {/* BOTÃO FALE CONOSCO */}
            <button onClick={faleConosco} style={styles.botao}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.009-.371-.011-.57-.011-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.89-9.884a9.82 9.82 0 0 1 7.021 2.91 9.83 9.83 0 0 1 2.897 7.027c-.003 5.45-4.437 9.884-9.924 9.884z" />
              </svg>

              Fale Conosco
            </button>
          </div>
        )}

        {/* MOBILE */}
        {mobile && (
          <div
            style={styles.hamburguer}
            onClick={() => setOpen(!open)}
          >
            ☰
          </div>
        )}
      </div>

      {/* MENU MOBILE */}
      {mobile && open && (
        <div style={styles.mobileMenu}>
          {itens.map((item) => (
            <a
              key={item}
              onClick={() => navegar(item)}
              style={styles.link}
            >
              {item}
            </a>
          ))}

          {/* ✅ BOTÃO CONTATO MOBILE */}
          <button onClick={() => router.push("/contato")} style={styles.botao}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.009-.371-.011-.57-.011-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.89-9.884a9.82 9.82 0 0 1 7.021 2.91 9.83 9.83 0 0 1 2.897 7.027c-.003 5.45-4.437 9.884-9.924 9.884z" />
            </svg>

            Fale Conosco
          </button>
        </div>
      )}
    </header>
  );
}

const azul = "#3b82f6";

const styles: any = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 8,
  },

  container: {
    width: "90%",
    maxWidth: 1100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 16px",
    background: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(14px)",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
  },

  logo: {
    height: 60,
    width: 150,
    filter: "drop-shadow(0 0 15px rgba(0,0,0,1)) drop-shadow(0 0 35px rgba(0,0,0,0.9))",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 45,
  },

  nav: {
    display: "flex",
    gap: 25,
    alignItems: "center",
  },

  link: {
    color: "white",
    textTransform: "uppercase",
    fontSize: 13,
    letterSpacing: 1,
    cursor: "pointer",
  },

  linkAtivo: {
    color: azul,
    textShadow: "0 0 8px rgba(59,130,246,0.7)",
  },

  botao: {
    border: `1px solid ${azul}`,
    color: "white",
    background: "#25D366",
    padding: "8px 16px",
    borderRadius: 20,
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    whiteSpace: "nowrap",
    boxShadow: "0 0 12px rgba(37,211,102,0.35)",
  },

  hamburguer: {
    color: "white",
    fontSize: 30,
    cursor: "pointer",
  },

  mobileMenu: {
    width: "90%",
    marginTop: 10,
    background: "rgba(0,0,0,0.95)",
    padding: 20,
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
};