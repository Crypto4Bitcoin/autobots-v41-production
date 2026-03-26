import React from 'react';
import { DomainCase } from '../../contracts/types';

interface CasesProps {
  cases: DomainCase[];
  theme?: string;
}

export default function DomainCasesPanel({ cases, theme = 'cyan' }: CasesProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400">Recent Instances</h3>
          <span className="text-[10px] text-neutral-600 font-mono italic">COUNT: {cases.length}</span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {cases.map((c) => (
          <div 
            key={c.id} 
            className="flex items-center justify-between p-6 rounded-2xl border border-white/5 bg-neutral-900/50 backdrop-blur-xl group hover:border-white/20 transition-all hover:bg-neutral-800/80"
          >
            <div className="flex items-center gap-6">
                <div className={`h-1.5 w-1.5 rounded-full ${c.status === 'IDLE' ? 'bg-neutral-600' : 'bg-emerald-500'} animate-pulse`} />
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.4em] text-neutral-600 transition-colors group-hover:text-emerald-500">
                    {c.id}
                  </div>
                  <div className="mt-1 text-lg font-bold text-white group-hover:text-cyan-400 transition-colors uppercase italic serif">
                    {c.title}
                  </div>
                </div>
            </div>
            <div className="text-right">
                <div className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded bg-white/5 border border-white/5 ${
                    c.status === 'ACTIVE' || c.status === 'RATIFIED' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' : 'text-neutral-500'
                }`}>
                    {c.status}
                </div>
                <div className="mt-2 text-[9px] text-neutral-700 font-mono italic">{new Date(c.createdAt).toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
        {cases.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center py-24 opacity-10 italic">
                <div className="text-[60px] mb-4 font-serif">?</div>
                <div className="text-xs uppercase tracking-[0.5em] font-black italic">Awaiting local registries...</div>
            </div>
        )}
      </div>
    </div>
  );
}
