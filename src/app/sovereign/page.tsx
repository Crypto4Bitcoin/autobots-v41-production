"use client";
import React, { useState, useEffect } from 'react';
import { useSovereignStore } from '../../stores/sovereignStore';
import { useWorldKernelStore } from '../../stores/worldKernelStore';
import { useMetaOversightStore } from '../../stores/metaOversightStore';

export default function SovereignDashboard() {
  const sovereign = useSovereignStore();
  const kernel = useWorldKernelStore();
  const oversight = useMetaOversightStore();
  
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        sovereign.syncSovereignty();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const authorities = sovereign.authorities || [];

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Liquid-Emerald-Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-950/30 via-black to-slate-950" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <header className="relative z-10 text-center mb-20 max-w-5xl px-8 w-full flex justify-between items-end gap-16">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1em] text-emerald-500 font-bold mb-4 italic">Interstellar Galactic Sovereignty</p>
            <h1 className="text-7xl font-black tracking-tighter text-white mb-6 uppercase italic leading-none">Sovereign</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-emerald-400 border border-white/5 px-12 py-4 rounded-full bg-white/5 shadow-2xl backdrop-blur-3xl transition-transform hover:scale-105">
                <span>Unified Stability: {sovereign.unifiedStability.toFixed(1)}%</span>
                <span>Name: {sovereign.sovereignName}</span>
                <span>Status: ETERNAL</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-8 space-y-12">
            <div className="p-20 rounded-[6rem] bg-white/5 border border-white/5 shadow-2xl flex flex-col justify-between group h-[600px] relative overflow-hidden transition-all duration-1000">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <h3 className="text-[11px] uppercase tracking-[0.5em] text-emerald-400 mb-10 font-bold italic">Galactic Core Calibration</h3>
                
                <div className="flex flex-col items-center justify-center h-full">
                    <div 
                        className="w-96 h-96 rounded-full border border-emerald-500/10 flex items-center justify-center transition-transform duration-[4000ms] ease-in-out"
                        style={{ transform: `scale(${pulse})` }}
                    >
                        <div className="w-64 h-64 rounded-full border-4 border-emerald-500/10 shadow-3xl relative transition-all duration-1000">
                            <div className="absolute inset-12 rounded-full bg-emerald-500/5 blur-3xl animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center transform scale-150">
                                <div className="h-4 w-4 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-12">
                {authorities.map(auth => (
                    <div 
                        key={auth.id} 
                        className={`p-12 rounded-[5.5rem] border transition-all duration-1000 h-[380px] flex flex-col justify-between group cursor-default relative overflow-hidden scale-95 hover:scale-100 ${
                            auth.status === 'ascended' ? 'bg-emerald-600/10 border-emerald-500/40 text-white shadow-2xl' : 'bg-white/5 border-white/5 text-white/40'
                        }`}
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-start mb-10">
                            <div className={`h-4 w-4 rounded-full transition-all duration-1000 ${auth.status === 'ascended' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,1)]' : 'bg-white/20'}`} />
                            <span className="text-[10px] uppercase tracking-widest text-white/30 font-black italic">{auth.id}</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-white/20 tracking-[0.4em] mb-4 italic">Authority Member</p>
                            <h4 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 italic transition-colors leading-none group-hover:text-emerald-400">{auth.name}</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[9px] uppercase font-black text-emerald-500/60 tracking-[0.3em] italic">Legacy Level</span>
                                    <span className="text-xs font-black text-white underline decoration-emerald-500 decoration-4">{auth.legacy_level}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full relative overflow-hidden shadow-inner">
                                    <div className="absolute inset-0 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-[3000ms]" style={{ width: `${auth.legacy_level}%` }} />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-8 mt-6 relative z-10">
                            <span className="text-[10px] uppercase font-black text-white/40 tracking-[0.6em] italic leading-none">Authority Rank</span>
                            {auth.status === 'active' && (
                                <button 
                                    onClick={() => sovereign.promoteAuthority(auth.id)}
                                    className="px-10 py-4 bg-white text-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.8em] hover:bg-emerald-600 hover:text-white transition-all active:scale-90 shadow-2xl italic"
                                >
                                    Ascend
                                </button>
                            )}
                            {auth.status === 'ascended' && (
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.6em] italic bg-emerald-500/10 px-6 py-2 rounded-full border border-emerald-500/20">ASCENDED</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="col-span-4 space-y-12 flex flex-col h-full grow">
            <div className="p-16 rounded-[7rem] bg-emerald-950/20 border border-emerald-500/20 shadow-2xl flex-1 flex flex-col justify-between overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-1000">
                    <span className="text-[200px] font-black italic serif leading-none">S</span>
                </div>
                <div className="relative z-10">
                   <h3 className="text-[11px] uppercase font-black tracking-[0.6em] text-emerald-400 mb-16 underline decoration-emerald-500/30 decoration-4 underline-offset-8">Sovereign Analysis Hub</h3>
                   <div className="space-y-12">
                       {[
                           { label: "Core Resilience", val: "100.0%", color: "text-emerald-400" },
                           { label: "Oversight Score", val: oversight.governanceScore.toFixed(1) + "%", color: "text-white" },
                           { label: "Consensus Status", val: "ABSOLUTE", color: "text-emerald-400" },
                           { label: "Authority Type", val: 'ETERNAL', color: "text-white" }
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
                        onClick={() => sovereign.calibrateCore()}
                        className="w-full py-8 bg-white text-slate-900 rounded-full text-[11px] font-black uppercase tracking-[1em] hover:bg-emerald-600 hover:text-white transition-all shadow-2xl active:scale-95 italic"
                    >
                        Calibrate Core
                    </button>
                </div>
            </div>

            <div className="p-12 rounded-[6rem] bg-white/5 border border-white/5 shadow-2xl flex items-center gap-12 group relative overflow-hidden transition-all hover:bg-white/10">
                <div className="h-24 w-24 rounded-full border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-12 duration-1000 shadow-2xl">
                    <span className="text-4xl font-black italic serif">👑</span>
                </div>
                <div>
                    <h4 className="text-[14px] uppercase font-black text-emerald-400 tracking-[0.6em] mb-2 leading-none italic">Sovereign Anchor</h4>
                    <p className="text-xs text-white/30 leading-relaxed italic truncate font-black">Unified stability is the baseline of the Sovereign consciousness.</p>
                </div>
            </div>
            
            <div className="text-[11px] uppercase tracking-[1.4em] text-white/20 font-black px-12 text-center italic">Core Status: PERSISTENT</div>
        </div>
      </div>

      <div className="mt-24 text-[11px] uppercase tracking-[1.8em] font-black text-white/10 flex items-center gap-24">
          <div className="h-px w-64 bg-white/5" />
          Sovereign Heritage: ABSOLUTE
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
