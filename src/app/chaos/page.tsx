"use client";
import React, { useState, useEffect } from 'react';
import { useChaosStore } from '../../stores/chaosStore';
import { useAethelgardStore } from '../../stores/aethelgardStore';

export default function ChaosDomain() {
  const chaos = useChaosStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        chaos.syncChaos();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const drills = chaos.drills || [];

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Liquid-Rose-Chaos-Atmosphere */}
      <div className={`absolute inset-0 z-0 bg-gradient-to-br from-rose-950/30 via-black to-slate-900 transition-opacity duration-[2000ms] ${chaos.chaosLevel > 0 ? 'opacity-100' : 'opacity-40'}`} />
      <div className={`absolute top-0 inset-x-0 h-1 transition-all duration-[2000ms] ${chaos.chaosLevel > 50 ? 'bg-rose-500 shadow-[0_0_60px_rgba(244,63,94,1)]' : 'bg-transparent'}`} />
      <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <header className="relative z-10 text-center mb-24 max-w-5xl px-8 w-full flex justify-between items-end gap-16">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1em] text-rose-500 font-black mb-4 italic">Interstellar Resilience Simulation</p>
            <h1 className="text-7xl font-black tracking-tighter text-white mb-6 uppercase italic leading-none">Chaos</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-rose-500 border border-white/5 px-12 py-4 rounded-full bg-white/5 shadow-2xl backdrop-blur-3xl transition-transform hover:scale-105">
                <span>Chaos Factor: {chaos.chaosLevel}%</span>
                <span>Drills: {drills.length}</span>
                <span>Status: {chaos.chaosLevel > 0 ? 'RESILIENCE_TEST' : 'NOMINAL'}</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-8 space-y-12 h-full flex flex-col">
            <div className={`p-20 rounded-[6rem] bg-white/5 border transition-all duration-[2000ms] relative overflow-hidden flex flex-col justify-between group flex-1 h-[600px] ${
                chaos.chaosLevel > 50 ? 'border-rose-500 shadow-[0_0_100px_rgba(244,63,94,0.3)]' : 'border-white/5 shadow-inner'
            }`}>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <h3 className="text-[11px] uppercase tracking-[0.5em] text-white/30 mb-10 font-black italic">Resilience Pulse Center</h3>
                
                <div className="flex flex-col items-center justify-center h-full">
                    <div 
                        className="w-96 h-96 rounded-full border border-rose-500/10 flex items-center justify-center transition-transform duration-[4000ms] ease-in-out"
                        style={{ transform: `scale(${pulse})` }}
                    >
                        <div className={`w-72 h-72 rounded-full border-4 shadow-3xl relative transition-all duration-[2000ms] ${
                            chaos.chaosLevel > 0 ? 'border-rose-500 bg-rose-500/10 animate-pulse' : 'border-white/10 bg-white/5 shadow-inner'
                        }`}>
                            <div className={`absolute inset-16 rounded-full blur-3xl transition-all duration-1000 ${
                                chaos.chaosLevel > 0 ? 'bg-rose-500/30 shadow-[0_0_60px_rgba(244,63,94,0.6)]' : 'bg-rose-400/5'
                            }`} />
                            <div className="absolute inset-0 flex items-center justify-center scale-150">
                                <div className={`h-8 w-8 rounded-full shadow-2xl transition-all duration-1000 ${
                                    chaos.chaosLevel > 0 ? 'bg-rose-500 shadow-[0_0_40px_rgba(244,63,94,1)]' : 'bg-emerald-400 shadow-[0_0_40px_rgba(52,211,153,1)]'
                                }`} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center z-10">
                    <p className="text-[10px] uppercase tracking-[0.8em] font-black text-rose-500 mb-6 italic underline decoration-rose-500/30 decoration-4 underline-offset-8">Resilience Baseline Protocol</p>
                    <p className="text-5xl font-black tracking-tighter text-white uppercase italic leading-none transition-all duration-1000">
                        {chaos.isInjecting ? 'Injecting Chaos Signals...' : 'Absolute Resilience'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mt-12">
                {drills.map(drill => (
                    <div 
                        key={drill.id} 
                        className={`p-12 rounded-[5rem] bg-white/5 border transition-all duration-1000 h-[380px] flex flex-col justify-between group cursor-default relative overflow-hidden active:scale-95 ${
                            drill.status === 'running' ? 'bg-rose-500/10 border-rose-500/40 text-white shadow-2xl' : 'bg-white/5 border-white/5 text-white/40'
                        }`}
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-rose-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-start mb-10 w-full relative z-10">
                            <div className={`h-4 w-4 rounded-full transition-all duration-1000 ${drill.status === 'running' ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,1)] animate-ping' : 'bg-emerald-400/50'}`} />
                            <span className="text-[10px] uppercase font-black text-white/30 tracking-widest italic">{drill.id}</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] uppercase font-black text-white/20 tracking-[0.4em] mb-4 italic">Resilience Test Type</p>
                            <h4 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 italic transition-colors leading-none group-hover:text-rose-400">{drill.name}</h4>
                            <div className="flex justify-between items-center py-4 border-y border-white/5 group-hover:border-rose-500/20 transition-all duration-1000">
                                <span className="text-[10px] uppercase font-black text-white/20 tracking-[0.3em] italic">Stress Impact</span>
                                <span className="text-xl font-black text-rose-500 italic">-{drill.impact}%</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-8 mt-6 relative z-10">
                            <span className="text-[10px] uppercase font-black text-white/40 tracking-[0.6em] italic leading-none">{drill.status}</span>
                            {drill.status === 'idle' && (
                                <button 
                                    onClick={() => chaos.injectChaos(drill.id)}
                                    className="px-10 py-4 bg-white text-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.8em] hover:bg-rose-600 hover:text-white transition-all active:scale-90 shadow-2xl italic"
                                >
                                    Inject
                                </button>
                            )}
                            {drill.status === 'running' && (
                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.6em] italic bg-rose-500/10 px-6 py-2 rounded-full border border-rose-500/20">TESTING_RESILIENCE</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="col-span-4 space-y-12 flex flex-col h-full grow">
            <div className="p-16 rounded-[7rem] bg-rose-950/20 border border-rose-500/30 shadow-2xl text-white flex-1 flex flex-col justify-between overflow-hidden relative group h-full">
                <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity transform group-hover:rotate-45 duration-1000">
                    <span className="text-[200px] font-black italic serif leading-none">X</span>
                </div>
                <div className="relative z-10">
                   <h3 className="text-[11px] uppercase font-black tracking-[0.6em] text-rose-400 mb-16 underline decoration-rose-500/30 decoration-4 underline-offset-8">Resilience Metrics</h3>
                   <div className="space-y-12">
                       {[
                           { label: "Healing Rate", val: "99.99%", color: "text-emerald-400" },
                           { label: "Stability Parity", val: "LOCKED", color: "text-white" },
                           { label: "Chaos Factor", val: chaos.chaosLevel + "%", color: "text-rose-500" },
                           { label: "Drill Score", val: 'ABSOLUTE', color: "text-white" }
                       ].map(stat => (
                           <div key={stat.label} className="border-l-2 border-white/5 pl-8 py-2 hover:border-rose-500/40 transition-all duration-1000">
                               <div className="text-[10px] uppercase text-white/30 mb-2 tracking-[0.4em] font-black italic">{stat.label}</div>
                               <div className={`text-5xl font-black tracking-tighter ${stat.color}`}>{stat.val}</div>
                           </div>
                       ))}
                   </div>
                </div>
                <div className="pt-16 border-t border-white/5 flex gap-4 relative z-10">
                    <button 
                        onClick={() => chaos.stabilizeReality()}
                        className="w-full py-8 bg-white text-slate-900 rounded-full text-[11px] font-black uppercase tracking-[1em] hover:bg-rose-600 hover:text-white transition-all shadow-2xl active:scale-95 italic"
                    >
                        Stabilize Shards
                    </button>
                </div>
            </div>

            <div className="p-12 rounded-[5.5rem] bg-white/5 border border-white/5 shadow-2xl flex items-center gap-12 group relative overflow-hidden transition-all hover:bg-white/10">
                <div className="h-20 w-20 rounded-full border border-rose-500/20 flex items-center justify-center text-rose-500 group-hover:bg-rose-600 group-hover:text-white transition-all transform group-hover:rotate-180 duration-1000 shadow-2xl">
                    <span className="text-4xl font-black italic serif">!</span>
                </div>
                <div>
                    <h4 className="text-[14px] uppercase font-black text-rose-400 tracking-[0.6em] mb-2 leading-none italic">Chaos Guidance</h4>
                    <p className="text-xs text-white/30 leading-relaxed italic truncate font-black">Resilience is the outcome of intentional chaos calibration.</p>
                </div>
            </div>
            
            <div className="text-[11px] uppercase tracking-[1.4em] text-white/10 font-black px-12 text-center italic">Chaos Singularity: PERSISTENT</div>
        </div>
      </div>

      <div className="mt-24 text-[11px] uppercase tracking-[1.8em] font-black text-white/10 flex items-center gap-24">
          <div className="h-px w-64 bg-white/5" />
          Entropy status: ABSOLUTE
          <div className="h-px w-64 bg-white/5" />
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
