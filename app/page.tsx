"use client";

import { useState, useEffect } from "react";
import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

type StatusConfig = {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
};


export default function Home() {
  const [cash, setCash]= useState("")
  const [expenses, setExpenses] = useState("")
  const [runway, setRunway] = useState(0)

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, "");

    const amout = Number(digits) /100

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amout)
  }

  useEffect(() => {
      localStorage.setItem('runway-data', JSON.stringify({cash, expenses}));
    }, [cash, expenses]
  )

  useEffect(() => {
    const saved = localStorage.getItem('runway-data');
    if (saved){
      const { cash: s, expenses: e} = JSON.parse(saved);
      setCash(s);
      setExpenses(e)
    }
  }, []);

  useEffect(() => {
  
    const parseValue = (val: string) => {
    // Remove tudo que não é dígito e divide por 100 para ter as casas decimais
    const cleanValue = val.replace(/\D/g, "");
    return cleanValue ? parseFloat(cleanValue) / 100 : 0;
  };
    const s = parseValue(cash) ;
    const e = parseValue(expenses) ;

    if (e > 0) {
      setRunway(s / e)
    } else {
      setRunway(0)
    }

  }, [cash, expenses]) 

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

      // O "SAFEGUARD": Se não entrou em nenhum if acima (ou seja, >= 6), ele obrigatoriamente retorna este
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


    
  return (
   <main className="bg-slate-950 w-full min-h-screen flex flex-col justify-center items-center p-4">
    <div className="max-w-md w-full mb-6 text-center">
      <h1 className="text-green-600 font-bold text-center text-3xl p-4">Runway Dashboard</h1>
      <p className="text-slate-400">Não Calcule Saldo. Calcule tempo de <span className="text-red-600 font-semibold">Sobrevivência</span></p>
    </div>

    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="space-y-6">
        <form action="" className="flex justify-center items-center flex-col gap-6">
          <div className="flex flex-col w-full">
            <label htmlFor="salary" className="text-white font-bold text-xl p-4 text-center">Digite Aqui Seu Salário</label>
            <input type="text" id="salary" name="salary" value={cash} onChange={(e) => setCash(formatCurrency(e.target.value))} className="bg-white  rounded-md p-2" placeholder="R$ 0,00" /> 
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="expenses" className="text-white font-bold text-xl p-4 text-center">Digite Aqui suas Dívidas Mensais</label>
            <input type="text" id="expenses" name="expenses" value={expenses} onChange={(e) => setExpenses(formatCurrency(e.target.value))} className="bg-white rounded-md p-2" placeholder="R$ 0,00"/> 
          </div>
            

        </form>
        
        {survivalDate && (
          <div className="mb-4 px-4 py-1 bg-slate-950 border border-slate-800 rounded-full text-xs text-slate-400 animate-pulse">
            Duração Máxima: <span className="text-white font-bold">{format(survivalDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
          </div>
        )}
        <div className="flex text-white justify-center flex-col items-center">
          <p className="text-xl">Você possui:</p>
          <h1 className={`text-4xl font-bold ${status.color}`}>{runway.toFixed(1)} Meses</h1>

          <div className={`${status.color} ${status.bgColor} border ${status.borderColor} p-5 mt-4 rounded-2xl`}>
            <p>{status.text}</p>
          </div>
        </div>

        
      </div>
    </div>

   </main>
  );
}