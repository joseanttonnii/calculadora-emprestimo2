"use client";

import { useState } from "react";

// Formata números em R$
const formatar = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);

// Taxas de empréstimo
const taxas = {
  tipo1: {
    liberado: {
      0: 5, 1: 8, 2: 9, 3: 10, 4: 10.5, 5: 11.5, 6: 12.5, 7: 13,
      8: 14, 9: 14.5, 10: 14.99, 11: 15.75, 12: 15.99, 13: 18,
      14: 19, 15: 20.5, 16: 20.99, 17: 21.99, 18: 22.99,
      19: 24.99, 20: 26.99, 21: 28.99
    },
    limite: {
      0: 4.76, 1: 7.41, 2: 8.26, 3: 9.09, 4: 9.5, 5: 10.31, 6: 11.11,
      7: 11.5, 8: 12.28, 9: 12.66, 10: 13.04, 11: 13.61,
      12: 13.78, 13: 15.25, 14: 15.97, 15: 17.01, 16: 17.36,
      17: 18.03, 18: 18.7, 19: 19.99, 20: 21.26, 21: 22.47
    }
  },
  tipo2: {
    liberado: {
      0: 4, 1: 7.5, 2: 8.25, 3: 8.75, 4: 9.5, 5: 9.99, 6: 10.75,
      7: 11.25, 8: 11.75, 9: 11.95, 10: 11.99, 11: 13.75,
      12: 13.99, 13: 16.5, 14: 17, 15: 17.49, 16: 18,
      17: 19, 18: 19.99, 19: 22, 20: 24, 21: 24.99
    },
    limite: {
      0: 3.85, 1: 6.98, 2: 7.62, 3: 8.05, 4: 8.68, 5: 9.08,
      6: 9.71, 7: 10.11, 8: 10.45, 9: 10.67, 10: 10.71,
      11: 12.09, 12: 12.27, 13: 14.16, 14: 14.53, 15: 14.89,
      16: 15.25, 17: 15.97, 18: 16.66, 19: 18.03,
      20: 19.35, 21: 19.99
    }
  }
} as const;

type Tipo = keyof typeof taxas;
type Opcao = "liberado" | "limite";

interface Resultado {
  valorLiberado: number;
  totalPagar: number;
  parcela: number | null;
}

function calcular({
  tipo,
  opcao,
  valor,
  parcelas,
}: {
  tipo: Tipo;
  opcao: Opcao;
  valor: number;
  parcelas: number;
}): Resultado {
  const taxa = taxas[tipo][opcao][parcelas] / 100;

  let valorLiberado: number;
  let totalPagar: number;

  if (opcao === "liberado") {
    valorLiberado = valor;
    totalPagar = valor + valor * taxa;
  } else {
    valorLiberado = valor - valor * taxa;
    totalPagar = valor;
  }

  const parcela = parcelas > 0 ? totalPagar / parcelas : null;

  return { valorLiberado, totalPagar, parcela };
}

export default function Calculadora() {
  const [tipo, setTipo] = useState<Tipo>("tipo1");
  const [opcao, setOpcao] = useState<Opcao>("liberado");
  const [valor, setValor] = useState("");
  const [parcelas, setParcelas] = useState(1);
  const [res, setRes] = useState<Resultado | null>(null);

  const calcularClick = () => {
    const v = Number(valor);
    if (!v || v <= 0) return alert("Digite um valor válido");
    setRes(calcular({ tipo, opcao, valor: v, parcelas }));
  };

  const copiar = () => {
    if (!res) return;

    const texto = `
=====HiperCred=====

Cartão: ${tipo === "tipo1" ? "ELO" : "VISA/Master"}
Valor Liberado: R$ ${formatar(res.valorLiberado)}
Prazo: ${parcelas}x
Parcela: R$ ${res.parcela ? formatar(res.parcela) : "-"}
Total a pagar: R$ ${formatar(res.totalPagar)}
    `.trim();

    navigator.clipboard.writeText(texto);
    alert("Resultado copiado!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl grid md:grid-cols-2 gap-6">

        {/* Entrada */}
        <div className="bg-zinc-900/80 rounded-2xl p-6 space-y-4 shadow-xl">
          <h1 className="text-2xl font-bold text-blue-400">Calculadora HiperCred</h1>

          <select className="w-full p-2 rounded bg-zinc-800" value={tipo} onChange={e => setTipo(e.target.value as Tipo)}>
            <option value="tipo1">ELO</option>
            <option value="tipo2">VISA / Master</option>
          </select>

          <select className="w-full p-2 rounded bg-zinc-800" value={opcao} onChange={e => setOpcao(e.target.value as Opcao)}>
            <option value="liberado">Liberado</option>
            <option value="limite">Limite</option>
          </select>

          <input
            type="number"
            placeholder="Valor"
            className="w-full p-2 rounded bg-zinc-800"
            value={valor}
            onChange={e => setValor(e.target.value)}
          />

          <select className="w-full p-2 rounded bg-zinc-800" value={parcelas} onChange={e => setParcelas(Number(e.target.value))}>
            {Array.from({ length: 22 }).map((_, i) => (
              <option key={i} value={i}>{i}x</option>
            ))}
          </select>

          <button
            onClick={calcularClick}
            className="w-full bg-orange-500 hover:bg-orange-600 transition p-2 rounded font-semibold"
          >
            Calcular
          </button>
        </div>

        {/* Resultado */}
        <div className="bg-zinc-900/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          {res ? (
            <>
              <div className="space-y-2 text-sm">
                <p><span className="text-zinc-400">Valor Liberado:</span> R$ {formatar(res.valorLiberado)}</p>
                <p><span className="text-zinc-400">Parcela:</span> R$ {res.parcela ? formatar(res.parcela) : "-"}</p>
                <p className="text-lg font-bold text-orange-400">
                  Total: R$ {formatar(res.totalPagar)}
                </p>
              </div>

              <button
                onClick={copiar}
                className="mt-4 border border-dashed border-orange-400 text-orange-400 p-2 rounded"
              >
                Copiar Resultado
              </button>
            </>
          ) : (
            <p className="text-zinc-500">Preencha os dados</p>
          )}
        </div>
      </div>
    </div>
  );
}
