"use client";

import { useState } from "react";

// Formatação BR
const formatar = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);

// Tabelas de taxas
const taxas = {
  tipo1: {
    liberado: {
      0: 5,
      1: 8,
      2: 9,
      3: 10,
      4: 10.5,
      5: 11.5,
      6: 12.5,
      7: 13,
      8: 14,
      9: 14.5,
      10: 14.99,
      11: 15.75,
      12: 15.99,
      13: 18,
      14: 19,
      15: 20.5,
      16: 20.99,
      17: 21.99,
      18: 22.99,
      19: 24.99,
      20: 26.99,
      21: 28.99,
    },
    limite: {
      0: 4.76,
      1: 7.41,
      2: 8.26,
      3: 9.09,
      4: 9.5,
      5: 10.31,
      6: 11.11,
      7: 11.5,
      8: 12.28,
      9: 12.66,
      10: 13.04,
      11: 13.61,
      12: 13.78,
      13: 15.25,
      14: 15.97,
      15: 17.01,
      16: 17.36,
      17: 18.03,
      18: 18.7,
      19: 19.99,
      20: 21.26,
      21: 22.47,
    },
  },

  tipo2: {
    liberado: {
      0: 4,
      1: 7.5,
      2: 8.25,
      3: 8.75,
      4: 9.5,
      5: 9.99,
      6: 10.75,
      7: 11.25,
      8: 11.75,
      9: 11.95,
      10: 11.99,
      11: 13.75,
      12: 13.99,
      13: 16.5,
      14: 17,
      15: 17.49,
      16: 18,
      17: 19,
      18: 19.99,
      19: 22,
      20: 24,
      21: 24.99,
    },
    limite: {
      0: 3.85,
      1: 6.98,
      2: 7.62,
      3: 8.05,
      4: 8.68,
      5: 9.08,
      6: 9.71,
      7: 10.11,
      8: 10.45,
      9: 10.67,
      10: 10.71,
      11: 12.09,
      12: 12.27,
      13: 14.16,
      14: 14.53,
      15: 14.89,
      16: 15.25,
      17: 15.97,
      18: 16.66,
      19: 18.03,
      20: 19.35,
      21: 19.99,
    },
  },
} as const;

export default function Calculadora() {
  const [valor, setValor] = useState(1000);
  const [parcelas, setParcelas] = useState(10);
  const [tipo, setTipo] = useState<"tipo1" | "tipo2">("tipo1");
  const [origem, setOrigem] = useState<"liberado" | "limite">("liberado");
  const [copiado, setCopiado] = useState(false);

  const taxa = taxas[tipo][origem][parcelas] ?? 0;
  const total = valor * (1 + taxa / 100);
  const parcelaValor = parcelas > 0 ? total / parcelas : total;

  const bandeira = tipo === "tipo1" ? "ELO" : "VISA/Master";

  const texto = `
=====AlexandreCred=====

Cartão: ${bandeira}
Valor Liberado: R$ ${formatar(valor)}
Prazo: ${parcelas}x
Parcela: R$ ${formatar(parcelaValor)}
Total a pagar: R$ ${formatar(total)}
`;

  function copiar() {
    navigator.clipboard.writeText(texto.trim());
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Calculadora de Empréstimo</h1>

      <label>Valor</label>
      <input type="number" value={valor} onChange={(e) => setValor(+e.target.value)} />

      <label>Parcelas</label>
      <input type="number" min={0} max={21} value={parcelas} onChange={(e) => setParcelas(+e.target.value)} />

      <label>Tipo</label>
      <select value={tipo} onChange={(e) => setTipo(e.target.value as any)}>
        <option value="tipo1">ELO</option>
        <option value="tipo2">VISA / Master</option>
      </select>

      <label>Origem</label>
      <select value={origem} onChange={(e) => setOrigem(e.target.value as any)}>
        <option value="liberado">Liberado</option>
        <option value="limite">Limite</option>
      </select>

      <hr />

      <p><strong>Taxa:</strong> {taxa}%</p>
      <p><strong>Parcela:</strong> R$ {formatar(parcelaValor)}</p>
      <p><strong>Total:</strong> R$ {formatar(total)}</p>

      <button onClick={copiar}>
        {copiado ? "Copiado ✅" : "Copiar resultado"}
      </button>
    </main>
  );
}
