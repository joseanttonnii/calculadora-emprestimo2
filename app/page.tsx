"use client";

import { useState } from "react";

type Tipo = "tipo1-liberado" | "tipo1-limite" | "tipo2-liberado" | "tipo2-limite";

const taxas: Record<Tipo, Record<number, number>> = {
  "tipo1-liberado": {
    0: 5, 1: 8, 2: 9, 3: 10, 4: 10.5, 5: 11.5, 6: 12.5, 7: 13,
    8: 14, 9: 14.5, 10: 14.99, 11: 15.75, 12: 15.99, 13: 18,
    14: 19, 15: 20.5, 16: 20.99, 17: 21.99, 18: 22.99,
    19: 24.99, 20: 26.99, 21: 28.99,
  },
  "tipo1-limite": {
    0: 4.76, 1: 7.41, 2: 8.26, 3: 9.09, 4: 9.5, 5: 10.31,
    6: 11.11, 7: 11.5, 8: 12.28, 9: 12.66, 10: 13.04,
    11: 13.61, 12: 13.78, 13: 15.25, 14: 15.97,
    15: 17.01, 16: 17.36, 17: 18.03, 18: 18.7,
    19: 19.99, 20: 21.26, 21: 22.47,
  },
  "tipo2-liberado": {
    0: 4, 1: 7.5, 2: 8.25, 3: 8.75, 4: 9.5, 5: 9.99,
    6: 10.75, 7: 11.25, 8: 11.75, 9: 11.95,
    10: 11.99, 11: 13.75, 12: 13.99, 13: 16.5,
    14: 17, 15: 17.49, 16: 18, 17: 19,
    18: 19.99, 19: 22, 20: 24, 21: 24.99,
  },
  "tipo2-limite": {
    0: 3.85, 1: 6.98, 2: 7.62, 3: 8.05, 4: 8.68,
    5: 9.08, 6: 9.71, 7: 10.11, 8: 10.45,
    9: 10.67, 10: 10.71, 11: 12.09, 12: 12.27,
    13: 14.16, 14: 14.53, 15: 14.89, 16: 15.25,
    17: 15.97, 18: 16.66, 19: 18.03,
    20: 19.35, 21: 19.99,
  },
};

export default function Home() {
  const [valor, setValor] = useState(1000);
  const [parcelas, setParcelas] = useState(10);
  const [tipo, setTipo] = useState<Tipo>("tipo2-liberado");
  const [bandeira, setBandeira] = useState("Visa / Master");

  const taxa = taxas[tipo][parcelas] ?? 0;
  const total = valor * (1 + taxa / 100);
  const parcela = parcelas > 0 ? total / parcelas : total;

  const textoCopiar = `=====AlexandreCred=====
Valor Liberado: R$ ${valor.toFixed(2)}
Prazo: ${parcelas}x
Parcela: R$ ${parcela.toFixed(2)}
Total a pagar: R$ ${total.toFixed(2)}
Bandeira: ${bandeira}`;

  function copiarTexto(texto: string) {
    if (typeof window === "undefined") return;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(texto)
        .then(() => alert("Copiado com sucesso!"))
        .catch(() => fallbackCopy(texto));
    } else {
      fallbackCopy(texto);
    }
  }

  function fallbackCopy(texto: string) {
    if (typeof document === "undefined") return;

    const textarea = document.createElement("textarea");
    textarea.value = texto;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Copiado com sucesso!");
  }

  return (
    <main style={{ padding: 20, maxWidth: 420, margin: "auto" }}>
      <h1>AlexandreCred</h1>

      <input type="number" value={valor} onChange={e => setValor(+e.target.value)} />
      <input type="number" value={parcelas} onChange={e => setParcelas(+e.target.value)} />

      <select value={tipo} onChange={e => setTipo(e.target.value as Tipo)}>
        <option value="tipo1-liberado">Tipo 1 – Liberado</option>
        <option value="tipo1-limite">Tipo 1 – Limite</option>
        <option value="tipo2-liberado">Tipo 2 – Liberado</option>
        <option value="tipo2-limite">Tipo 2 – Limite</option>
      </select>

      <select value={bandeira} onChange={e => setBandeira(e.target.value)}>
        <option>Visa / Master</option>
        <option>Elo</option>
      </select>

      <p>Taxa: {taxa}%</p>
      <p>Parcela: R$ {parcela.toFixed(2)}</p>
      <p>Total: R$ {total.toFixed(2)}</p>

      <button onClick={() => copiarTexto(textoCopiar)}>Copiar</button>
    </main>
  );
}
