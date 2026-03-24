"use client";
import React, { useState, useEffect } from 'react';
import { useWorkforceStore } from '../../../stores/workforceStore';
import { useWorldKernelStore } from '../../../stores/worldKernelStore';

export default function WorkforceDomain() {
  const workforce = useWorkforceStore();
  const kernel = useWorldKernelStore();
  
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        workforce.pulseExecution();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const metaList = workforce.units || [];

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Liquid-Emerald-Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-50 via-white to-slate-100" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <header className="relative z-10 text-center mb-24 max-w-5xl px-8 w-full flex justify-between items-end gap-16">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1em] text-emerald-600 font-bold mb-4 italic leading-none">Interstellar Meta-Workforce</p>
            <h1 className="text-8xl font-black tracking-tighter text-slate-950 mb-6 uppercase italic leading-none">Workforce</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-emerald-600 border border-emerald-100 px-12 py-5 rounded-full bg-white/50 backdrop-blur shadow-2xl transition-transform hover:scale-105 italic font-black">
                <span>Brain Power: {workforce.collectiveBrainPower}%</span>
                <span>Total Executions: {(workforce.totalExecutions / 1000000).toFixed(2)}M</span>
                <span>Status: {kernel.unifiedStability > 99 ? 'TRANSCENDED' : 'SYNCING'}</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-8 space-y-12 h-full flex flex-col">
            <div className="p-20 rounded-[7rem] bg-indigo-950 border border-slate-800 shadow-3xl text-white relative overflow-hidden flex flex-col justify-between group transition-all duration-1000 flex-1 min-h-[600px] hover:shadow-emerald-500/10 hover:shadow-inner">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <h3 className="text-[11px] uppercase tracking-[0.6em] text-white/40 mb-10 font-bold italic underline decoration-emerald-500/30 decoration-4 underline-offset-8">Execution Core Pulse</h3>
                
                <div className="flex flex-col items-center justify-center h-full">
                    <div 
                        className="w-[450px] h-[450px] rounded-full border border-emerald-500/10 flex items-center justify-center transition-transform duration-[2000ms] ease-in-out"
                        style={{ transform: `scale(${pulse})` }}
                    >
                        <div className="w-[300px] h-[300px] rounded-full border-4 border-emerald-500/20 shadow-3xl relative transition-all duration-1000">
                            <div className="absolute inset-16 rounded-full bg-emerald-500/10 blur-[80px] animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center transform scale-150">
                                <div className="h-4 w-4 bg-emerald-500 rounded-full shadow-[0_0_40px_rgba(16,185,129,1)]" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-12 bg-white/5 p-6 rounded-[3rem] border border-white/5">
                    <p className="text-[12px] uppercase tracking-[0.8em] font-black text-emerald-400 mb-2 italic">Omniverse Execution Frequency</p>
                    <p className="text-4xl font-black tracking-tighter text-white uppercase italic">{workforce.collectiveBrainPower >= 1000 ? 'Infinite Convergence' : 'Neural Alignment Cycle'}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-12 mt-12">
                {metaList.map(unit => (
                    <div 
                        key={unit.id} 
                        className="p-10 rounded-[4.5rem] bg-white border border-slate-50 transition-all duration-1000 h-[280px] flex flex-col justify-between cursor-default group active:scale-95 shadow-sm hover:border-emerald-300 hover:shadow-2xl hover:scale-105"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`h-4 w-4 rounded-full transition-all duration-1000 ${unit.status === 'active' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]' : 'bg-slate-200 shadow-inner'}`} />
                            <span className="text-[10px] uppercase tracking-widest text-slate-300 font-black italic">{unit.id}</span>
                        </div>
                        <div>
                             <p className="text-[9px] uppercase font-black text-slate-300 tracking-[0.4em] mb-2 italic leading-none">Workforce Unit</p>
                             <h4 className="text-3xl font-black tracking-tighter text-slate-950 uppercase italic leading-none transition-colors group-hover:text-emerald-600">{unit.role}</h4>
                        </div>
                        <div className="flex justify-between items-end border-t border-slate-50 pt-6 mt-4 group-hover:border-emerald-100 transition-all">
                            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest italic">{unit.status}</span>
                            <span className="text-xl font-black text-emerald-600 italic">%{Math.round(unit.efficiency)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="col-span-4 space-y-12 flex flex-col h-full grow">
            <div className="p-16 rounded-[7rem] bg-indigo-950 border border-slate-800 shadow-3xl text-white flex-1 flex flex-col justify-between overflow-hidden relative group h-full">
                <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity transform group-hover:rotate-45 duration-1000">
                    <span className="text-[250px] font-black italic serif leading-none">W</span>
                </div>
                <div className="relative z-10 h-full flex flex-col">
                   <h3 className="text-[11px] uppercase font-black tracking-[0.8em] text-emerald-400 mb-12 italic underline decoration-emerald-500/30 decoration-4 underline-offset-8">Collective Intelligence</h3>
                   <div className="space-y-16 grow flex flex-col">
                       {[
                           { label: "Neural Latency", val: "0.02ms", color: "text-emerald-400" },
                           { label: "Execution Parity", val: "ABSOLUTE", color: "text-white" },
                           { label: "Brain Power Index", val: workforce.collectiveBrainPower + "%", color: "text-emerald-400" },
                           { label: "Singularity Status", val: workforce.collectiveBrainPower >= 1000 ? 'ENABLED' : 'SYNCING', color: "text-white" }
                       ].map(stat => (
                           <div key={stat.label} className="border-l-2 border-white/10 pl-10 py-3 hover:border-emerald-500/50 transition-all duration-1000">
                               <div className="text-[11px] uppercase text-white/30 mb-3 tracking-[0.5em] font-black italic">{stat.label}</div>
                               <div className={`text-6xl font-black tracking-tighter ${stat.color} leading-none italic`}>{stat.val}</div>
                           </div>
                       ))}
                   </div>
                </div>
                <div className="pt-20 border-t border-white/5">
                    <button 
                        onClick={() => workforce.optimizeEfficiency()}
                        className="w-full py-8 bg-white text-slate-900 rounded-full text-[12px] font-black uppercase tracking-[1em] hover:bg-emerald-600 hover:text-white transition-all shadow-3xl active:scale-95 italic border-2 border-slate-200"
                    >
                        Optimize Collective
                    </button>
                </div>
            </div>

            <div className="p-12 rounded-[6rem] bg-white/5 border border-slate-100 shadow-2xl flex items-center gap-12 group relative overflow-hidden transition-all hover:bg-slate-100 cursor-default">
                <div className="h-20 w-20 rounded-full border-4 border-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-[360deg] duration-[2000ms] shadow-3xl">
                    <span className="text-4xl font-black italic serif">🧠</span>
                </div>
                <div>
                    <h4 className="text-[14px] uppercase font-black text-emerald-600 tracking-[0.6em] mb-2 leading-none italic">Execution Anchor</h4>
                    <p className="text-xs text-slate-400 leading-relaxed italic truncate font-black">Autonomous civilizations thrive on total neural alignment.</p>
                </div>
            </div>
            
            <div className="text-[11px] uppercase tracking-[1.4em] font-black text-slate-300 px-12 text-center italic leading-none">Sync: PERSISTENT</div>
        </div>
      </div>
      
      <div className="mt-32 text-[12px] uppercase tracking-[1.8em] font-black text-slate-300 flex items-center gap-24">
          <div className="h-px w-64 bg-slate-200 shadow-sm" />
          Workforce status: ABSOLUTE
          <div className="h-px w-64 bg-slate-200 shadow-sm" />
      </div>

      <style jsx global>{`
        @keyframes fade {
            from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}</style>
    </div>
  );
}
