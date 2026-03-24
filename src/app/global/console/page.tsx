"use client";
import React, { useState, useEffect } from 'react';
import { useConsoleStore } from '../../../stores/consoleStore';
import { useAethelgardStore } from '../../../stores/aethelgardStore';

export default function ConsoleDomain() {
  const console = useConsoleStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);
  const [activeRuntimeId, setActiveRuntimeId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        console.syncConsole();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Crystalline Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-cyan-950/20 via-black to-slate-950" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      <header className="relative z-10 text-center mb-24 max-w-4xl px-8 w-full flex justify-between items-end">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[0.8em] text-cyan-400 font-bold mb-4">Interstellar Global Command</p>
            <h1 className="text-6xl font-black tracking-tighter text-white mb-6 uppercase italic">Console</h1>
        </div>
        <div className="text-right">
            <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest block mb-1">Global Stability</span>
            <span className="text-4xl font-black text-cyan-400">{console.systemStability}%</span>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-8 space-y-12">
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8 font-bold px-4">Regional Runtime Grid</h3>
            <div className="space-y-6">
                {console.runtimes.map(runtime => (
                    <div key={runtime.id} className="p-10 rounded-[3.5rem] bg-white/5 border border-white/5 shadow-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500 flex items-center justify-between">
                         <div className="flex items-center gap-10">
                            <div className={`h-3 w-3 rounded-full animate-pulse ${runtime.health === 'healthy' ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]' : 'bg-rose-500'}`} />
                            <div>
                                <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-1 group-hover:text-cyan-400 transition-colors">{runtime.id}</h4>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">{runtime.region} • {runtime.capabilities} CAPABILITIES</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-12 text-right">
                            <div>
                                <span className="text-[9px] text-white/20 uppercase font-black tracking-widest block mb-1">Load Factor</span>
                                <div className="text-2xl font-black text-white font-mono">{runtime.load}</div>
                            </div>
                            <button 
                                onClick={() => console.inspectRuntime(runtime.id)}
                                className="px-8 py-3 bg-white/5 hover:bg-white text-slate-950 font-bold py-2 px-4 rounded-full transition-all text-[9px] uppercase tracking-widest"
                            >
                                Inspect
                            </button>
                         </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="col-span-4 space-y-8 flex flex-col h-full">
            <div className="p-12 rounded-[5rem] bg-cyan-950/20 border border-cyan-500/20 shadow-2xl text-white flex-1 flex flex-col justify-between overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                    <span className="text-[150px] font-black italic serif">P</span>
                </div>
                <div>
                   <h3 className="text-[10px] uppercase font-bold tracking-[0.4em] text-cyan-400 mb-12">Routing Intelligence</h3>
                   <div className="space-y-10">
                       {[
                           { label: "Floor Latency", val: "12ms", color: "text-cyan-400" },
                           { label: "Failover Rate", val: "STRICT", color: "text-white" },
                           { label: "Active Nodes", val: console.activeNodes + "", color: "text-cyan-400" },
                           { label: "Optimization Status", val: console.isOptimizing ? 'ACTIVE' : 'STEADY', color: "text-white" }
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
                        onClick={() => console.optimizeGrid()}
                        className="w-full py-5 bg-white text-slate-950 rounded-full text-[10px] font-black uppercase tracking-[0.5em] hover:bg-cyan-600 hover:text-white transition-all shadow-xl active:scale-95"
                    >
                        Optimize Universal Grid
                    </button>
                </div>
            </div>

            <div className="p-12 rounded-[4rem] bg-white/5 border border-white/5 shadow-sm flex items-center gap-8 group">
                <div className="h-14 w-14 rounded-full border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all transform group-hover:rotate-12 duration-1000">
                    <span className="text-2xl font-black">📡</span>
                </div>
                <div>
                    <h4 className="text-[10px] uppercase font-bold text-cyan-400 tracking-[0.2em] mb-1">Console Guidance</h4>
                    <p className="text-xs text-white/40 leading-relaxed italic truncate">Global health is absolute across regional shards.</p>
                </div>
            </div>
        </div>
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
