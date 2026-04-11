"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (
  login === process.env.NEXT_PUBLIC_ADMIN_LOGIN &&
  senha === process.env.NEXT_PUBLIC_ADMIN_SENHA
) {
      sessionStorage.setItem("logado", "true");
      router.push("/admin");
    } else {
      alert("Login inválido");
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        height: "100vh",
        display: "flex",
alignItems: "flex-start",
justifyContent: "center",
paddingTop: "120px",
      }}
    >
      <div
        style={{
          background: "#111827",
          padding: 30,
          borderRadius: 12,
          width: 300,
          boxShadow: "0 0 20px rgba(59,130,246,0.5)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#3b82f6",
            marginBottom: 20,
            textShadow: "0 0 10px #3b82f6",
          }}
        >
          Login Admin
        </h2>

        <form onSubmit={handleLogin}>
          <input
  type="text"
  placeholder="Login"
  value={login}
  onChange={(e) => setLogin(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 15,
              borderRadius: 6,
              border: "1px solid #374151",
              background: "#0f172a",
              color: "white",
            }}
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 20,
              borderRadius: 6,
              border: "1px solid #374151",
              background: "#0f172a",
              color: "white",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 10,
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 0 10px #3b82f6",
            }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}