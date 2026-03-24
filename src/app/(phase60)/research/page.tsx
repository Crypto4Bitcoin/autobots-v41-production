"use client";
import React, { useState, useEffect } from 'react';
import { useResearchStore } from '../../../stores/researchStore';
import { useAethelgardStore } from '../../../stores/aethelgardStore';

export default function ResearchDomain() {
  const research = useResearchStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);
  const [activeHypothesisId, setActiveHypothesisId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        if (research.hypotheses.filter(h => h.status === 'testing').length > 0) {
            research.validateBreakthrough();
        }
    }, 15000);
    return () => clearInterval(interval);
  }, [research.hypotheses]);

  const hypotheses = research.hypotheses || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Crystalline Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-violet-50 via-white to-slate-100" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-violet-200 to-transparent" />
      
      <header className="relative z-10 text-center mb-24 max-w-4xl px-8">
        <p className="text-[10px] uppercase tracking-[0.6em] text-violet-600 font-bold mb-4">Meta-Intelligence Research</p>
        <h1 className="text-6xl font-black tracking-tighter text-slate-950 mb-6 uppercase">Research</h1>
        <div className="flex justify-center items-center gap-12 text-[11px] uppercase tracking-widest text-violet-600/40 border border-violet-100 px-8 py-3 rounded-full bg-white/50 backdrop-blur shadow-sm transition-transform hover:scale-105">
            <span>Breakthroughs: {research.breakthroughs}</span>
            <span>Simulating: {research.isSimulating ? 'YES' : 'NO'}</span>
            <span>Status: OMNISCIENT</span>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-4 space-y-12">
            <div className="p-10 rounded-[3rem] bg-white border border-violet-100 shadow-[0_20px_50px_-15px_rgba(139,92,246,0.05)]">
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-violet-600 mb-8 font-bold">Hypothesis Stream</h3>
                <div className="space-y-4">
                    {hypotheses.map(hyp => (
                        <button 
                            key={hyp.id} 
                            onClick={() => setActiveHypothesisId(hyp.id)}
                            className={`w-full text-left p-6 h-24 rounded-[2rem] border transition-all duration-500 relative overflow-hidden group ${
                                activeHypothesisId === hyp.id ? 'bg-violet-900 border-violet-800 text-white shadow-xl translate-x-1' : 'bg-white border-slate-100 hover:border-violet-100 hover:bg-violet-50/10'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className={`text-sm font-bold tracking-tight mb-1 ${activeHypothesisId === hyp.id ? 'text-white' : 'text-slate-950'}`}>{hyp.title}</div>
                                    <div className={`text-[9px] uppercase tracking-widest ${activeHypothesisId === hyp.id ? 'text-violet-300' : 'text-slate-400'}`}>{hyp.status}</div>
                                </div>
                                <div className={`text-[10px] font-mono font-bold ${activeHypothesisId === hyp.id ? 'text-violet-400' : 'text-slate-200'}`}>{hyp.confidence}%</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-10 rounded-[3rem] bg-violet-50/30 border border-violet-100 shadow-sm text-center">
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-violet-600 mb-8 font-bold">Scientific Probe</h3>
                <button 
                    onClick={() => research.addHypothesis("Temporal Sync Protocol")}
                    className="w-full py-5 bg-slate-950 text-white rounded-full text-xs font-bold uppercase tracking-[0.4em] hover:bg-violet-600 transition-all shadow-xl active:scale-95"
                >
                    Add Hypothesis
                </button>
            </div>
        </div>

        <div className="col-span-8 space-y-12">
            <div className="p-16 rounded-[4.5rem] bg-white border border-slate-100 shadow-2xl relative overflow-hidden h-[600px] flex flex-col justify-between group">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-slate-400 mb-10 font-bold">Singularity Research Suite</h3>
                
                <div className="flex flex-col items-center justify-center h-full">
                    <div 
                        className="w-80 h-80 rounded-full border border-violet-500/10 flex items-center justify-center transition-transform duration-[4000ms] ease-in-out"
                        style={{ transform: `scale(${pulse})` }}
                    >
                        <div className="w-48 h-48 rounded-full border-4 border-violet-500/20 shadow-xl relative">
                            <div className="absolute inset-8 rounded-full bg-violet-500/20 blur-2xl animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-4 w-4 bg-violet-500 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.8)]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pb-12">
                    <button 
                        onClick={() => activeHypothesisId && research.runSimulation(activeHypothesisId)}
                        disabled={!activeHypothesisId || research.isSimulating}
                        className={`px-12 py-4 rounded-full text-xs font-black uppercase tracking-[0.4em] transition-all shadow-xl active:scale-95 ${
                            !activeHypothesisId || research.isSimulating ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-slate-950 text-white hover:bg-violet-600'
                        }`}
                    >
                        {research.isSimulating ? 'SIMULATING...' : 'RUN SIMULATION'}
                    </button>
                </div>
            </div>

            <div className="p-10 rounded-[3rem] bg-indigo-950 border border-slate-900 shadow-2xl flex items-center gap-8 group">
                <div className="h-14 w-14 rounded-full border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all transform group-hover:rotate-[360deg] duration-[2s]">
                    <span className="text-2xl font-black">🧪</span>
                </div>
                <div>
                    <h4 className="text-[10px] uppercase font-bold text-violet-400 tracking-[0.2em] mb-1">Scientific Guidance</h4>
                    <p className="text-xs text-white/40 leading-relaxed italic truncate">Scientific breakthroughs are synchronized across the eternal mesh.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
