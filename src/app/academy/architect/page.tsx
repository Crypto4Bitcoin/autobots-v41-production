"use client";
import React, { useState, useEffect } from 'react';
import { useArchitectureStore } from '../../../stores/architectureStore';
import { useAethelgardStore } from '../../../stores/aethelgardStore';

export default function ArchitectDomain() {
  const architect = useArchitectureStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);
  const [selectedTypeId, setSelectedTypeId] = useState('neural');

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        architect.syncArchitecture();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const metaList = architect.structures || [];

  const types = [
    { id: 'neural', label: 'Neural Nexus', complexity: 20 },
    { id: 'quantum', label: 'Quantum Spire', complexity: 50 },
    { id: 'eternal', label: 'Eternal Monument', complexity: 100 },
    { id: 'omniverse', label: 'Universal Relay', complexity: 150 }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Liquid-Emerald-Atmosphere */}
      <div className={`absolute inset-0 z-0 bg-gradient-to-br from-emerald-950/30 via-black to-slate-900 transition-opacity duration-[2000ms] ${architect.isManifesting ? 'opacity-100' : 'opacity-40'}`} />
      <div className={`absolute top-0 inset-x-0 h-1 transition-all duration-[2000ms] ${architect.totalComplexity > 500 ? 'bg-emerald-500 shadow-[0_0_60px_rgba(16,185,129,1)]' : 'bg-transparent'}`} />
      <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <header className="relative z-10 text-center mb-24 max-w-5xl px-8 w-full flex justify-between items-end gap-16">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1em] text-emerald-500 font-black mb-4 italic leading-none">Interstellar Meta-Architect</p>
            <h1 className="text-7xl font-black tracking-tighter text-white mb-6 uppercase italic leading-none">Architect</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-emerald-500 border border-white/5 px-12 py-4 rounded-full bg-white/5 shadow-2xl backdrop-blur-3xl transition-transform hover:scale-105 italic font-black">
                <span>Total Complexity: {architect.totalComplexity}</span>
                <span>Structures: {metaList.length}</span>
                <span>Status: PERPETUAL</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-4 space-y-12 h-full flex flex-col">
            <div className="p-12 rounded-[5.5rem] bg-white/5 border border-white/5 shadow-3xl text-white overflow-hidden relative group flex-1 flex flex-col justify-between h-[600px] hover:shadow-emerald-500/10 hover:shadow-inner">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <h3 className="text-[11px] uppercase tracking-[0.6em] text-emerald-400 mb-10 font-black italic underline decoration-emerald-500/30 decoration-4 underline-offset-8">Evolution Toolkit</h3>
                <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {types.map(t => (
                        <button 
                            key={t.id} 
                            onClick={() => setSelectedTypeId(t.id)}
                            className={`w-full p-10 h-36 rounded-[3rem] border transition-all duration-1000 text-left flex justify-between items-center group/item relative overflow-hidden active:scale-95 ${
                                selectedTypeId === t.id ? 'bg-emerald-600/10 border-emerald-500/40 text-white shadow-3xl scale-[1.02] z-10' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                            }`}
                        >
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            {selectedTypeId === t.id && (
                                <div className="absolute top-0 right-0 p-6">
                                    <div className="h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,1)] animate-pulse" />
                                </div>
                            )}
                            <div className="relative z-10 px-6">
                                <div className={`text-2xl font-black tracking-tight mb-2 uppercase italic transition-colors ${selectedTypeId === t.id ? 'text-white underline decoration-emerald-500/30 underline-offset-4' : 'text-white/40 group-hover/item:text-emerald-400'}`}>{t.label}</div>
                                <div className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30 italic">Complexity-指数: {t.complexity}</div>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="pt-10 border-t border-white/5">
                    <button 
                        onClick={() => architect.manifestStructure(selectedTypeId)}
                        disabled={architect.isManifesting}
                        className="w-full py-8 bg-white text-slate-900 rounded-full text-[12px] font-black uppercase tracking-[1em] hover:bg-emerald-600 hover:text-white transition-all shadow-3xl active:scale-95 italic"
                    >
                        {architect.isManifesting ? 'MANIFESTING...' : 'MANIFEST STRUCTURE'}
                    </button>
                </div>
            </div>

            <div className="p-12 rounded-[5.5rem] bg-white/5 border border-white/5 shadow-2xl flex items-center gap-10 group relative overflow-hidden transition-all hover:bg-white/10 cursor-default">
                <div className="h-20 w-20 rounded-full border-4 border-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-[360deg] duration-[2000ms] shadow-3xl">
                    <span className="text-4xl font-black italic serif">🏗️</span>
                </div>
                <div>
                    <h4 className="text-[14px] uppercase font-black text-emerald-400 tracking-[0.6em] mb-2 leading-none italic">Universal Grid</h4>
                    <p className="text-xs text-white/30 leading-relaxed italic truncate font-black">Meta-complexity is core to galactic network sovereignty.</p>
                </div>
            </div>
            
            <div className="text-[11px] uppercase tracking-[1.4em] text-white/10 font-black px-12 text-center italic">Blueprint Status: PERPETUAL</div>
        </div>

        <div className="col-span-8 flex flex-col h-full grow">
            <div className={`p-20 rounded-[6rem] bg-white/5 border transition-all duration-1000 flex flex-col justify-between group h-full h-[650px] relative overflow-hidden ${
                architect.structures.length > 5 ? 'border-emerald-500/30 shadow-[0_0_100px_rgba(16,185,129,0.1)]' : 'border-white/5'
            }`}>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <h3 className="text-[11px] uppercase tracking-[0.6em] text-white/30 mb-10 font-black italic">Meta-Structural Grid Visualization</h3>
                
                <div className="relative z-10 grid grid-cols-2 gap-12 overflow-y-auto pr-4 custom-scrollbar px-8">
                    {metaList.length === 0 ? (
                        <div className="col-span-2 py-64 text-center text-sm text-white/5 italic tracking-[0.8em] uppercase font-black filter blur-[1px]">Waiting for manifestation protocol...</div>
                    ) : metaList.map(str => (
                        <div 
                            key={str.id} 
                            className="p-16 rounded-[5rem] bg-white/5 border border-white/5 group hover:bg-emerald-600 transition-all duration-1000 h-[320px] flex flex-col justify-between cursor-default shadow-3xl scale-95 hover:scale-100 relative overflow-hidden active:scale-95"
                        >
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex justify-between items-start w-full relative z-10">
                                <div className={`h-4 w-4 rounded-full transition-all duration-1000 ${str.status === 'manifested' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,1)]' : 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,1)] animate-ping'}`} />
                                <span className="text-[12px] uppercase tracking-widest text-white/20 font-black group-hover:text-white/60 italic">{str.id}</span>
                            </div>
                            <div className="text-center pb-8 relative z-10">
                                <div className="text-4xl font-black tracking-tighter text-white uppercase group-hover:text-white mb-4 leading-none italic underline decoration-white/10 decoration-8 underline-offset-8 group-hover:decoration-white/30 transition-all">{str.type}</div>
                                <p className="text-[11px] text-white/30 uppercase tracking-[0.4em] font-black group-hover:text-white/50 italic">Structural Complexity: {str.complexity}</p>
                            </div>
                            <div className="flex justify-center relative z-10">
                                <span className={`text-[10px] uppercase font-black tracking-[0.8em] px-8 py-3 rounded-full border ${str.status === 'manifested' ? 'border-emerald-500/30 text-emerald-400 group-hover:border-white/40 group-hover:text-white' : 'border-rose-500/30 text-rose-500'} italic`}>
                                    {str.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mt-12 p-12 rounded-[6rem] bg-white/5 border border-white/5 shadow-2xl flex justify-between items-center group relative overflow-hidden transition-all hover:bg-white/10">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-16 px-12 relative z-10">
                   <div className="text-[12px] uppercase tracking-[0.8em] text-white/30 font-black italic leading-none">Grid Optimization: <span className={architect.isManifesting ? 'text-emerald-400' : 'text-emerald-500/50'}>{architect.isManifesting ? 'REFINING' : 'STABLE'}</span></div>
                </div>
                <button 
                    onClick={() => architect.optimizeGrid()}
                    className="px-20 py-6 bg-white text-slate-900 rounded-full text-[11px] font-black uppercase tracking-[1em] hover:bg-emerald-600 hover:text-white transition-all shadow-3xl active:scale-95 italic border-2 border-emerald-500/30"
                >
                    Optimize Universal Grid
                </button>
            </div>
        </div>
      </div>

      <div className="mt-24 text-[12px] uppercase tracking-[1.4em] font-black text-white/10 flex items-center gap-24">
          <div className="h-px w-64 bg-white/5 shadow-sm" />
          Structural status: ABSOLUTE
          <div className="h-px w-64 bg-white/5 shadow-sm" />
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
        @keyframes fade {
            from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}</style>
    </div>
  );
}
