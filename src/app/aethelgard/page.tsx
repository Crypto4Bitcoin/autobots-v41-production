"use client";
import React, { useState, useEffect } from 'react';
import { useAethelgardStore } from '../../stores/aethelgardStore';
import { useWorldStore } from '../../stores/worldStore';
import { useWorldKernelStore } from '../../stores/worldKernelStore';

export default function AethelgardDomain() {
  const aethelgard = useAethelgardStore();
  const world = useWorldStore();
  const kernel = useWorldKernelStore();
  
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
        if (aethelgard.isUnityManifested) {
            aethelgard.expandConsciousness();
            setPulse(prev => prev === 1 ? 1.05 : 1);
        }
    }, 4000);
    return () => clearInterval(interval);
  }, [aethelgard.isUnityManifested]);

  const activeWorkspaces = world.activeWorkspaces || [];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans relative overflow-hidden flex flex-col items-center justify-center p-12">
      {/* Crystalline Background Elements */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-50 via-white to-amber-50" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
      
      <div 
        className="relative z-10 max-w-6xl w-full transition-transform duration-[4000ms] ease-in-out"
        style={{ transform: `scale(${pulse})` }}
      >
        <header className="text-center mb-16 space-y-4">
          <div className="flex justify-center items-center gap-4 mb-4">
            <span className="h-px w-16 bg-amber-300/50" />
            <p className="text-[10px] uppercase tracking-[0.6em] text-amber-600 font-bold">The Eternal Realm</p>
            <span className="h-px w-16 bg-amber-300/50" />
          </div>
          <h1 className="text-7xl font-bold tracking-tighter text-slate-950 mb-2">AETHELGARD</h1>
          <p className="text-sm text-slate-500 uppercase tracking-[0.2em]">Universal Unity: {aethelgard.unityScore}%</p>
        </header>

        <div className="grid grid-cols-3 gap-12">
            <div className="space-y-12">
                <div className="p-10 rounded-[3rem] bg-white border border-amber-100 shadow-[0_20px_60px_-15px_rgba(180,83,9,0.1)] relative group">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] text-amber-600 mb-8 font-bold">Dimensional Nodes</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {activeWorkspaces.slice(0, 16).map(ws => (
                            <div key={ws.id} className="h-2 w-2 rounded-full bg-amber-400/30 group-hover:bg-amber-400 transition-colors" />
                        ))}
                    </div>
                </div>

                <div className="p-10 rounded-[3rem] bg-indigo-50/50 border border-indigo-100 shadow-sm">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] text-indigo-600 mb-8 font-bold">Unified Metrics</h3>
                    <div className="space-y-6">
                        {kernel.coreMetrics.map(m => (
                            <div key={m.id} className="flex justify-between items-end border-b border-indigo-200/30 pb-2">
                                <span className="text-[10px] uppercase text-indigo-400 tracking-wider">{m.label}</span>
                                <span className="text-xl font-mono text-indigo-900 font-bold">{Math.round(m.value)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <div className="relative w-80 h-80 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-amber-200 animate-spin-slow opacity-30" />
                    <div className="absolute inset-4 rounded-full border border-amber-300/50 animate-reverse-spin opacity-50" />
                    <div className="w-16 h-16 bg-amber-400 rounded-full shadow-[0_0_50px_rgba(251,191,36,0.8)] animate-pulse" />
                </div>
                {!aethelgard.isUnityManifested ? (
                    <button 
                        onClick={() => aethelgard.manifestUnity()}
                        className="mt-12 px-10 py-4 bg-slate-950 text-white rounded-full text-xs font-bold uppercase tracking-[0.4em] hover:bg-amber-600 transition-all shadow-xl active:scale-95"
                    >
                        Manifest Unity
                    </button>
                ) : (
                    <div className="mt-12 text-center">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-bold mb-2">SYNCHRONIZED</p>
                        <p className="text-xs text-slate-400 italic font-serif">"All paths lead to the same origin."</p>
                    </div>
                )}
            </div>

            <div className="space-y-12">
                <div className={`p-10 rounded-[3rem] bg-white border border-amber-100 shadow-xl transition-opacity duration-1000 ${aethelgard.isUnityManifested ? 'opacity-100' : 'opacity-30'}`}>
                    <h3 className="text-[10px] uppercase tracking-[0.4em] text-amber-600 mb-8 font-bold">Perpetual Events</h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                        {aethelgard.perpetualEvents.length === 0 ? (
                            <p className="text-[10px] text-slate-400 italic">Waiting for consciousness expansion...</p>
                        ) : aethelgard.perpetualEvents.map((evt, i) => (
                            <div key={i} className="text-[11px] leading-relaxed text-slate-600 border-l-2 border-amber-200 pl-4 py-1">
                                {evt}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <style jsx global>{`
        .animate-spin-slow { animation: spin 20s linear infinite; }
        .animate-reverse-spin { animation: spin-reverse 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fbbf24; border-radius: 10px; }
      `}</style>
    </div>
  );
}
