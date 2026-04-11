"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Ficha() {
  const [form, setForm] = useState<any>({});
  const router = useRouter();

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function gerarTexto() {
    return `
    
📋 FICHA CADASTRAL

----------------------------------------------
👨🏽‍💻 DADOS PESSOAIS

Nome: ${form.nome || ""}
Data de nascimento: ${form.nascimento || ""}
RG: ${form.rg || ""}
CPF: ${form.cpf || ""}
Nome da Mãe: ${form.mae || ""}
Rua: ${form.rua || ""}
N°: ${form.numero || ""}
Complemento: ${form.complemento || ""}
CEP: ${form.cep || ""}
Bairro: ${form.bairro || ""}
Tempo de residência: ${form.tempo || ""}
Tel fixo: ${form.telFixo || ""}
Celular: ${form.celular || ""}
E-mail: ${form.email || ""}

----------------------------------------------
🏭 DADOS PROFISSIONAIS

Nome da empresa: ${form.empresa || ""}
Data de Admissão: ${form.admissao || ""}
Telefone: ${form.telEmpresa || ""}
Rua: ${form.ruaEmpresa || ""}
N°: ${form.numeroEmpresa || ""}
CEP: ${form.cepEmpresa || ""}
Bairro: ${form.bairroEmpresa || ""}
Salário: ${form.salario || ""}
Cargo: ${form.cargo || ""}

----------------------------------------------
🚘 VEÍCULO

Carro de interesse: ${form.veiculo || ""}
    `;
  }

  function enviarWhatsApp() {
    const texto = gerarTexto();
    const url = `https://wa.me/5511981223969?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  }

  function enviarEmail() {
    const assunto = "Ficha Cadastral";
    const corpo = gerarTexto();

    const mail = `mailto:willmvc@gmail.com?subject=${encodeURIComponent(
      assunto
    )}&body=${encodeURIComponent(corpo)}`;

    window.location.href = mail;
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <h1 style={{ marginBottom: 20 }}>Ficha Cadastral</h1>

        <div style={styles.form}>
          <h3>👨🏽‍💻 Dados pessoais</h3>

          <input name="nome" placeholder="Nome" onChange={handleChange} style={styles.input}/>
          <input name="nascimento" placeholder="Data de nascimento" onChange={handleChange} style={styles.input}/>
          <input name="rg" placeholder="RG" onChange={handleChange} style={styles.input}/>
          <input name="cpf" placeholder="CPF" onChange={handleChange} style={styles.input}/>
          <input name="mae" placeholder="Nome da Mãe" onChange={handleChange} style={styles.input}/>
          <input name="rua" placeholder="Rua" onChange={handleChange} style={styles.input}/>
          <input name="numero" placeholder="Número" onChange={handleChange} style={styles.input}/>
          <input name="complemento" placeholder="Complemento" onChange={handleChange} style={styles.input}/>
          <input name="cep" placeholder="CEP" onChange={handleChange} style={styles.input}/>
          <input name="bairro" placeholder="Bairro" onChange={handleChange} style={styles.input}/>
          <input name="tempo" placeholder="Tempo de residência" onChange={handleChange} style={styles.input}/>
          <input name="telFixo" placeholder="Telefone fixo" onChange={handleChange} style={styles.input}/>
          <input name="celular" placeholder="Celular" onChange={handleChange} style={styles.input}/>
          <input name="email" placeholder="Email" onChange={handleChange} style={styles.input}/>

          <h3>🏭 Dados profissionais</h3>

          <input name="empresa" placeholder="Nome da empresa" onChange={handleChange} style={styles.input}/>
          <input name="admissao" placeholder="Data de admissão" onChange={handleChange} style={styles.input}/>
          <input name="telEmpresa" placeholder="Telefone da empresa" onChange={handleChange} style={styles.input}/>
          <input name="ruaEmpresa" placeholder="Rua" onChange={handleChange} style={styles.input}/>
          <input name="numeroEmpresa" placeholder="Número" onChange={handleChange} style={styles.input}/>
          <input name="cepEmpresa" placeholder="CEP" onChange={handleChange} style={styles.input}/>
          <input name="bairroEmpresa" placeholder="Bairro" onChange={handleChange} style={styles.input}/>
          <input name="salario" placeholder="Salário" onChange={handleChange} style={styles.input}/>
          <input name="cargo" placeholder="Cargo" onChange={handleChange} style={styles.input}/>

          <h3>🚘 Veículo</h3>

          <input name="veiculo" placeholder="Carro de interesse" onChange={handleChange} style={styles.input}/>

          {/* BOTÕES */}
          <button style={styles.whats} onClick={enviarWhatsApp}>
            Enviar pelo WhatsApp
          </button>

          <button style={styles.email} onClick={enviarEmail}>
            Enviar por Email
          </button>
          
        </div>
      </div>
    </main>
  );
}

/* STYLES (inalterado) */
const styles: any = {
  main: { background: "#0f172a", minHeight: "100vh", padding: 20 },

  container: { maxWidth: 900, margin: "0 auto", color: "white" },

  form: {
    marginTop: 20,
    display: "grid",
    gap: 10,
    background: "#111827",
    padding: 20,
    borderRadius: 10,
  },

  input: {
    padding: 10,
    borderRadius: 6,
    background: "#0f172a",
    border: "1px solid #374151",
    color: "white",
  },

  whats: {
    padding: 12,
    background: "#25D366",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },

  email: {
    padding: 12,
    background: "#3b82f6",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
    color: "white",
  },
};