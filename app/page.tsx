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
    liberado: { 0:4,1:7.5,2:8.25,3:8.75,4:9.5,5:9.99,6:10.75,7:11.25,8:11.75,9:11.95,10:11.99,11:13.75,12:13.99,13:16.5,14:17,15:17.49,16:18,17:19,18:19.99,19:22,20:24,21:24.99 },
    limite: {0:3.846153846153846,1:6.976744186046512,2:7.621329626546681,3:8.045977011494253,4:8.675799086757991,5:9.082644785889626,6:9.706546275395034,7:10.112359550561798,8:10.511882998171846,9:10.721750781599821,10:10.706304134297706,11:12.087912087912088,12:12.270374603035354,13:14.163090128755364,14:14.52991452991453,15:14.892752574687633,16:15.254237288135594,17:15.966386554621849,18:16.663888657388115,19:18.032786885245903,20:19.35483870967742,21:19.993599487959037}
  },
tipo2: {
    liberado: { 0:5,1:8,2:9,3:10,4:10.5,5:11.5,6:12.5,7:13,8:14,9:14.5,10:14.99,11:15.75,12:15.99,13:18,14:19,15:20.5,16:20.99,17:21.99,18:22.99,19:24.99,20:26.99,21:28.99 },
    limite: {0:4.761904761904762,1:7.407407407407407,2:8.256880733944954,3:9.090909090909091,4:9.502262443438914,5:10.31390134529148,6:11.11111111111111,7:11.504424778761062,8:12.280701754385965,9:12.663755458515284,10:13.035916166623185,11:13.606911447084233,12:13.785671178549875,13:15.254237288135593,14:15.966386554621849,15:17.012448132780083,16:17.34854120175221,17:18.026067710468072,18:18.692576632246524,19:19.993599487959037,20:21.253642019056618,21:22.474610434917435}
  },
} as const;

type Tipo = keyof typeof taxas;
type Opcao = keyof typeof taxas["tipo1"];

interface Resultado {
  valorLiberado: number;
  totalPagar: number;
  parcela: number | null;
}

function calcular({ tipo, opcao, valor, parcelas }: { tipo: Tipo, opcao: Opcao, valor: number, parcelas: number }): Resultado {
  const taxa = taxas[tipo][opcao][parcelas as keyof typeof taxas[Tipo][Opcao]] / 100;

  let valorLiberado = opcao === "liberado" ? valor : valor - valor * taxa;
  let totalPagar = opcao === "liberado" ? valor + valor * taxa : valor;

  const parcela = parcelas > 0 ? totalPagar / parcelas : null;

  return { valorLiberado, totalPagar, parcela };
}

export default function Calculadora() {
  const [tipo, setTipo] = useState<Tipo>("tipo1");
  const [opcao, setOpcao] = useState<Opcao>("liberado");
  const [valor, setValor] = useState("");
  const [parcelas, setParcelas] = useState(1);
  const [res, setRes] = useState<Resultado | null>(null);

  const handleCalcular = () => {
    const num = Number(valor);
    if (!num || num <= 0) return alert("Digite um valor válido");
    setRes(calcular({ tipo, opcao, valor: num, parcelas }));
  };

  const handleCopiar = () => {
    if (!res) return;

    const cartao = tipo === "tipo1" ? "VISA/MASTER" : "ELO/OUTROS";

    const texto = `
=====Simulador HiperCred=====

Cartão: ${cartao}
Valor Liberado: R$ ${formatar(res.valorLiberado)}
Prazo: ${parcelas}x
Parcela: R$ ${res.parcela ? formatar(res.parcela) : "-"}
Total a pagar: R$ ${formatar(res.totalPagar)}
    `.trim();

    navigator.clipboard.writeText(texto);
    alert("Resultado copiado!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl grid md:grid-cols-2 gap-6">

        {/* Entrada */}
        <div className="bg-blue-900/70 backdrop-blur rounded-2xl p-6 space-y-4 shadow-xl">
          <h1 className="text-2xl font-bold text-orange-400">Simulador HiperCred</h1>
          <p className="text-sm text-blue-200">Simulação</p>

          <select className="w-full p-2 rounded bg-blue-800" value={tipo} onChange={e => setTipo(e.target.value as Tipo)}>
            <option value="tipo1">VISA/MASTER</option>
            <option value="tipo2">ELO/OUTROS</option>
          </select>

          <select className="w-full p-2 rounded bg-blue-800" value={opcao} onChange={e => setOpcao(e.target.value as Opcao)}>
            <option value="liberado">Liberado</option>
            <option value="limite">Limite</option>
          </select>

          <input
            type="number"
            className="w-full p-2 rounded bg-blue-800"
            placeholder="Valor"
            value={valor}
            onChange={e => setValor(e.target.value)}
          />

          <select className="w-full p-2 rounded bg-blue-800" value={parcelas} onChange={e => setParcelas(Number(e.target.value))}>
            {Array.from({ length: 22 }).map((_, i) => (
              <option key={i} value={i}>{i}x</option>
            ))}
          </select>

          <button
            onClick={handleCalcular}
            className="w-full bg-orange-500 hover:bg-orange-600 transition p-2 rounded font-semibold"
          >
            Calcular
          </button>
        </div>

        {/* Resultado */}
        <div className="bg-blue-900/70 backdrop-blur rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">Resultado</h2>

            {res ? (
              <div className="space-y-2 text-sm">
                <p>Valor Liberado: <strong>R$ {formatar(res.valorLiberado)}</strong></p>
                <p>Prazo: {parcelas}x</p>
                <p>Parcela: R$ {res.parcela ? formatar(res.parcela) : "-"}</p>
                <p className="text-lg font-bold">
                  Total a pagar: R$ {formatar(res.totalPagar)}
                </p>
              </div>
            ) : (
              <p className="text-blue-200">Preencha os dados para calcular</p>
            )}
          </div>

          {res && (
            <button
              onClick={handleCopiar}
              className="mt-4 border border-dashed border-orange-400 text-orange-300 p-2 rounded"
            >
              Copiar Resultado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
