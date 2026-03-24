"use client";
import React, { useState, useEffect } from 'react';
import { useGovernanceStore } from '../../../stores/governanceStore';
import { useAethelgardStore } from '../../../stores/aethelgardStore';

export default function GovernanceDomain() {
  const governance = useGovernanceStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);
  const [activeAccId, setActiveAccId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        governance.syncGovernance();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const accords = governance.accords || [];

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Crystalline Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-rose-950/20 via-black to-slate-950" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
      
      <header className="relative z-10 text-center mb-24 max-w-4xl px-8">
        <p className="text-[10px] uppercase tracking-[0.8em] text-rose-400 font-bold mb-4">Interstellar Legislative Governance</p>
        <h1 className="text-6xl font-black tracking-tighter text-white mb-6 uppercase italic">Governance</h1>
        <div className="flex justify-center items-center gap-12 text-[11px] uppercase tracking-widest text-rose-400 border border-white/5 px-12 py-4 rounded-full bg-white/5 shadow-2xl backdrop-blur-3xl transition-transform hover:scale-105">
            <span>Accords: {governance.totalLegislation}</span>
            <span>Ratifying: {governance.isRatifying ? 'PROCEEDING' : 'IDLE'}</span>
            <span>Status: SOVEREIGN</span>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-8 space-y-12">
            <div className="p-16 rounded-[4.5rem] bg-white/5 border border-white/5 shadow-2xl relative overflow-hidden h-[600px] flex flex-col justify-between group">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-10 font-bold">Legislative Pulse Center</h3>
                
                <div className="flex flex-col items-center justify-center h-full">
                    <div 
                        className="w-80 h-80 rounded-full border border-rose-500/10 flex items-center justify-center transition-transform duration-[4000ms] ease-in-out"
                        style={{ transform: `scale(${pulse})` }}
                    >
                        <div className="w-48 h-48 rounded-full border-4 border-rose-500/20 shadow-xl relative">
                            <div className="absolute inset-8 rounded-full bg-rose-500/20 blur-2xl animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-4 w-4 bg-rose-500 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.8)]" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-20 text-center">
                        <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-rose-500 mb-2">Omniverse Legislation Baseline</p>
                        <p className="text-3xl font-black tracking-tighter text-white uppercase">{governance.isRatifying ? 'Ratifying Consensus...' : 'Legislative Harmony'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
                {accords.map(acc => (
                    <div key={acc.id} className="p-12 rounded-[3.5rem] bg-white/5 border border-white/5 shadow-sm group hover:border-rose-500/30 transition-all duration-500 h-[280px] flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`h-2 w-2 rounded-full ${acc.status === 'enforced' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`} />
                            <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold">{acc.id}</span>
                        </div>
                        <div>
                            <h4 className="text-2xl font-black tracking-tight mb-2 uppercase group-hover:text-rose-400 transition-colors">{acc.title}</h4>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">Compliance: {acc.complianceRate}%</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-8 mt-4">
                            <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest">{acc.status}</span>
                            {acc.status === 'draft' && (
                                <button 
                                    onClick={() => governance.ratifyAccord(acc.id)}
                                    className="text-[10px] font-bold text-rose-500 hover:text-rose-400 uppercase tracking-widest"
                                >
                                    Ratify
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="col-span-4 space-y-8 flex flex-col h-full">
            <div className="p-12 rounded-[5rem] bg-rose-950/20 border border-rose-500/20 shadow-2xl text-white flex-1 flex flex-col justify-between overflow-hidden relative group">
                <div className="absolute bottom-0 right-0 p-12 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                    <span className="text-[150px] font-black italic serif">G</span>
                </div>
                <div>
                   <h3 className="text-[10px] uppercase font-bold tracking-[0.4em] text-rose-400 mb-12">Legislative Metrics</h3>
                   <div className="space-y-10">
                       {[
                           { label: "Consensus Parity", val: "100%", color: "text-emerald-400" },
                           { label: "Accord Integrity", val: "ABSOLUTE", color: "text-white" },
                           { label: "Legislative Index", val: governance.totalLegislation, color: "text-rose-400" },
                           { label: "Civilization Stage", val: 'SOVEREIGN', color: "text-white" }
                       ].map(stat => (
                           <div key={stat.label}>
                               <div className="text-[9px] uppercase text-white/30 mb-1 tracking-widest">{stat.label}</div>
                               <div className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.val}</div>
                           </div>
                       ))}
                   </div>
                </div>
                <div className="pt-12 border-t border-white/5 flex gap-4">
                    <button 
                        onClick={() => governance.proposeAccord("Quantum Ethics Accord")}
                        className="w-full py-5 bg-rose-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.5em] hover:bg-rose-500 transition-all shadow-xl active:scale-95"
                    >
                        Propose Accord
                    </button>
                </div>
            </div>

            <div className="p-12 rounded-[4rem] bg-white/5 border border-white/5 shadow-sm flex items-center gap-8 group">
                <div className="h-14 w-14 rounded-full border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all transform group-hover:rotate-12">
                    <span className="text-2xl font-black">🏛️</span>
                </div>
                <div>
                    <h4 className="text-[10px] uppercase font-bold text-rose-400 tracking-[0.2em] mb-1">Legislative Guidance</h4>
                    <p className="text-xs text-white/40 leading-relaxed italic truncate">Global accords are absolute across the eternal mesh.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
