"use client";

import { useState, useEffect, useMemo } from "react";
import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import RunwayChart from "@/components/RunwayChart";




type StatusConfig = {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
};


export default function Home() {
  const [cash, setCash] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [passiveRevenue, setPassiveRevenue] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLHeadingElement>(null);

  
  
  const toCurrency = (value: number) => { 

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Cleaner Fuction (Tranform Everything that user digits in number)
  const handleInputChange = (value: string, setter: (val: number) => void) => {
    const digits = value.replace(/\D/g, "");
    const amount = Number(digits) / 100;
    setter(amount);
  }

    // (LocalStorage)
    useEffect(() => {
      const saved = localStorage.getItem('runway-data');
      if (saved) {
        const { cash: s, expenses: e, passive: p } = JSON.parse(saved);
        setCash(s || 0);
        setExpenses(e || 0);
        setPassiveRevenue(p || 0);
      }
    }, []);

    useEffect(() => {
      localStorage.setItem('runway-data', JSON.stringify({ cash, expenses, passive: passiveRevenue }));
    }, [cash, expenses, passiveRevenue]);


    //Logic Calculous
    const runway = useMemo(() => {
      const netBurn = expenses - passiveRevenue;

      if (passiveRevenue >= expenses && expenses >0) {
        return Infinity;
      }

      if (netBurn > 0 && cash > 0) {
        const result = cash / netBurn;
        return result > 12000 ? 12000 : result
      }

      return 0
    }, [cash, expenses, passiveRevenue])
  

    const getStatusData = (months: number): StatusConfig => {
      if (months <= 0) return {
        text: 'Insira seus dados para calcular sua sobrevivência',
        color: 'text-slate-400',
        bgColor: 'bg-slate-800/30',
        borderColor: 'border-slate-700'
      };
      
      if (months < 3) return {
        text: 'PERIGO: Sua reserva é crítica. Se um layoff acontecer hoje, você terá pouco tempo de manobra. Corte gastos imediatamente!',
        color: 'text-red-500',
        bgColor: 'bg-red-900/20',
        borderColor: 'border-red-700'
      };

      if (months < 6) return {
        text: 'Alerta: Sua margem é moderada. Tente atingir o objetivo de 6 meses de reserva para maior segurança.',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-900/20',
        borderColor: 'border-yellow-700'
      };

      if (months === Infinity) return {
        text: 'LIBERDADE FINANCEIRA: Parabéns! Sua renda passiva cobre seus custos. Você zerou o jogo da sobrevivência.',
        color: 'text-blue-400',
        bgColor: 'bg-blue-900/30',
        borderColor: 'border-blue-500'
      };

      // "SAFEGUARD"
      return {
        text: 'Segurança: Parabéns! Você possui um runway sólido. É o momento ideal para focar em aportes e renda passiva.',
        color: 'text-green-400',
        bgColor: 'bg-green-800/30',
        borderColor: 'border-green-700'
      };
    }
    

    const status = getStatusData(runway)

    if (!status) {
      return <div>Erro: Não foi possível calcular o status</div>
    }

    const survivalDate = (runway > 0 && runway < 12000) ? addMonths(new Date(), runway) : null;

    // --- Entrace Animation ---
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

   
    tl.from('.appName', { opacity: 0, y: 20, duration: 0.8 })
      .from('.animate-card', { opacity: 0, scale: 0.95, duration: 0.6 }, "-=0.4");
  }, { scope: containerRef }); // O scope limita o GSAP a procurar classes apenas dentro do ref

  // --- Countation animation ---
  useGSAP(() => {
    if (!numberRef.current || runway === Infinity) return;

    
    gsap.from(numberRef.current, {
      textContent: 0, 
      duration: 1,
      snap: { textContent: 0.1 }, 
      ease: "power1.out"
    });
  }, [runway]);
    
 return (
  <main className="bg-slate-950 w-full min-h-screen flex flex-col justify-center items-center p-4">
    {/* Aumentamos a largura máxima do container para comportar as duas colunas */}
    <div ref={containerRef} className="max-w-6xl w-full flex flex-col items-center">
      
      <div className="mb-8 text-center animate-item">
        <h1 className="text-green-600 font-bold text-4xl p-4 appName">
          Runway Dashboard
        </h1>
        <p className="text-slate-400 text-lg">
          Não Calcule Saldo. Calcule tempo de <span className="text-red-600 font-semibold">Sobrevivência</span>
        </p>
      </div>

      {/* Grid Responsivo: 1 coluna no mobile, 2 colunas no desktop (md:flex-row) */}
      <div className="flex flex-col md:flex-row gap-8 w-full items-start justify-center">
        
        {/* COLUNA DA ESQUERDA: O Card de Inputs e Resultado */}
        <div className="animate-card w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex-shrink-0">
          <div className="space-y-6">
            <form action="" className="flex flex-col gap-6">
              <div className="flex flex-col w-full">
                <label className="text-white font-bold text-center mb-2">Saldo Total da Reserva</label>
                <input type="text" value={toCurrency(cash)} onChange={(e) => handleInputChange(e.target.value, setCash)} className="bg-white rounded-md p-2 text-black text-center text-lg font-semibold" placeholder="R$ 0,00" /> 
              </div>

              <div className="flex flex-col w-full">
                <label className="text-white font-bold text-center mb-2">Renda Passiva</label>
                <input type="text" value={toCurrency(passiveRevenue)} onChange={(e) => handleInputChange(e.target.value, setPassiveRevenue)} className="bg-white rounded-md p-2 text-black text-center text-lg font-semibold" placeholder="R$ 0,00"/> 
              </div>

              <div className="flex flex-col w-full">
                <label className="text-white font-bold text-center mb-2">Custo de vida Mensal</label>
                <input type="text" value={toCurrency(expenses)} onChange={(e) => handleInputChange(e.target.value, setExpenses)} className="bg-white rounded-md p-2 text-black text-center text-lg font-semibold" placeholder="R$ 0,00"/> 
              </div>
            </form>
            
             
          {survivalDate && runway !== Infinity && (
              <div className="p-2 bg-slate-950 rounded-full text-center text-xs text-slate-400">
                Duração Máxima: <span className="text-white font-bold">{format(survivalDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
              </div>
            )}
            <div className="flex text-white justify-center flex-col items-center pt-4 border-t border-slate-800">
              <p className="text-xl opacity-70">Você possui:</p>
              <h1 className={`text-5xl font-bold ${status.color} my-2`}>
                <span ref={numberRef}>
                  {runway === Infinity ? "∞" : runway.toFixed(1)}
                </span> 
                {runway !== Infinity && <span className="text-2xl ml-2">Meses</span>}
              </h1>

              <div className={`${status.color} ${status.bgColor} border ${status.borderColor} p-5 mt-4 rounded-2xl text-center w-full`}>
                <p>{status.text}</p>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DA DIREITA: O Gráfico (Aparece condicionalmente se houver dados) */}
        {runway > 0 && (
          <div className="animate-chart w-full flex-grow">
             <RunwayChart cash={cash} expenses={expenses} passiveRevenue={passiveRevenue} />
          </div>
        )}

      </div>
    </div>
  </main>
);
}