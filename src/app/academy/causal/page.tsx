"use client";
import React, { useState, useEffect } from 'react';
import { useCausalStore } from '../../../stores/causalStore';
import { useAethelgardStore } from '../../../stores/aethelgardStore';

export default function CausalNavigator() {
  const causal = useCausalStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        causal.syncCausal();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const metaGraph = causal.graph || [];

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Liquid-Indigo-Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-950/40 via-black to-violet-950/40" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <header className="relative z-10 text-center mb-24 max-w-4xl px-8 w-full flex justify-between items-end gap-12">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1em] text-indigo-400 font-black mb-4 italic">Interstellar Causal Engineering</p>
            <h1 className="text-7xl font-black tracking-tighter text-white mb-6 uppercase italic leading-none">Causal</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-indigo-400 border border-white/5 px-12 py-4 rounded-full bg-white/5 shadow-2xl backdrop-blur-3xl transition-transform hover:scale-105">
                <span>Signals: {metaGraph.length}</span>
                <span>Resolving: {causal.isSyncing ? 'ACTIVE' : 'STEADY'}</span>
                <span>Status: PERPETUAL</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-4 space-y-12 h-full flex flex-col">
            <div className="p-12 rounded-[5rem] bg-indigo-950/20 border border-indigo-500/20 shadow-2xl flex-1 flex flex-col justify-between overflow-hidden relative group h-[600px]">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <h3 className="text-[11px] uppercase tracking-[0.5em] text-indigo-400 mb-10 font-black italic">Signal Stream</h3>
                <div className="space-y-8 flex-1 overflow-y-auto pr-4 custom-scrollbar">
                    {metaGraph.map(node => (
                        <button 
                            key={node.id} 
                            onClick={() => { setSelectedEventId(node.id); causal.inspectEvent(node.id); }}
                            className={`w-full p-10 rounded-[4rem] border transition-all duration-1000 text-left relative overflow-hidden active:scale-95 flex flex-col justify-between h-[280px] group/item ${
                                selectedEventId === node.id ? 'bg-indigo-600/10 border-indigo-500/40 text-white shadow-2xl scale-[1.02] z-10' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                            }`}
                        >
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            <div className="flex justify-between items-start mb-6">
                                <div className={`h-3 w-3 rounded-full transition-all duration-1000 ${selectedEventId === node.id ? 'bg-indigo-500 shadow-[0_0_15px_rgba(129,140,248,1)]' : 'bg-white/10'}`} />
                                <span className="text-[10px] uppercase font-black text-white/20 tracking-widest italic">{node.id}</span>
                            </div>
                            <div>
                                <h4 className={`text-2xl font-black tracking-tight mb-2 uppercase italic transition-colors ${selectedEventId === node.id ? 'text-white' : 'text-white/60 group-hover/item:text-indigo-400'}`}>{node.event}</h4>
                                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] italic leading-relaxed">{node.source_layer}</p>
                            </div>
                            <div className="flex justify-between items-center border-t border-white/5 pt-6 mt-6 relative z-10">
                                <span className="text-[10px] font-mono opacity-20 italic">{new Date(node.timestamp).toLocaleTimeString()}</span>
                                <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${node.severity === 'critical' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400'}`}>
                                    {node.severity.toUpperCase()}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <button 
                onClick={() => causal.generateCausalChain()}
                disabled={causal.isSyncing}
                className="w-full py-8 bg-white text-black rounded-full text-[11px] font-black uppercase tracking-[1em] hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-95 italic"
            >
                {causal.isSyncing ? 'RECONSTRUCTING...' : 'UPDATE CHAIN'}
            </button>
        </div>

        <div className="col-span-8 flex flex-col h-full grow">
            <div className={`p-20 rounded-[6rem] bg-white/5 border transition-all duration-1000 flex flex-col justify-between group h-full h-[650px] relative overflow-hidden ${
                causal.selectedChain.length > 0 ? 'border-indigo-500/30 shadow-[0_0_100px_rgba(129,140,248,0.1)]' : 'border-white/5'
            }`}>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <h3 className="text-[11px] uppercase tracking-[0.5em] text-white/30 mb-10 font-black italic">Temporal Lineage Reconstruction</h3>
                
                <div className="relative z-10 flex flex-col h-full">
                    {causal.selectedChain.length > 0 ? (
                        <div className="space-y-20 h-full flex flex-col px-16">
                            <div className="space-y-16">
                                {causal.selectedChain.map((node, i) => (
                                    <div key={i} className="flex gap-20 group animate-[fade_1.5s_ease-out_forwards] relative">
                                        <div className="flex flex-col items-center">
                                            <div className="h-4 w-4 rounded-full border-2 border-indigo-500 bg-black group-hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(129,140,248,1)] z-10" />
                                            {i < causal.selectedChain.length - 1 && <div className="h-32 w-px bg-white/10" />}
                                        </div>
                                        <div>
                                           <h4 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 italic leading-none group-hover:text-indigo-400 transition-colors">{node.event}</h4>
                                           <p className="text-[11px] text-white/30 font-black uppercase tracking-[0.4em] leading-relaxed max-w-xl italic">Federated causal trace confirmed across all regional shards.</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {causal.narrative && (
                                <div className="mt-auto p-16 rounded-[5.5rem] bg-indigo-950/20 border border-indigo-500/20 shadow-3xl animate-[fade_2s_ease-out_forwards] relative overflow-hidden group/narr">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover/narr:opacity-100 transition-opacity" />
                                    <h5 className="text-[11px] uppercase font-black text-indigo-400 tracking-[0.8em] mb-8 italic">Omniversal Logic reasoning</h5>
                                    <p className="text-4xl font-light italic text-indigo-100 leading-relaxed font-serif relative z-10">"{causal.narrative}"</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-64 filter blur-[1px] opacity-10">
                             <div className="h-40 w-40 rounded-full border-4 border-white/5 flex items-center justify-center mb-16 transform group-hover:rotate-180 duration-[4000ms]">
                                <span className="text-8xl font-serif italic text-white leading-none">?</span>
                             </div>
                             <p className="text-[12px] uppercase tracking-[1em] text-white font-black italic">Select a signal to begin temporal lineage reconstruction.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mt-12 p-12 rounded-[6rem] bg-white/5 border border-white/1 shadow-2xl flex items-center gap-16 group relative overflow-hidden transition-all hover:bg-white/10">
                <div className="h-20 w-20 rounded-full border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-12 duration-1000 shadow-3xl">
                    <span className="text-4xl font-black italic font-serif">⏳</span>
                </div>
                <div>
                   <h4 className="text-[14px] uppercase font-black tracking-[0.6em] text-indigo-400 mb-2 italic">Temporal Anchor</h4>
                   <p className="text-xs text-white/30 leading-relaxed italic truncate font-black">Causality is absolute across every timeline of the eternal mesh.</p>
                </div>
            </div>
        </div>
      </div>
      
      <div className="mt-24 text-[11px] uppercase tracking-[1.4em] font-black text-white/10 flex items-center gap-24">
          <div className="h-px w-64 bg-white/5" />
          Causal Resonance: ABSOLUTE
          <div className="h-px w-64 bg-white/5" />
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #818cf8; }
        @keyframes fade {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
