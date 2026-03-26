import React from 'react';
import { DomainMetric } from '../../contracts/types';

interface MetricsProps {
  metrics: DomainMetric[];
  theme?: string;
}

export default function DomainMetricsPanel({ metrics, theme = 'cyan' }: MetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((m) => (
        <div 
            key={m.id} 
            className="rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl p-6 transition-all hover:bg-neutral-800/50 group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-500 group-hover:text-neutral-300 transition-colors">
              {m.label}
            </span>
            {m.trend && (
              <span className={`text-[10px] font-black ${
                m.trend === 'up' ? 'text-emerald-400' : 
                m.trend === 'down' ? 'text-rose-400' : 'text-neutral-600'
              }`}>
                {m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '→'}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black tracking-tight text-${theme}-400 group-hover:scale-105 transition-transform origin-left`}>
              {m.value}
            </span>
            {m.unit && (
              <span className="text-xs font-bold text-neutral-600">{m.unit}</span>
            )}
          </div>
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <div 
                className={`h-full bg-${theme}-500/30 w-full animate-pulse`} 
                style={{ animationDelay: `${Math.random()}s` }}
             />
          </div>
        </div>
      ))}
      {metrics.length === 0 && (
          <div className="col-span-full py-12 text-center text-[10px] uppercase font-bold tracking-[0.5em] text-neutral-700 italic border border-dashed border-white/5 rounded-2xl">
              Waiting for telemetry data...
          </div>
      )}
    </div>
  );
}
