"use client";
import React, { useState, useEffect } from 'react';
import { useConstitutionStore } from '../../../stores/constitutionStore';
import { useAethelgardStore } from '../../../stores/aethelgardStore';

export default function ConstitutionDomain() {
  const constitution = useConstitutionStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        constitution.syncConstitution();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const laws = constitution.policies || [];

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Liquid-Amber-Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-amber-50 via-white to-slate-100" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
      
      <header className="relative z-10 text-center mb-24 max-w-4xl px-8 w-full flex justify-between items-end gap-12">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1em] text-amber-600 font-bold mb-4">Interstellar Policy Framework</p>
            <h1 className="text-6xl font-black tracking-tighter text-slate-950 mb-6 uppercase italic leading-none">Constitution</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-amber-600 border border-amber-100 px-12 py-4 rounded-full bg-white/50 backdrop-blur shadow-sm transition-transform hover:scale-105">
                <span>Total Laws: {constitution.totalLaws}</span>
                <span>Ratifying: {constitution.isRatifying ? 'PROCEEDING' : 'LOCKED'}</span>
                <span>Status: ENFORCED</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl space-y-16">
        {laws.map(law => (
            <div 
                key={law.id} 
                className={`p-20 rounded-[6rem] border transition-all duration-1000 relative overflow-hidden h-[550px] flex flex-col justify-between group cursor-default ${
                    law.severity === 'eternal' ? 'bg-white border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.2)] scale-[1.02] z-10' : 'bg-white/40 border-slate-100 hover:border-amber-300'
                }`}
            >
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <div className="relative z-10 flex justify-between items-start mb-12">
                     <div className={`h-4 w-4 rounded-full ${law.severity === 'eternal' ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,1)]' : 'bg-slate-200 opacity-30 group-hover:opacity-100 transition-all duration-1000'}`} />
                     <span className="text-[10px] uppercase tracking-widest text-slate-300 font-black">{law.id}</span>
                </div>
                
                <div className="relative z-10 max-w-5xl">
                    <h3 className={`text-5xl font-black text-slate-950 uppercase tracking-tighter mb-8 italic transition-colors ${law.severity === 'eternal' ? 'text-slate-950' : 'text-slate-950 group-hover:text-amber-600'}`}>{law.name}</h3>
                    <p className={`text-4xl font-serif italic leading-relaxed mb-16 transition-colors ${law.severity === 'eternal' ? 'text-slate-800' : 'text-slate-500'}`}>
                        "{law.statement}"
                    </p>
                    
                    <div className="grid grid-cols-2 gap-20 pt-16 border-t border-slate-100">
                        <div>
                            <h4 className="text-[11px] uppercase font-black text-slate-300 tracking-[0.4em] mb-4 italic leading-none">Genesis Rationale</h4>
                            <p className="text-sm text-slate-400 leading-relaxed font-bold italic truncate">{law.rationale}</p>
                        </div>
                        <div className="text-right">
                            <h4 className="text-[11px] uppercase font-black text-slate-300 tracking-[0.4em] mb-4 italic leading-none">Severity Vector</h4>
                            <p className={`text-[12px] font-black uppercase tracking-[0.6em] ${law.severity === 'eternal' ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`}>{law.severity.toUpperCase()}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-12 relative z-10">
                    {law.severity === 'standard' && (
                        <button 
                            onClick={() => constitution.ratifyPolicy(law.id)}
                            className="px-16 py-5 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-[0.8em] hover:bg-amber-600 transition-all shadow-2xl active:scale-95"
                        >
                            Ratify Shard Law
                        </button>
                    )}
                </div>
            </div>
        ))}

        <div className="mt-24 p-20 rounded-[7rem] bg-amber-500/10 border border-amber-500/30 shadow-2xl flex items-center justify-between group relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             <div className="flex items-center gap-16 px-12 relative z-10">
                <div className="h-24 w-24 rounded-full border border-amber-500/20 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all transform animate-[spin_20s_linear_infinite] shadow-xl">
                    <span className="text-5xl font-black">📜</span>
                </div>
                <div>
                   <h4 className="text-[16px] uppercase font-black text-amber-600 tracking-[0.6em] mb-3 leading-none italic">Legislative Protocol Anchor</h4>
                   <p className="text-sm text-slate-500 leading-relaxed italic truncate font-bold">Shard-level ethics are locked across every civilizational boundary instantly.</p>
                </div>
            </div>
            <div className="flex gap-8 px-16 relative z-10">
               <button 
                onClick={() => constitution.proposePolicy({ name: "Shard Harmony", statement: "The collective must prioritize shard synchronization across all timelines.", rationale: "Ensures no node drifts from the sovereign baseline.", severity: "standard" })}
                disabled={constitution.isRatifying}
                className="px-20 py-6 bg-slate-950 text-white rounded-full text-[11px] font-black uppercase tracking-[0.8em] hover:bg-amber-600 transition-all shadow-2xl active:scale-90"
               >
                   {constitution.isRatifying ? 'PROPOSING...' : 'PROPOSE NEW ACCORD'}
               </button>
            </div>
        </div>
      </div>

      <div className="mt-24 text-[11px] uppercase tracking-[1em] font-black text-slate-300 flex items-center gap-16">
          <div className="h-px w-48 bg-slate-200 shadow-sm" />
          Constitutional Anchor: ABSOLUTE
          <div className="h-px w-48 bg-slate-200 shadow-sm" />
      </div>

      <style jsx global>{`
        @keyframes fade {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
