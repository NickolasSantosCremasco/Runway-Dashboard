'use client'

import { useMemo } from "react"
import { generateChartData } from "@/utils/calculateCharData"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type Props = {
    cash: number;
    expenses: number;
    passiveRevenue: number;
};

const toK = (num: number) => {
    if (num >= 1000) {
        return `R$ ${(num / 1000).toFixed(0)}k`;
    }
    return `R$ ${num.toFixed(0)}`;
};

export default function RunwayChart({ cash, expenses, passiveRevenue}: Props) {
    //Gera dados sempre que inputs mudarem
    const chartData = useMemo(() => {
        return generateChartData(cash, expenses, passiveRevenue);
    }, [cash, expenses, passiveRevenue]);

    //if don't have enough data, don't render anything
    if (chartData.length < 2) return null;

   return (
    <div className="w-full h-75 md:h-100 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
      <h3 className="text-slate-300 text-center font-bold mb-4">
        Projeção de Queima de Caixa
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {/* Gradiente de cor para a área abaixo da linha */}
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} /> {/* Verde */}
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF" 
            tick={{ fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#9CA3AF" 
            tick={{ fill: '#9CA3AF' }}
            tickFormatter={toK} // Formata Y como "R$ 5k"
            axisLine={false}
            tickLine={false}
          />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#E5E7EB', fontWeight: 'bold' }}
            formatter={(value: any) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value), "Saldo Projetado"]}
          />
          
          {/* A linha e a área do gráfico */}
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#10B981" 
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorBalance)" // Usa o gradiente definido acima
            animationDuration={1500} // Animação inicial do próprio Recharts (podemos remover depois para usar GSAP)
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}