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
            <button onClick={() => router.push("/contato")} style={styles.botao}>
              Contatos
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
            Contatos
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
    height: 70,
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
    color: azul,
    background: "transparent",
    padding: "6px 14px",
    borderRadius: 20,
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: `0 0 10px rgba(59,130,246,0.4)`,
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