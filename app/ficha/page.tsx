"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Ficha() {
  const [form, setForm] = useState<any>({});
  const router = useRouter();

  function formatarData(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 8);

    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4)
      return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;

    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
  }

  function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 6)
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    if (numeros.length <= 10)
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  function formatarCEP(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 8);

    if (numeros.length <= 5) return numeros;

    return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
  }

  function formatarSalario(valor: string) {
    const numeros = valor.replace(/\D/g, "");

    if (!numeros) return "";

    const valorNumerico = Number(numeros) / 100;

    return valorNumerico.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function handleChange(e: any) {
    const { name, value } = e.target;

    let novoValor = value;

    // DATAS
    if (name === "nascimento" || name === "admissao") {
      novoValor = formatarData(value);
    }

    // TELEFONES
    if (
      name === "telFixo" ||
      name === "celular" ||
      name === "telEmpresa"
    ) {
      novoValor = formatarTelefone(value);
    }

    // CEP
    if (name === "cep" || name === "cepEmpresa") {
      novoValor = formatarCEP(value);

      const quantidadeNumeros = value.replace(/\D/g, "").length;

      // CEP PESSOAL FICOU INCOMPLETO
      if (name === "cep" && quantidadeNumeros < 8) {
        setForm((anterior: any) => ({
          ...anterior,
          cep: novoValor,
          rua: "",
          bairro: "",
          cidade: "",
          estado: "",
        }));
        return;
      }

      // CEP DA EMPRESA FICOU INCOMPLETO
      if (name === "cepEmpresa" && quantidadeNumeros < 8) {
        setForm((anterior: any) => ({
          ...anterior,
          cepEmpresa: novoValor,
          ruaEmpresa: "",
          bairroEmpresa: "",
          cidadeEmpresa: "",
          estadoEmpresa: "",
        }));
        return;
      }
    }

    // SALÁRIO
    if (name === "salario") {
      novoValor = formatarSalario(value);
    }

    setForm((anterior: any) => ({
      ...anterior,
      [name]: novoValor,
    }));
  }

  async function buscarCEP(cep: string, tipo: "pessoal" | "empresa") {
    const numeroCEP = cep.replace(/\D/g, "");

    if (numeroCEP.length !== 8) return;

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${numeroCEP}/json/`
      );

      const endereco = await resposta.json();

      if (endereco.erro) {
        alert("CEP não encontrado.");
        return;
      }

      setForm((anterior: any) => {
        if (tipo === "pessoal") {
          return {
            ...anterior,
            rua: endereco.logradouro || "",
            bairro: endereco.bairro || "",
            cidade: endereco.localidade || "",
            estado: endereco.uf || "",
          };
        }

        return {
          ...anterior,
          ruaEmpresa: endereco.logradouro || "",
          bairroEmpresa: endereco.bairro || "",
          cidadeEmpresa: endereco.localidade || "",
          estadoEmpresa: endereco.uf || "",
        };
      });
    } catch {
      alert("Não foi possível consultar o CEP.");
    }
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

          <input name="nome" placeholder="Nome" value={form.nome || ""} onChange={handleChange} style={styles.input} />

          <input
            name="nascimento"
            placeholder="Data de nascimento"
            value={form.nascimento || ""}
            onChange={handleChange}
            inputMode="numeric"
            style={styles.input}
          />

          <input name="rg" placeholder="RG" value={form.rg || ""} onChange={handleChange} style={styles.input} />

          <input name="cpf" placeholder="CPF" value={form.cpf || ""} onChange={handleChange} style={styles.input} />

          <input name="mae" placeholder="Nome da Mãe" value={form.mae || ""} onChange={handleChange} style={styles.input} />

          <input
            name="cep"
            placeholder="CEP"
            value={form.cep || ""}
            onChange={(e) => {
              handleChange(e);

              if (e.target.value.replace(/\D/g, "").length === 8) {
                buscarCEP(e.target.value, "pessoal");
              }
            }}
            inputMode="numeric"
            style={styles.input}
          />

          <input name="rua" placeholder="Rua" value={form.rua || ""} onChange={handleChange} style={styles.input} />

          <input name="numero" placeholder="Número" value={form.numero || ""} onChange={handleChange} style={styles.input} />

          <input name="complemento" placeholder="Complemento" value={form.complemento || ""} onChange={handleChange} style={styles.input} />

          <input name="bairro" placeholder="Bairro" value={form.bairro || ""} onChange={handleChange} style={styles.input} />

          <input name="cidade" placeholder="Cidade" value={form.cidade || ""} onChange={handleChange} style={styles.input} />

          <input name="estado" placeholder="Estado" value={form.estado || ""} onChange={handleChange} style={styles.input} />

          <input name="tempo" placeholder="Tempo de residência" value={form.tempo || ""} onChange={handleChange} style={styles.input} />

          <input
            name="telFixo"
            placeholder="Telefone fixo"
            value={form.telFixo || ""}
            onChange={handleChange}
            inputMode="tel"
            style={styles.input}
          />

          <input
            name="celular"
            placeholder="Celular"
            value={form.celular || ""}
            onChange={handleChange}
            inputMode="tel"
            style={styles.input}
          />

          <input name="email" placeholder="Email" value={form.email || ""} onChange={handleChange} style={styles.input} />


          <h3>🏭 Dados profissionais</h3>

          <input
            name="empresa"
            placeholder="Nome da empresa"
            value={form.empresa || ""}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="admissao"
            placeholder="Data de admissão"
            value={form.admissao || ""}
            onChange={handleChange}
            inputMode="numeric"
            style={styles.input}
          />

          <input
            name="telEmpresa"
            placeholder="Telefone da empresa"
            value={form.telEmpresa || ""}
            onChange={handleChange}
            inputMode="tel"
            style={styles.input}
          />

          <input
            name="cepEmpresa"
            placeholder="CEP da empresa"
            value={form.cepEmpresa || ""}
            onChange={(e) => {
              handleChange(e);

              if (e.target.value.replace(/\D/g, "").length === 8) {
                buscarCEP(e.target.value, "empresa");
              }
            }}
            inputMode="numeric"
            style={styles.input}
          />

          <input
            name="ruaEmpresa"
            placeholder="Rua"
            value={form.ruaEmpresa || ""}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="numeroEmpresa"
            placeholder="Número"
            value={form.numeroEmpresa || ""}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="bairroEmpresa"
            placeholder="Bairro"
            value={form.bairroEmpresa || ""}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="cidadeEmpresa"
            placeholder="Cidade"
            value={form.cidadeEmpresa || ""}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="estadoEmpresa"
            placeholder="Estado"
            value={form.estadoEmpresa || ""}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="salario"
            placeholder="Salário"
            value={form.salario || ""}
            onChange={handleChange}
            inputMode="numeric"
            style={styles.input}
          />

          <input
            name="cargo"
            placeholder="Cargo"
            value={form.cargo || ""}
            onChange={handleChange}
            style={styles.input}
          />

          <h3>🚘 Veículo</h3>

          <input name="veiculo" placeholder="Carro de interesse" onChange={handleChange} style={styles.input} />

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