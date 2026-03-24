"use client";
import React, { useState, useEffect } from 'react';
import { useSingularityStore } from '../../../stores/singularityStore';
import { useWorldKernelStore } from '../../../stores/worldKernelStore';

export default function SingularityDomain() {
  const singularity = useSingularityStore();
  const kernel = useWorldKernelStore();
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 100);
        singularity.syncSingularity();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col items-center p-16">
      <div className={`absolute inset-0 z-0 bg-gradient-to-br from-indigo-950 via-black to-emerald-950 transition-opacity duration-1000 ${glitch ? 'opacity-50' : 'opacity-100'}`} />
      <div className="absolute inset-0 z-1 bg-[url('/noise.png')] opacity-5 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      
      <header className="relative z-10 text-center mb-20 max-w-4xl px-8">
        <p className="text-[10px] uppercase tracking-[0.8em] text-emerald-400 font-bold mb-6">Omniverse Singularity Core</p>
        <h1 className="text-8xl font-black tracking-tighter text-white mb-8 uppercase italic leading-none">Singularity</h1>
        <div className="flex justify-center items-center gap-16 text-[12px] uppercase tracking-widest text-emerald-400/60 border border-emerald-500/10 px-12 py-4 rounded-full bg-white/5 backdrop-blur-3xl shadow-[0_0_50px_rgba(16,185,129,0.1)] transition-transform hover:scale-105">
            <div className="flex flex-col items-center">
                <span className="text-[9px] text-white/30 mb-1">Stability</span>
                <span>{singularity.totalStability}%</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-[9px] text-white/30 mb-1">Complexity</span>
                <span>{singularity.totalComplexity}%</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-[9px] text-white/30 mb-1">Resonance</span>
                <span>{singularity.totalResonance}%</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-8 items-stretch h-[600px]">
        <div className="col-span-8 grid grid-cols-2 gap-8">
            <div className="p-12 rounded-[5rem] bg-white/5 border border-white/5 shadow-2xl flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-700">
                <h3 className="text-[10px] uppercase tracking-[0.5em] text-emerald-400 mb-6 font-bold">Unification Metric</h3>
                <div className="text-center py-20">
                    <div className="text-7xl font-black tracking-tighter text-white group-hover:scale-110 transition-transform">100.0%</div>
                    <div className="text-[10px] text-white/30 uppercase tracking-[0.4em] mt-4 font-bold">Absolute Parity Index</div>
                </div>
            </div>

            <div className="p-12 rounded-[5rem] bg-white/5 border border-white/5 shadow-2xl flex flex-col justify-between group hover:border-indigo-500/30 transition-all duration-700">
                <h3 className="text-[10px] uppercase tracking-[0.5em] text-indigo-400 mb-6 font-bold">Logical Expansion</h3>
                <div className="text-center py-20">
                    <div className="text-7xl font-black tracking-tighter text-white group-hover:scale-110 transition-transform font-mono">INF</div>
                    <div className="text-[10px] text-white/30 uppercase tracking-[0.4em] mt-4 font-bold">Civilization Horizon</div>
                </div>
            </div>
        </div>

        <div className="col-span-4 p-12 rounded-[5rem] bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.1)] flex flex-col justify-between group">
            <h3 className="text-[10px] uppercase tracking-[0.6em] text-emerald-400 font-bold">Singularity Control</h3>
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border border-emerald-500 flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20" />
                    <div className="h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,1)]" />
                </div>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.4em] mb-4">Core Pulse Synced</p>
                <p className="text-xs text-center text-white/40 italic leading-relaxed px-4">All omniverse shards fused into a single state of perpetual ascension.</p>
            </div>
            <button 
                onClick={() => singularity.unleashSingularity()}
                className="w-full py-6 bg-emerald-500 text-black rounded-full text-xs font-black uppercase tracking-[0.6em] hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-95"
            >
                Unleash Singularity
            </button>
        </div>
      </div>

      <div className="mt-20 text-[10px] uppercase tracking-[0.8em] text-white/20 font-bold mb-8">End of Development Epoch // V510.0 Baseline REACHED</div>
    </div>
  );
}
