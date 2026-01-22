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
  limite: { 0:4.76190476190476190476190476190, 1:7.40740740740740740740740740741, 2:8.25688073394495412844036697248, 3:9.09090909090909090909090909091, 4:9.50226244343891402714932126697, 5:10.3139013452914798206278026906, 6:11.1111111111111111111111111111, 7:11.5044247787610619469026548673, 8:12.2807017543859649122807017544, 9:12.6637554585152838427947598253, 10:13.0359161666231846247499782581, 11:13.6069114470842332613390928726, 12:13.7856711785498749892232089008, 13:15.2542372881355932203389830508, 14:15.9663865546218487394957983193, 15:17.0124481327800829875518672199, 16:17.3485412017522109265228531286, 17:18.0260677104680711533732273104, 18:18.6925766322465241076510285389, 19:19.9935994879590367229378350268, 20:21.2536420190566186313882982873, 21:22.4746104349174354601131870726 }
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
  
  // ESTADO DO TEMA (Padrão escuro como o original)
  const [temaEscuro, setTemaEscuro] = useState(true);

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
    <div className={`min-h-screen ${temaEscuro ? "bg-zinc-950 text-white" : "bg-blue-50 text-zinc-900"} p-6 flex flex-col items-center justify-center overflow-x-hidden font-sans transition-colors duration-500`}>
      
      <div className={`w-full transition-all duration-500 ${mostrarHistorico ? "max-w-[1100px]" : "max-w-[750px]"}`}>
        
        {/* Barra Superior de Botões */}
        <div className="flex justify-between items-center mb-6 w-full">
          {/* Botão de Histórico */}
          <button 
            onClick={() => setMostrarHistorico(!mostrarHistorico)} 
            className={`px-5 py-2 rounded-lg border-2 transition-all font-bold text-[10px] tracking-widest ${mostrarHistorico ? "border-orange-500 bg-orange-500/20 text-orange-400" : (temaEscuro ? "border-zinc-800 text-zinc-500 hover:border-zinc-700" : "border-zinc-300 text-zinc-400 bg-white hover:bg-zinc-50")}`}
          >
            {mostrarHistorico ? "FECHAR HISTÓRICO" : "HISTÓRICO"}
          </button>

          {/* Botão de Alternar Tema */}
          <button 
            onClick={() => setTemaEscuro(!temaEscuro)}
            className={`px-4 py-2 rounded-lg border-2 font-bold text-[10px] tracking-widest transition-all ${temaEscuro ? "border-zinc-800 text-yellow-500 hover:bg-zinc-900" : "border-zinc-300 text-indigo-600 bg-white hover:bg-zinc-50"}`}
          >
            {temaEscuro ? "☀️ MODO CLARO" : "🌙 MODO ESCURO"}
          </button>
        </div>

        <div className={`grid gap-6 items-stretch justify-center w-full ${ mostrarHistorico ? "md:grid-cols-3" : "md:grid-cols-2" }`}>

          {/* 1. Entrada */}
          <div className={`${temaEscuro ? "bg-blue-900/10 border-blue-900/20" : "bg-white border-zinc-200 shadow-xl"} rounded-2xl p-8 border flex flex-col min-h-[520px] transition-all duration-500`}>
            <div className="flex items-center gap-4 mb-8">
              <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain shrink-0" />
              <div>
                <h1 className="text-xl font-bold text-orange-500 leading-tight">Simulador</h1>
                <p className={`${temaEscuro ? "text-zinc-500" : "text-zinc-400"} text-[10px] uppercase tracking-widest`}>HiperCred</p>
              </div>
            </div>

            <div className="space-y-4 flex-grow">
              <div className="space-y-1">
                <label className={`text-[10px] uppercase font-bold ml-1 ${temaEscuro ? "text-zinc-500" : "text-zinc-400"}`}>Bandeira</label>
                <select className={`w-full p-3 rounded-lg border outline-none transition-colors ${temaEscuro ? "bg-zinc-900 border-zinc-800 text-white focus:border-orange-500" : "bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-orange-500"}`} value={tipo} onChange={e => setTipo(e.target.value as Tipo)}>
                  <option value="tipo1">VISA/MASTER</option>
                  <option value="tipo2">ELO/OUTROS</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] uppercase font-bold ml-1 ${temaEscuro ? "text-zinc-500" : "text-zinc-400"}`}>Modo de Cálculo</label>
                <select className={`w-full p-3 rounded-lg border outline-none transition-colors ${temaEscuro ? "bg-zinc-900 border-zinc-800 text-white focus:border-orange-500" : "bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-orange-500"}`} value={opcao} onChange={e => setOpcao(e.target.value as Opcao)}>
                  <option value="liberado">Liberado</option>
                  <option value="limite">Limite</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] uppercase font-bold ml-1 ${temaEscuro ? "text-zinc-500" : "text-zinc-400"}`}>Valor do Empréstimo</label>
                <input type="number" className={`w-full p-3 rounded-lg border outline-none transition-colors ${temaEscuro ? "bg-zinc-900 border-zinc-800 text-white focus:border-orange-500" : "bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-orange-500"}`} value={valor} onChange={e => setValor(e.target.value)} placeholder="0,00" />
              </div>
              
              <div className="space-y-1">
                <label className={`text-[10px] uppercase font-bold ml-1 ${temaEscuro ? "text-zinc-500" : "text-zinc-400"}`}>Prazo (Parcelas)</label>
                <select className={`w-full p-3 rounded-lg border outline-none transition-colors ${temaEscuro ? "bg-zinc-900 border-zinc-800 text-white focus:border-orange-500" : "bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-orange-500"}`} value={parcelas} onChange={e => setParcelas(Number(e.target.value))}>
                  {Array.from({ length: 22 }).map((_, i) => <option key={i} value={i}>{i}x</option>)}
                </select>
              </div>

              <button className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all mt-6" onClick={calcular}>Calcular</button>
            </div>
          </div>

          {/* 2. Resultado */}
          <div className={`${temaEscuro ? "bg-blue-900/10 border-blue-900/20" : "bg-white border-zinc-200 shadow-xl"} rounded-2xl p-8 border flex flex-col justify-between min-h-[520px] transition-all duration-500`}>
            <div>
              <h2 className="text-xl font-bold text-orange-500 mb-6 uppercase tracking-widest text-left">Resultado</h2>
              {res ? (
                <div className={`space-y-4 ${temaEscuro ? "text-zinc-400" : "text-zinc-500"}`}>
                  <p className={`flex justify-between border-b pb-2 text-[11px] ${temaEscuro ? "border-zinc-800/40" : "border-zinc-100"}`}>Cartão: <span className={`${temaEscuro ? "text-white" : "text-zinc-800"} font-bold`}>{tipo === "tipo1" ? "VISA/MASTER" : "ELO/OUTROS"}</span></p>
                  <p className={`flex justify-between border-b pb-2 text-[11px] ${temaEscuro ? "border-zinc-800/40" : "border-zinc-100"}`}>Valor Liberado: <span className="font-bold text-orange-500">R$ {formatar(res.valorLiberado)}</span></p>
                  <p className={`flex justify-between border-b pb-2 text-[11px] ${temaEscuro ? "border-zinc-800/40" : "border-zinc-100"}`}>Prazo: <span className={`${temaEscuro ? "text-white" : "text-zinc-800"} font-bold`}>{parcelas}x</span></p>
                  <p className={`flex justify-between border-b pb-2 text-[11px] ${temaEscuro ? "border-zinc-800/40" : "border-zinc-100"}`}>Parcela: <span className={`${temaEscuro ? "text-white" : "text-zinc-800"} font-bold`}>R$ {res.parcela ? formatar(res.parcela) : '-'}</span></p>
                  <div className="pt-8 text-center">
                    <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">Total a pagar</p>
                    <p className={`text-4xl font-black ${temaEscuro ? "text-white" : "text-zinc-900"}`}>R$ {formatar(res.totalPagar)}</p>
                  </div>
                </div>
              ) : <div className="flex items-center justify-center h-48 italic text-zinc-600 text-center text-sm">Aguardando dados...</div>}
            </div>
            {res && <button onClick={handleCopiar} className="w-full border border-dashed border-orange-500/50 text-orange-500 py-3 rounded-xl font-bold uppercase text-[10px] hover:bg-orange-500/5 transition-colors">Copiar Resultado</button>}
          </div>

          {/* 3. Histórico */}
          {mostrarHistorico && (
            <div className={`${temaEscuro ? "bg-blue-900/10 border-blue-900/20" : "bg-white border-zinc-200 shadow-xl text-zinc-900"} rounded-2xl p-8 border min-h-[520px] animate-in fade-in slide-in-from-right-4 transition-all duration-500`}>
              <h2 className="text-xl font-bold text-orange-500 mb-6 uppercase tracking-widest text-left">Histórico</h2>
              <div className="space-y-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {historico.length > 0 ? historico.map((item, index) => (
                  <div key={index} className={`border rounded-xl p-4 text-[10px] space-y-2 relative border-l-4 border-l-orange-600 ${temaEscuro ? "bg-black/40 border-zinc-800/50" : "bg-zinc-50 border-zinc-200 shadow-sm"}`}>
                     <div className="absolute top-0 right-0 bg-orange-600 px-2 py-0.5 text-[8px] text-white font-bold rounded-bl-lg">#{index + 1}</div>
                     
                     <p className={`flex justify-between border-b pb-1 ${temaEscuro ? "border-zinc-800/30 text-zinc-400" : "border-zinc-200 text-zinc-500"}`}>Cartão: <span className={`${temaEscuro ? "text-white" : "text-zinc-800"} font-bold`}>{item.tipo === "tipo1" ? "VISA/MASTER" : "ELO/OUTROS"}</span></p>
                     <p className={`flex justify-between border-b pb-1 ${temaEscuro ? "border-zinc-800/30 text-zinc-400" : "border-zinc-200 text-zinc-500"}`}>Liberado: <span className="text-orange-500 font-bold">R$ {formatar(item.resultado.valorLiberado)}</span></p>
                     <p className={`flex justify-between border-b pb-1 ${temaEscuro ? "border-zinc-800/30 text-zinc-400" : "border-zinc-200 text-zinc-500"}`}>Prazo: <span className={`${temaEscuro ? "text-white" : "text-zinc-800"} font-bold`}>{item.parcelas}x</span></p>
                     <p className={`flex justify-between border-b pb-1 ${temaEscuro ? "border-zinc-800/30 text-zinc-400" : "border-zinc-200 text-zinc-500"}`}>Parcela: <span className={`${temaEscuro ? "text-white" : "text-zinc-800"} font-bold`}>R$ {item.resultado.parcela ? formatar(item.resultado.parcela) : '-'}</span></p>
                     <p className={`${temaEscuro ? "text-white" : "text-zinc-900"} font-black pt-1 text-right text-xs uppercase tracking-tighter`}>Total: R$ {formatar(item.resultado.totalPagar)}</p>
                  </div>
                )) : <p className="text-zinc-400 italic text-left text-xs mt-10">Sem registros.</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
