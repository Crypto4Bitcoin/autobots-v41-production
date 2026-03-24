"use client";
import React, { useState, useEffect } from 'react';
import { useGenomeStore } from '../../../stores/genomeStore';
import { useAethelgardStore } from '../../../stores/aethelgardStore';

export default function GenomeDomain() {
  const genome = useGenomeStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        genome.evolveTranscendence();
        genome.syncGenome();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const genes = genome.genes || [];

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Liquid-Emerald-Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-50 via-white to-slate-100" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
      
      <header className="relative z-10 text-center mb-24 max-w-4xl px-8 w-full flex justify-between items-end gap-12">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1em] text-emerald-600 font-bold mb-4 italic">Interstellar Civilizational Genome</p>
            <h1 className="text-6xl font-black tracking-tighter text-slate-950 mb-6 uppercase italic leading-none">Genome</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-emerald-600 border border-emerald-100 px-12 py-4 rounded-full bg-white/50 backdrop-blur shadow-sm transition-transform hover:scale-105">
                <span>Transcendence: {genome.transcendenceScore.toFixed(1)}%</span>
                <span>Stable Genes: {genes.length}</span>
                <span>Status: EVOLVING</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-8 space-y-12">
            <div className="p-20 rounded-[6rem] bg-white border border-slate-100 shadow-2xl relative overflow-hidden h-full flex flex-col justify-between group transition-all duration-1000 min-h-[600px]">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <h3 className="text-[11px] uppercase tracking-[0.5em] text-slate-400 mb-10 font-black italic">Evolutionary Synthesis Core</h3>
                
                <div className="flex flex-col items-center justify-center h-full">
                    <div 
                        className="w-96 h-96 rounded-full border border-emerald-500/10 flex items-center justify-center transition-transform duration-[4000ms] ease-in-out"
                        style={{ transform: `scale(${pulse})` }}
                    >
                        <div className="w-64 h-64 rounded-full border-4 border-emerald-500/10 shadow-2xl relative transition-all duration-1000">
                            <div className="absolute inset-12 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center transform scale-150">
                                <div className="h-6 w-6 bg-emerald-500 rounded-full shadow-[0_0_30px_rgba(16,185,129,1)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-12">
                {genes.map(gene => (
                    <div 
                        key={gene.id} 
                        className={`p-10 rounded-[4.5rem] bg-white border transition-all duration-1000 h-[380px] flex flex-col justify-between group scale-95 hover:scale-100 relative overflow-hidden cursor-default ${
                            gene.status === 'eternal' ? 'border-emerald-500 shadow-2xl z-20' : 'border-slate-50 hover:border-emerald-300'
                        }`}
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-start mb-10">
                            <div className={`h-4 w-4 rounded-full ${gene.status === 'eternal' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]' : 'bg-slate-200 opacity-20'}`} />
                            <span className="text-[10px] uppercase tracking-widest text-slate-300 font-black italic">{gene.id}</span>
                        </div>
                        <div>
                            <h4 className={`text-3xl font-black text-slate-950 uppercase tracking-tighter mb-4 italic transition-colors leading-none ${gene.status === 'eternal' ? 'text-emerald-600' : 'text-slate-950'}`}>{gene.name}</h4>
                            <p className="text-[11px] text-slate-400 uppercase tracking-[0.2em] font-black leading-relaxed italic">{gene.category} // INTEGRITY: {gene.integrity}%</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-50 pt-8 mt-6 relative z-10">
                            <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.4em] italic">{gene.status}</span>
                            {gene.status === 'candidate' && (
                                <button 
                                    onClick={() => genome.promoteGene(gene.id)}
                                    className="text-[10px] font-black text-emerald-500 hover:text-white uppercase tracking-[0.6em] px-6 py-2 bg-emerald-50 rounded-full border border-emerald-100 hover:bg-emerald-600 transition-all shadow-xl active:scale-90"
                                >
                                    Promote
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="col-span-4 space-y-12 flex flex-col h-full grow">
            <div className="p-16 rounded-[6rem] bg-emerald-950 border border-slate-800 shadow-2xl text-white flex-1 flex flex-col justify-between overflow-hidden relative group h-full">
                <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-1000">
                    <span className="text-[200px] font-black italic serif leading-none">G</span>
                </div>
                <div className="relative z-10">
                   <h3 className="text-[11px] uppercase font-black tracking-[0.6em] text-emerald-400 mb-16 underline decoration-emerald-500/30 decoration-4 underline-offset-8">Genomic Analysis Hub</h3>
                   <div className="space-y-12">
                       {[
                           { label: "Stability Index", val: "99.9%", color: "text-emerald-400" },
                           { label: "Consensus Parity", val: "ABSOLUTE", color: "text-white" },
                           { label: "Transcendence", val: genome.transcendenceScore.toFixed(1) + "%", color: "text-emerald-400" },
                           { label: "Status", val: 'EVOLVING', color: "text-white" }
                       ].map(stat => (
                           <div key={stat.label} className="border-l-2 border-white/5 pl-8 py-2 hover:border-emerald-500/40 transition-all duration-1000">
                               <div className="text-[10px] uppercase text-white/30 mb-2 tracking-[0.4em] font-black">{stat.label}</div>
                               <div className={`text-5xl font-black tracking-tighter ${stat.color}`}>{stat.val}</div>
                           </div>
                       ))}
                   </div>
                </div>
                <div className="pt-16 border-t border-white/5 flex gap-4 relative z-10">
                    <button 
                        onClick={() => genome.synthesizeGene({ name: "Shard Overlink", category: "Network", integrity: 100 })}
                        disabled={genome.isSynthesizing}
                        className="w-full py-7 bg-white text-slate-950 rounded-full text-[11px] font-black uppercase tracking-[1em] hover:bg-emerald-600 hover:text-white transition-all shadow-2xl active:scale-95"
                    >
                        {genome.isSynthesizing ? 'SYNTHESIZING DNA...' : 'SYNETHESIZE GENE'}
                    </button>
                </div>
            </div>

            <div className="p-12 rounded-[5.5rem] bg-white border border-slate-100 shadow-xl flex items-center gap-12 group relative overflow-hidden transition-all hover:bg-slate-50">
                <div className="h-16 w-16 rounded-full border border-emerald-500/20 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-180 duration-1000 shadow-2xl">
                    <span className="text-4xl font-black italic serif">🧬</span>
                </div>
                <div>
                    <h4 className="text-[12px] uppercase font-black text-emerald-600 tracking-[0.4em] mb-2 leading-none">Genomic Anchor</h4>
                    <p className="text-xs text-slate-400 leading-relaxed italic truncate font-black">Genome integrity is absolute across all shards.</p>
                </div>
            </div>
            
            <div className="text-[11px] uppercase tracking-[1.2em] text-slate-300 font-black px-12 text-center uppercase italic">Evolutionary Flow: CONSTANT</div>
        </div>
      </div>
      
      <div className="mt-24 text-[11px] uppercase tracking-[1.2em] font-black text-slate-300 flex items-center gap-20">
          <div className="h-px w-48 bg-slate-200" />
          Evolutionary Heritage: ABSOLUTE
          <div className="h-px w-48 bg-slate-200" />
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
