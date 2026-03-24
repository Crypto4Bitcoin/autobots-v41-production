"use client";
import React, { useState, useEffect } from 'react';
import { useInsightStore } from '../../../stores/insightStore';
import { useWorldKernelStore } from '../../../stores/worldKernelStore';

export default function InsightsDomain() {
  const insights = useInsightStore();
  const kernel = useWorldKernelStore();
  
  const [pulse, setPulse] = useState(1);
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        insights.syncInsights();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const nodeList = insights.insights || [];

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Liquid-Cyan-Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-50 via-white to-slate-100" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <header className="relative z-10 text-center mb-24 max-w-4xl px-8 w-full flex justify-between items-end gap-12">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1em] text-indigo-600 font-bold mb-4 italic leading-none">Interstellar Behavioral Insights</p>
            <h1 className="text-7xl font-black tracking-tighter text-slate-950 mb-6 uppercase italic leading-none">Insights</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-indigo-600 border border-indigo-100 px-12 py-4 rounded-full bg-white/50 backdrop-blur shadow-sm transition-transform hover:scale-105 italic font-black">
                <span>Learning: {insights.isLearning ? 'ACTIVE' : 'STEADY'}</span>
                <span>Total Insights: {insights.totalInsights}</span>
                <span>Stability: {kernel.unifiedStability.toFixed(1)}%</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-8 space-y-12 h-full flex flex-col">
            <div className="p-20 rounded-[7rem] bg-indigo-950 border border-slate-800 shadow-3xl text-white relative overflow-hidden flex flex-col justify-between group transition-all duration-1000 flex-1 min-h-[600px] hover:shadow-indigo-500/10 hover:shadow-inner">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <h3 className="text-[11px] uppercase tracking-[0.6em] text-white/40 mb-10 font-bold italic underline decoration-indigo-500/30 decoration-4">Intelligence Core Pulse</h3>
                
                <div className="flex flex-col items-center justify-center h-full">
                    <div 
                        className="w-[450px] h-[450px] rounded-full border border-indigo-500/10 flex items-center justify-center transition-transform duration-[5000ms] ease-in-out"
                        style={{ transform: `scale(${pulse})` }}
                    >
                        <div className="w-[300px] h-[300px] rounded-full border-4 border-indigo-500/20 shadow-3xl relative transition-all duration-1000">
                            <div className="absolute inset-16 rounded-full bg-indigo-500/10 blur-[80px] animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center transform scale-150">
                                <div className="h-4 w-4 bg-indigo-500 rounded-full shadow-[0_0_40px_rgba(99,102,241,1)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mt-12">
                {nodeList.map(node => (
                    <div 
                        key={node.id} 
                        onClick={() => setSelectedInsightId(node.id)}
                        className={`p-12 rounded-[5.5rem] bg-white border transition-all duration-1000 h-[420px] flex flex-col justify-between cursor-pointer group active:scale-95 relative overflow-hidden ${
                            selectedInsightId === node.id ? 'border-indigo-500 shadow-3xl z-10 scale-[1.02]' : 'border-slate-50 hover:border-indigo-300'
                        }`}
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-start mb-10">
                            <div className={`h-4 w-4 rounded-full transition-all duration-1000 ${selectedInsightId === node.id ? 'bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)]' : 'bg-slate-200 opacity-30 shadow-inner'}`} />
                            <span className={`text-[10px] uppercase tracking-widest font-black italic transition-colors leading-none ${selectedInsightId === node.id ? 'text-indigo-600 underline' : 'text-slate-300'}`}>{node.id}</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-slate-300 tracking-[0.4em] mb-4 italic">Behavioral Insight</p>
                            <h4 className={`text-4xl font-black text-slate-950 uppercase tracking-tighter mb-4 italic transition-colors leading-none group-hover:text-indigo-600`}>{node.summary}</h4>
                            <p className="text-[11px] text-slate-400 uppercase tracking-[0.2em] font-black leading-relaxed italic">{node.category.toUpperCase()} // RELIABILITY: {Math.round(node.reliability)}%</p>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50/50 p-6 rounded-[3rem] mt-6 relative z-10 group-hover:bg-indigo-50 transition-all duration-1000">
                            <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.4em] italic">{node.source}</span>
                            <span className="text-[9px] uppercase font-black text-indigo-400 tracking-[0.4em] italic">{new Date(node.timestamp).toLocaleTimeString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="col-span-4 space-y-12 flex flex-col h-full grow">
            <div className="p-16 rounded-[7rem] bg-indigo-950 border border-slate-800 shadow-3xl text-white flex-1 flex flex-col justify-between overflow-hidden relative group h-full">
                <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity transform group-hover:rotate-45 duration-1000">
                    <span className="text-[250px] font-black italic serif leading-none">I</span>
                </div>
                <div className="relative z-10 h-full flex flex-col">
                   <h3 className="text-[11px] uppercase font-black tracking-[0.8em] text-indigo-400 mb-12 italic underline decoration-indigo-500/30 decoration-4 underline-offset-8">Intelligence Trace</h3>
                   <div className="space-y-16 grow flex flex-col">
                       {selectedInsightId ? (
                           <div className="space-y-16 grow flex flex-col">
                                {insights.explainInsight(selectedInsightId).map((detail, i) => (
                                    <div key={i} className="animate-[fade_1.5s_ease-out_forwards] border-l-2 border-white/5 pl-10 py-3 hover:border-indigo-500/50 transition-all duration-1000">
                                         <div className="text-[11px] uppercase text-white/30 mb-3 tracking-[0.5em] font-black italic">TRACE_POINT_{i+1}</div>
                                         <div className="text-3xl font-black tracking-tighter text-emerald-400 leading-none italic">{detail}</div>
                                    </div>
                                ))}
                                <div className="mt-auto pt-12">
                                     <div className="h-2 w-32 bg-indigo-500/20 rounded-full shadow-inner" />
                                </div>
                           </div>
                       ) : (
                           <div className="grow flex flex-col items-center justify-center p-20 border-4 border-dashed border-white/5 rounded-[6rem] opacity-20 filter blur-[1px] transform rotate-3 scale-95 transition-all hover:scale-100 hover:rotate-0 hover:opacity-100">
                              <p className="text-[14px] uppercase tracking-[1em] mb-4 font-black italic text-white/40 text-center leading-loose">Select an insight to trace its temporal derivation.</p>
                           </div>
                       )}
                   </div>
                </div>
                <div className="pt-20 border-t border-white/5 flex gap-4 relative z-10">
                    <button 
                        onClick={() => insights.generateInsight('Neural')}
                        disabled={insights.isLearning}
                        className="w-full py-8 bg-white text-slate-950 rounded-full text-[12px] font-black uppercase tracking-[1em] hover:bg-indigo-600 hover:text-white transition-all shadow-3xl active:scale-95 italic border-2 border-slate-200"
                    >
                        {insights.isLearning ? 'SYNTHESIZING...' : 'SYNTHESIZE INSIGHT'}
                    </button>
                </div>
            </div>

            <div className="p-12 rounded-[6rem] bg-white/5 border border-slate-100 shadow-2xl flex items-center gap-12 group relative overflow-hidden transition-all hover:bg-slate-100 cursor-default">
                <div className="h-20 w-20 rounded-full border-4 border-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-[360deg] duration-[2000ms] shadow-3xl">
                    <span className="text-4xl font-black italic serif">🧠</span>
                </div>
                <div>
                    <h4 className="text-[14px] uppercase font-black text-indigo-600 tracking-[0.6em] mb-2 leading-none italic">Intelligence Anchor</h4>
                    <p className="text-xs text-slate-400 leading-relaxed italic truncate font-black">Reliability is preserved across all shards.</p>
                </div>
            </div>
            
            <div className="text-[12px] uppercase tracking-[1.8em] font-black text-slate-300 px-12 text-center italic">Mesh: STABLE</div>
        </div>
      </div>
      
      <div className="mt-32 text-[12px] uppercase tracking-[1.4em] font-black text-slate-300 flex items-center gap-24">
          <div className="h-px w-64 bg-slate-200 shadow-sm" />
          Intelligence status: ABSOLUTE
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
