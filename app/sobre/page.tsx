"use client";

import { useRouter } from "next/navigation";

export default function Sobre() {
  const router = useRouter();

  const texto = `Em 2008, iniciou sua trajetória profissional no setor automotivo atuando com vistoria prévia, sendo responsável pela análise de veículos e verificação de sua originalidade para seguradoras.

Em 2010, surgiu a oportunidade que marcou uma virada em sua carreira: o ingresso em uma loja de veículos. Entre 2010 e 2013, atuou diretamente na área de vendas para o público de varejo, desenvolvendo habilidades comerciais e construindo uma base sólida de relacionamento com clientes.

Devido ao seu desempenho e comprometimento, foi promovido e passou a atuar no segmento de vendas em atacado, onde alcançou resultados expressivos, chegando a negociar mais de 340 veículos por mês, atendendo clientes em todo o território nacional.

Paralelamente, seu irmão iniciou sua atuação no mesmo segmento, também obtendo grande sucesso, o que fortaleceu ainda mais a visão de negócio da família.

No final de 2020, diante dos desafios impostos pela pandemia, decidiram, de forma estratégica e planejada, encerrar seus vínculos profissionais e iniciar uma sociedade no ramo de compra e venda de veículos.

Acreditando no conhecimento adquirido ao longo dos anos, aliado a um alto padrão de qualidade, transparência e atenção aos detalhes, deram início ao próprio negócio — que desde então vem apresentando crescimento contínuo e consolidando sua presença no mercado.

Hoje, a empresa segue em expansão, sempre pautada na confiança, credibilidade e compromisso com seus clientes.`;

  return (
    <main style={styles.main}>
      <div style={styles.container}>

        {/* VOLTAR */}
        <button onClick={() => router.push("/")} style={styles.back}>
          ← Voltar
        </button>

        {/* BOX */}
        <div style={styles.box}>
          <h1 style={styles.title}>Sobre nós</h1>

          <p style={styles.text}>
            {texto}
          </p>
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

  text: {
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },
};