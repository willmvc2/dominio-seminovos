export const formatarPreco = (valor: number | string) => {
  const numero = Number(valor);

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
};