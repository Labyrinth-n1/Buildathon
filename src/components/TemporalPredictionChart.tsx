import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { motion } from "motion/react";

interface DataPoint {
  date: string;
  expectedCases: number;
}

export function TemporalPredictionChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="glass-panel p-6 h-full flex flex-col bg-neon-purple/5">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-mono text-neon-purple uppercase tracking-widest">Modélisation Prédictive Temporelle</h3>
          <p className="text-[10px] text-slate-500 uppercase">Projection à 14 jours basée sur les algorithmes ML</p>
        </div>
        <div className="px-2 py-1 rounded bg-neon-purple/10 border border-neon-purple/20 text-[10px] font-mono text-neon-purple">
          MODÈLE RNN-TRANSFORMER
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#bc13fe" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.3)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: 'rgba(255,255,255,0.3)' }}
            />
            <YAxis 
               stroke="rgba(255,255,255,0.3)" 
               fontSize={10} 
               tickLine={false} 
               axisLine={false}
               tick={{ fill: 'rgba(255,255,255,0.3)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(10, 14, 20, 0.9)', 
                border: '1px solid rgba(188, 19, 254, 0.3)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#bc13fe' }}
            />
            <Area 
              type="monotone" 
              dataKey="expectedCases" 
              stroke="#bc13fe" 
              fillOpacity={1} 
              fill="url(#colorCases)" 
              strokeWidth={2}
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-around text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-purple" />
          <span>Vecteur de propagation R0: 1.42</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-blue" />
          <span>Intervalle de confiance : 94.2%</span>
        </div>
      </div>
    </div>
  );
}
