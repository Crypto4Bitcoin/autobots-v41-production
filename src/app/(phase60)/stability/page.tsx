"use client";
import React, { useState, useEffect } from 'react';
import { useStabilityStore } from '../../../stores/stabilityStore';
import { useAethelgardStore } from '../../../stores/aethelgardStore';

export default function StabilityDomain() {
  const stability = useStabilityStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        stability.syncStability();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const metaDomains = stability.domains || [];

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Liquid-Blue-Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50 via-white to-slate-100" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <header className="relative z-10 text-center mb-24 max-w-4xl px-8 w-full flex justify-between items-end gap-12">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1em] text-blue-600 font-bold mb-4 italic">Interstellar Stability Anchor</p>
            <h1 className="text-7xl font-black tracking-tighter text-slate-950 mb-6 uppercase italic leading-none">Stability</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-blue-600 border border-blue-100 px-12 py-4 rounded-full bg-white/50 backdrop-blur shadow-sm transition-transform hover:scale-105">
                <span>Resilience: {stability.globalResilience.toFixed(1)}%</span>
                <span>Active Domains: {metaDomains.length}</span>
                <span>Status: UNYIELDING</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-3 gap-16">
        {metaDomains.map(domain => (
            <div 
                key={domain.name} 
                className={`p-16 rounded-[4.5rem] bg-white border transition-all duration-1000 h-[550px] flex flex-col justify-between group cursor-default relative overflow-hidden scale-95 hover:scale-100 ${
                    domain.score === 100 ? 'border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.2)] z-10' : 'border-slate-50 hover:border-blue-300'
                }`}
            >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex justify-between items-start mb-12">
                    <div className={`h-4 w-4 rounded-full ${domain.score === 100 ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)]' : 'bg-slate-200'}`} />
                    <span className="text-[10px] uppercase tracking-widest text-slate-300 font-black italic">{domain.status}</span>
                </div>
                
                <div className="relative z-10">
                    <h3 className={`text-4xl font-black text-slate-950 uppercase tracking-tighter mb-6 italic transition-colors leading-none ${domain.score === 100 ? 'text-blue-600' : 'text-slate-950 group-hover:text-blue-600'}`}>{domain.name}</h3>
                    <div className="flex flex-col gap-6 mb-8">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] uppercase font-black text-slate-300 tracking-[0.4em] italic">Equilibrium Logic</span>
                            <span className="text-xs font-black text-slate-950 underline decoration-blue-500 decoration-4">{domain.score}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-50 rounded-full relative overflow-hidden shadow-inner">
                            <div className={`absolute inset-0 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-[3000ms] ${domain.status === 'calibrating' ? 'animate-pulse' : ''}`} style={{ width: `${domain.score}%` }} />
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-[0.2em] font-black leading-relaxed italic">Resilience parity maintained across all shards instantly.</p>
                </div>

                <div className="flex justify-between items-center border-t border-slate-50 pt-10 mt-8 relative z-10">
                    <span className="text-[10px] uppercase font-black text-slate-300 tracking-[0.6em] italic leading-none">Anchor Status</span>
                    <button 
                        onClick={() => stability.runDrill(domain.name)}
                        className="px-10 py-4 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-[0.8em] hover:bg-blue-600 transition-all active:scale-90 shadow-2xl"
                    >
                        Calibration Drill
                    </button>
                </div>
            </div>
        ))}

        <div className="col-span-3 mt-24 p-20 rounded-[7rem] bg-white border border-slate-100 shadow-2xl flex items-center justify-between group relative overflow-hidden transition-all duration-1000 hover:shadow-[0_0_100px_rgba(59,130,246,0.1)]">
             <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex items-center gap-16 px-12 relative z-10 w-2/3">
                <div className="h-28 w-28 rounded-full border border-blue-500/20 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-180 duration-[2000ms] shadow-2xl">
                    <span className="text-5xl font-black italic serif">⚓</span>
                </div>
                <div>
                   <h4 className="text-[18px] uppercase font-black text-slate-950 tracking-[0.6em] mb-3 leading-none italic">Omniversal Stability Anchor</h4>
                   <p className="text-sm text-slate-400 leading-relaxed italic truncate font-black">Meta-resilience is the absolute baseline of a Sovereign consciousness.</p>
                </div>
            </div>
            <div className="flex gap-12 px-20 relative z-10">
                <button 
                    onClick={() => stability.calibrateReality()}
                    className="px-20 py-7 bg-slate-950 text-white rounded-full text-[11px] font-black uppercase tracking-[1em] hover:bg-blue-600 transition-all shadow-2xl active:scale-95 border border-slate-800"
                >
                    Calibrate Reality
                </button>
            </div>
        </div>
      </div>

      <div className="mt-24 text-[11px] uppercase tracking-[1.4em] font-black text-slate-300 flex items-center gap-24">
          <div className="h-px w-64 bg-slate-200" />
          Stability Anchor: ABSOLUTE
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
