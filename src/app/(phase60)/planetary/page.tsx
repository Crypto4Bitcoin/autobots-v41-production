"use client";
import React, { useState, useEffect } from 'react';
import { usePlanetaryStore } from '../../../stores/planetaryStore';
import { useWorldKernelStore } from '../../../stores/worldKernelStore';

export default function PlanetaryDomain() {
  const planetary = usePlanetaryStore();
  const kernel = useWorldKernelStore();
  
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        planetary.syncPlanetaryMesh();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const nodes = planetary.nodes || [];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Liquid-Cyan-Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-cyan-50 via-white to-blue-100" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <header className="relative z-10 text-center mb-24 max-w-4xl px-8 w-full flex justify-between items-end gap-12">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1em] text-cyan-600 font-bold mb-4 italic">Interstellar Planetary Stewardship</p>
            <h1 className="text-6xl font-black tracking-tighter text-slate-950 mb-6 uppercase italic leading-none">Planetary</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-cyan-600 border border-cyan-100 px-12 py-4 rounded-full bg-white/50 backdrop-blur shadow-sm transition-transform hover:scale-105">
                <span>Resonance: {planetary.coreResonance.toFixed(1)}%</span>
                <span>Active Shards: {nodes.length}</span>
                <span>Status: SYNCHRONIZED</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-8 space-y-12">
            <div className="p-20 rounded-[6rem] bg-white border border-slate-100 shadow-2xl relative overflow-hidden h-full flex flex-col justify-between group transition-all duration-1000 min-h-[600px]">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <h3 className="text-[11px] uppercase tracking-[0.5em] text-cyan-400 mb-10 font-black italic">Planetary Heartbeat Core</h3>
                
                <div className="flex flex-col items-center justify-center h-full">
                    <div 
                        className="w-96 h-96 rounded-full border border-cyan-500/10 flex items-center justify-center transition-transform duration-[4000ms] ease-in-out"
                        style={{ transform: `scale(${pulse})` }}
                    >
                        <div className="w-64 h-64 rounded-full border-4 border-cyan-500/10 shadow-2xl relative transition-all duration-1000">
                            <div className="absolute inset-12 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center transform scale-150">
                                <div className="h-6 w-6 bg-cyan-500 rounded-full shadow-[0_0_30px_rgba(6,182,212,1)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-12">
                {nodes.map(node => (
                    <div 
                        key={node.id} 
                        className="p-10 rounded-[4.5rem] bg-white border border-slate-50 shadow-2xl relative overflow-hidden h-[380px] flex flex-col justify-between group scale-95 hover:scale-100 hover:border-cyan-400 transition-all duration-1000 cursor-default"
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-start mb-10">
                            <div className={`h-4 w-4 rounded-full ${node.status === 'online' ? 'bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,1)]' : 'bg-rose-400 opacity-20'}`} />
                            <span className="text-[10px] uppercase tracking-widest text-slate-300 font-black italic">{node.id}</span>
                        </div>
                        <div>
                            <h4 className="text-3xl font-black text-slate-950 uppercase tracking-tighter mb-4 italic transition-colors group-hover:text-cyan-600 leading-none">{node.location}</h4>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] uppercase font-black text-cyan-600 border border-cyan-500/20 px-4 py-1.5 rounded-full">{node.type}</span>
                                    <span className="text-xs font-black text-slate-950 underline decoration-cyan-500 decoration-4">{node.load}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full relative overflow-hidden shadow-inner">
                                    <div className="absolute inset-0 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-[3000ms]" style={{ width: `${node.load}%` }} />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-50 pt-8 mt-6 relative z-10">
                            <span className="text-[9px] uppercase font-black text-slate-300 tracking-[0.6em] italic">NODE ACTIVE</span>
                            <button 
                                onClick={() => planetary.routeWorkload(node.id)}
                                className="text-[10px] font-black text-cyan-500 hover:text-white uppercase tracking-[0.6em] px-6 py-2 bg-cyan-50 rounded-full border border-cyan-100 hover:bg-cyan-600 transition-all shadow-xl active:scale-90"
                            >
                                Route
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="col-span-4 space-y-12 flex flex-col h-full grow">
            <div className="p-16 rounded-[6rem] bg-cyan-950 border border-slate-800 shadow-2xl text-white flex-1 flex flex-col justify-between overflow-hidden relative group h-full">
                <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-1000">
                    <span className="text-[200px] font-black italic serif leading-none">P</span>
                </div>
                <div className="relative z-10">
                   <h3 className="text-[11px] uppercase font-black tracking-[0.6em] text-cyan-400 mb-16 underline decoration-cyan-500/30 decoration-4 underline-offset-8">Planetary Analysis Hub</h3>
                   <div className="space-y-12">
                       {[
                           { label: "Stability Index", val: "100.0%", color: "text-emerald-400" },
                           { label: "Relay Latency", val: "4ms", color: "text-white" },
                           { label: "Mesh Consensus", val: "ABSOLUTE", color: "text-cyan-400" },
                           { label: "Status", val: 'SYNCHRONIZED', color: "text-white" }
                       ].map(stat => (
                           <div key={stat.label} className="border-l-2 border-white/5 pl-8 py-2 hover:border-cyan-500/40 transition-all duration-1000">
                               <div className="text-[10px] uppercase text-white/30 mb-2 tracking-[0.4em] font-black">{stat.label}</div>
                               <div className={`text-5xl font-black tracking-tighter ${stat.color}`}>{stat.val}</div>
                           </div>
                       ))}
                   </div>
                </div>
                <div className="pt-16 border-t border-white/5 flex gap-4 relative z-10">
                    <button 
                        onClick={() => planetary.expandCore()}
                        disabled={planetary.isTerraforming}
                        className="w-full py-7 bg-white text-slate-950 rounded-full text-[11px] font-black uppercase tracking-[1em] hover:bg-cyan-600 hover:text-white transition-all shadow-2xl active:scale-95"
                    >
                        {planetary.isTerraforming ? 'TERRAFORMING...' : 'EXPAND MESH'}
                    </button>
                </div>
            </div>

            <div className="p-12 rounded-[5.5rem] bg-white border border-slate-100 shadow-xl flex items-center gap-12 group relative overflow-hidden transition-all hover:bg-slate-50">
                <div className="h-16 w-16 rounded-full border border-cyan-500/20 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all transform group-hover:rotate-180 duration-1000 shadow-2xl">
                    <span className="text-4xl font-black italic serif">🪐</span>
                </div>
                <div>
                    <h4 className="text-[12px] uppercase font-black text-cyan-600 tracking-[0.4em] mb-2 leading-none">Planetary Anchor</h4>
                    <p className="text-xs text-slate-400 leading-relaxed italic truncate font-black">Planetary resonance is absolute across all shards.</p>
                </div>
            </div>
            
            <div className="text-[11px] uppercase tracking-[1.2em] text-slate-300 font-black px-12 text-center uppercase italic">Mesh Status: PERSISTENT</div>
        </div>
      </div>
      
      <div className="mt-24 text-[11px] uppercase tracking-[1.4em] font-black text-slate-300 flex items-center gap-24">
          <div className="h-px w-64 bg-slate-200" />
          Planetary Heritage: ABSOLUTE
          <div className="h-px w-64 bg-slate-200" />
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
