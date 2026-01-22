"use client";

import { useState } from "react";

// Formata números em R$
const formatar = (v: number) =>
  new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

// Taxas do Código 2 (HiperCred)
const taxas = {
tipo1: {
  liberado: { 0:4, 1:7.5, 2:8.25, 3:8.75, 4:9.5, 5:9.99, 6:10.75, 7:11.25, 8:11.75, 9:11.95, 10:11.99, 11:13.75, 12:13.99, 13:16.5, 14:17, 15:17.49, 16:18, 17:19, 18:19.99, 19:22, 20:24, 21:24.99 },
  limite: { 0:3.84615384615384615384615384615, 1:6.97674418604651162790697674418, 2:7.62132962654668109218684246299, 3:8.04597701149425287356321839080, 4:8.67579908675799086757990867579, 5:9.08264478588962633057550686426, 6:9.70654627539503385763546798030, 7:10.1123595505617977528089887640, 8:10.5118829981718462633451957295, 9:10.7217507815998213497096927110, 10:10.7063041342977060442887766773, 11:12.0879120879120879120879120879, 12:12.2703746030353548583296771647, 13:14.1630901287553648068669527897, 14:14.5299145299145299145299145299, 15:14.8857349561665690272359358244, 16:15.2542372881355932203389830508, 17:15.9663865546218487394957983193, 18:16.6638886573881156763063588632, 19:18.0327868852459016393442622951, 20:19.3548387096774193548387096774, 21:19.9935994879590367229378350268 }
},
tipo2: {
  liberado: { 0:5, 1:8, 2:9, 3:10, 4:10.5, 5:11.5, 6:12.5, 7:13, 8:14, 9:14.5, 10:14.99, 11:15.75, 12:15.99, 13:18, 14:19, 15:20.5, 16:20.99, 17:21.99, 18:22.99, 19:24.99, 20:26.99, 21:28.99 },
  limite: { 0:3.84615384615384615384615384615, 1:6.97674418604651162790697674418, 2:7.62132962654668109218684246299, 3:8.04597701149425287356321839080, 4:8.67579908675799086757990867579, 5:9.08264478588962633057550686426, 6:9.70654627539503385763546798030, 7:10.1123595505617977528089887640, 8:10.5118829981718462633451957295, 9:10.7217507815998213497096927110, 10:10.7063041342977060442887766773, 11:12.0879120879120879120879120879, 12:12.2703746030353548583296771647, 13:14.1630901287553648068669527897, 14:14.5299145299145299145299145299, 15:14.8857349561665690272359358244, 16:15.2542372881355932203389830508, 17:15.9663865546218487394957983193, 18:16.6638886573881156763063588632, 19:18.0327868852459016393442622951, 20:19.3548387096774193548387096774, 21:19.9935994879590367229378350268 }
},
} as const;

type Tipo = keyof typeof taxas;
type Opcao = keyof typeof taxas["tipo1"];

interface Resultado {
  valorLiberado: number;
  totalPagar: number;
  parcela: number | null;
}

interface HistoricoItem {
  tipo: Tipo;
  parcelas: number;
  resultado: Resultado;
}

export default function CalculadoraHiperCred() {
  const [tipo, setTipo] = useState<Tipo>("tipo1");
  const [opcao, setOpcao] = useState<Opcao>("liberado");
  const [valor, setValor] = useState<string>("");
  const [parcelas, setParcelas] = useState<number>(1);
  const [res, setRes] = useState<Resultado | null>(null);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const handleCopiar = () => {
    if (!res) return;
    const texto = `=====Simulador HiperCred=====\n\nCartão: ${tipo === "tipo1" ? "VISA/MASTER" : "ELO/OUTROS"}\nValor Liberado: R$ ${formatar(res.valorLiberado)}\nPrazo: ${parcelas}x\nParcela: R$ ${res.parcela ? formatar(res.parcela) : '-'}\nTotal a pagar: R$ ${formatar(res.totalPagar)}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(texto).then(() => alert("Copiado!")).catch(() => alert("Erro ao copiar"));
    }
  };

  const calcular = () => {
    const numValor = Number(valor);
    if (isNaN(numValor) || numValor <= 0) return;
    
    const taxa = taxas[tipo][opcao][parcelas as keyof typeof taxas[Tipo][Opcao]] / 100;
    
    let valorLiberado, totalPagar;
    if (opcao === "liberado") {
      valorLiberado = numValor;
      totalPagar = numValor + numValor * taxa;
    } else {
      valorLiberado = numValor - numValor * taxa;
      totalPagar = numValor;
    }

    const resultado = { valorLiberado, totalPagar, parcela: parcelas > 0 ? totalPagar / parcelas : null };
    setRes(resultado);
    setHistorico(prev => [{ tipo, parcelas, resultado }, ...prev].slice(0, 3));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 flex flex-col items-center justify-center overflow-x-hidden font-sans">
      
      <div className={`w-full transition-all duration-500 ${mostrarHistorico ? "max-w-[1100px]" : "max-w-[750px]"}`}>
        
        {/* Botão no Canto Esquerdo */}
        <div className="flex justify-start mb-6">
          <button 
            onClick={() => setMostrarHistorico(!mostrarHistorico)} 
            className={`px-5 py-2 rounded-lg border-2 transition-all font-bold text-[10px] tracking-widest ${mostrarHistorico ? "border-orange-500 bg-orange-500/20 text-orange-400" : "border-zinc-800 text-zinc-500 hover:border-zinc-700"}`}
          >
            {mostrarHistorico ? "FECHAR HISTÓRICO" : "HISTÓRICO"}
          </button>
        </div>

        <div className={`grid gap-6 items-stretch justify-center w-full ${ mostrarHistorico ? "md:grid-cols-3" : "md:grid-cols-2" }`}>

          {/* 1. Entrada */}
          <div className="bg-blue-900/10 rounded-2xl p-8 border border-blue-900/20 shadow-xl flex flex-col min-h-[520px]">
            <div className="flex items-center gap-4 mb-8">
              {/* Logo adicionada aqui */}
              <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain shrink-0" />
              <div>
                <h1 className="text-xl font-bold text-orange-500 leading-tight">Simulador</h1>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest">HiperCred</p>
              </div>
            </div>

            <div className="space-y-4 flex-grow">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Bandeira</label>
                <select className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-orange-500 outline-none transition-colors" value={tipo} onChange={e => setTipo(e.target.value as Tipo)}>
                  <option value="tipo1">VISA/MASTER</option>
                  <option value="tipo2">ELO/OUTROS</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Modo de Cálculo</label>
                <select className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-orange-500 outline-none transition-colors" value={opcao} onChange={e => setOpcao(e.target.value as Opcao)}>
                  <option value="liberado">Liberado</option>
                  <option value="limite">Limite</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Valor do Empréstimo</label>
                <input type="number" className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-orange-500 outline-none transition-colors" value={valor} onChange={e => setValor(e.target.value)} placeholder="0,00" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Prazo (Parcelas)</label>
                <select className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-orange-500 outline-none transition-colors" value={parcelas} onChange={e => setParcelas(Number(e.target.value))}>
                  {Array.from({ length: 22 }).map((_, i) => <option key={i} value={i}>{i}x</option>)}
                </select>
              </div>

              <button className="w-full bg-orange-600 hover:bg-orange-500 py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all mt-6" onClick={calcular}>Calcular</button>
            </div>
          </div>

          {/* 2. Resultado */}
          <div className="bg-blue-900/10 rounded-2xl p-8 border border-blue-900/20 shadow-xl flex flex-col justify-between min-h-[520px]">
            <div>
              <h2 className="text-xl font-bold text-orange-500 mb-6 uppercase tracking-widest text-left">Resultado</h2>
              {res ? (
                <div className="space-y-4 text-zinc-400">
                  <p className="flex justify-between border-b border-zinc-800/40 pb-2 text-[11px]">Cartão: <span className="text-white font-bold">{tipo === "tipo1" ? "VISA/MASTER" : "ELO/OUTROS"}</span></p>
                  <p className="flex justify-between border-b border-zinc-800/40 pb-2 text-[11px]">Valor Liberado: <span className="text-white font-bold text-orange-400">R$ {formatar(res.valorLiberado)}</span></p>
                  <p className="flex justify-between border-b border-zinc-800/40 pb-2 text-[11px]">Prazo: <span className="text-white font-bold">{parcelas}x</span></p>
                  <p className="flex justify-between border-b border-zinc-800/40 pb-2 text-[11px]">Parcela: <span className="text-white font-bold text-zinc-100">R$ {res.parcela ? formatar(res.parcela) : '-'}</span></p>
                  <div className="pt-8 text-center">
                    <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">Total a pagar</p>
                    <p className="text-4xl font-black text-white">R$ {formatar(res.totalPagar)}</p>
                  </div>
                </div>
              ) : <div className="flex items-center justify-center h-48 italic text-zinc-600 text-center text-sm">Aguardando dados...</div>}
            </div>
            {res && <button onClick={handleCopiar} className="w-full border border-dashed border-orange-500/50 text-orange-500 py-3 rounded-xl font-bold uppercase text-[10px] hover:bg-orange-500/5 transition-colors">Copiar Resultado</button>}
          </div>

          {/* 3. Histórico (Igual ao Resultado) */}
          {mostrarHistorico && (
            <div className="bg-blue-900/10 rounded-2xl p-8 border border-blue-900/20 min-h-[520px] animate-in fade-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-orange-500 mb-6 uppercase tracking-widest text-left">Histórico</h2>
              <div className="space-y-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {historico.length > 0 ? historico.map((item, index) => (
                  <div key={index} className="border border-zinc-800/50 rounded-xl p-4 bg-black/40 text-[10px] space-y-2 relative border-l-4 border-l-orange-600">
                     <div className="absolute top-0 right-0 bg-orange-600 px-2 py-0.5 text-[8px] text-white font-bold rounded-bl-lg">#{index + 1}</div>
                     
                     <p className="flex justify-between border-b border-zinc-800/30 pb-1 text-zinc-400">Cartão: <span className="text-white font-bold">{item.tipo === "tipo1" ? "VISA/MASTER" : "ELO/OUTROS"}</span></p>
                     <p className="flex justify-between border-b border-zinc-800/30 pb-1 text-zinc-400">Liberado: <span className="text-orange-400 font-bold">R$ {formatar(item.resultado.valorLiberado)}</span></p>
                     <p className="flex justify-between border-b border-zinc-800/30 pb-1 text-zinc-400">Prazo: <span className="text-white font-bold">{item.parcelas}x</span></p>
                     <p className="flex justify-between border-b border-zinc-800/30 pb-1 text-zinc-400">Parcela: <span className="text-white font-bold">R$ {item.resultado.parcela ? formatar(item.resultado.parcela) : '-'}</span></p>
                     <p className="text-white font-black pt-1 text-right text-xs uppercase tracking-tighter">Total: R$ {formatar(item.resultado.totalPagar)}</p>
                  </div>
                )) : <p className="text-zinc-600 italic text-left text-xs mt-10">Sem registros.</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
