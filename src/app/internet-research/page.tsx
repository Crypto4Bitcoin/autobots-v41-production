"use client";
import React, { useState, useEffect } from 'react';
import { useResearchStore } from '../../stores/researchStore';
import { useAethelgardStore } from '../../stores/aethelgardStore';

export default function InternetResearchPage() {
  const research = useResearchStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);
  const [topic, setTopic] = useState('Neural Lattice Connectivity');

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        research.syncResearch();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const metaList = research.discoveries || [];

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Liquid-Blue-Research-Atmosphere */}
      <div className={`absolute inset-0 z-0 bg-gradient-to-br from-blue-950/30 via-black to-slate-900 transition-opacity duration-[2000ms] ${research.isScanning ? 'opacity-100' : 'opacity-40'}`} />
      <div className={`absolute top-0 inset-x-0 h-1 transition-all duration-[2000ms] ${research.totalInsights > 1000 ? 'bg-blue-500 shadow-[0_0_60px_rgba(59,130,246,1)]' : 'bg-transparent'}`} />
      <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <header className="relative z-10 text-center mb-20 max-w-5xl px-8 w-full flex justify-between items-end gap-16">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1em] text-blue-500 font-black mb-4 italic leading-none">Interstellar Discovery & Research</p>
            <h1 className="text-8xl font-black tracking-tighter text-white mb-6 uppercase italic leading-none">Research</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-blue-400 border border-white/5 px-12 py-5 rounded-full bg-white/5 shadow-2xl backdrop-blur-3xl transition-transform hover:scale-105 italic font-black">
                <span>Total Insights: {research.totalInsights}</span>
                <span>Discoveries: {metaList.length}</span>
                <span>Status: {research.isScanning ? 'SCANNING' : 'STEADY'}</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-4 space-y-12 h-full flex flex-col">
            <div className="p-16 rounded-[7rem] bg-blue-950/20 border border-blue-500/30 shadow-2xl text-white flex-1 flex flex-col justify-between overflow-hidden relative group h-full">
                <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity transform group-hover:rotate-45 duration-1000">
                    <span className="text-[250px] font-black italic serif leading-none">R</span>
                </div>
                <div className="relative z-10 h-full flex flex-col">
                   <h3 className="text-[11px] uppercase font-black tracking-[0.8em] text-blue-400 mb-12 italic underline decoration-blue-500/30 decoration-4 underline-offset-8">Discovery Engine</h3>
                   <div className="space-y-16 grow flex flex-col">
                       <div className="grow flex flex-col">
                            <label className="text-[10px] uppercase tracking-[0.6em] font-black text-white/20 mb-6 block italic">Discovery Topic Matrix</label>
                            <textarea 
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-[5rem] p-12 text-3xl text-white italic font-serif focus:border-blue-500 outline-none transition-all resize-none shadow-3xl h-64 scrollbar-hide grow leading-relaxed"
                                placeholder="Enter core research topic..."
                            />
                        </div>
                       <div className="space-y-12">
                           {[
                               { label: "Research Parity", val: "100%", color: "text-emerald-400" },
                               { label: "Discovery Index", val: research.totalInsights, color: "text-blue-400" },
                               { label: "Knowledge Sync", val: 'HARMONIZED', color: "text-white" }
                           ].map(stat => (
                               <div key={stat.label} className="border-l-2 border-white/10 pl-10 py-3 hover:border-blue-500/50 transition-all duration-1000">
                                   <div className="text-[11px] uppercase text-white/30 mb-3 tracking-[0.5em] font-black italic">{stat.label}</div>
                                   <div className={`text-6xl font-black tracking-tighter ${stat.color} leading-none italic`}>{stat.val}</div>
                               </div>
                           ))}
                       </div>
                   </div>
                </div>
                <div className="pt-20 border-t border-white/5">
                    <button 
                        onClick={() => research.initiateDiscovery(topic)}
                        disabled={research.isScanning}
                        className="w-full py-8 bg-white text-slate-900 rounded-full text-[12px] font-black uppercase tracking-[1em] hover:bg-blue-600 hover:text-white transition-all shadow-3xl active:scale-95 italic border-2 border-slate-200"
                    >
                        {research.isScanning ? 'SCANNING MESH...' : 'INITIATE DISCOVERY'}
                    </button>
                </div>
            </div>

            <div className="p-12 rounded-[6rem] bg-white/5 border border-white/1 shadow-2xl flex items-center gap-12 group relative overflow-hidden transition-all hover:bg-white/10 cursor-default">
                <div className="h-20 w-20 rounded-full border-4 border-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-[360deg] duration-[2000ms] shadow-3xl">
                    <span className="text-4xl font-black italic serif">🌐</span>
                </div>
                <div>
                    <h4 className="text-[14px] uppercase font-black text-blue-400 tracking-[0.6em] mb-2 leading-none italic">Research Anchor</h4>
                    <p className="text-xs text-white/30 leading-relaxed italic truncate font-black">Knowledge is preserved across the eternal mesh.</p>
                </div>
            </div>
            
            <div className="text-[11px] uppercase tracking-[1.8em] font-black text-white/10 px-12 text-center italic">Research Singularity: ABSOLUTE</div>
        </div>

        <div className="col-span-8 flex flex-col h-full grow">
            <div className={`p-20 rounded-[7rem] bg-white/5 border transition-all duration-1000 flex flex-col justify-between group h-full h-[650px] relative overflow-hidden ${
                research.isScanning ? 'border-blue-500/30 shadow-[0_0_100px_rgba(59,130,246,0.1)]' : 'border-white/5'
            }`}>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <h3 className="text-[11px] uppercase tracking-[0.6em] text-white/30 mb-10 font-black italic">Discovery Stream & Verification</h3>
                
                <div className="relative z-10 grid grid-cols-2 gap-12 overflow-y-auto pr-4 custom-scrollbar px-8">
                    {metaList.length === 0 ? (
                        <div className="col-span-2 py-64 text-center text-sm text-white/5 italic tracking-[0.8em] uppercase font-black filter blur-[1px]">Waiting for discovery protocol...</div>
                    ) : metaList.map(disc => (
                        <div 
                            key={disc.id} 
                            className={`p-16 rounded-[5rem] border transition-all duration-1000 h-[380px] flex flex-col justify-between cursor-default shadow-3xl scale-95 hover:scale-100 relative overflow-hidden active:scale-95 ${
                                disc.status === 'verified' ? 'bg-blue-500/10 border-blue-500/40 text-white shadow-2xl' : 'bg-white/5 border-white/5 text-white/40'
                            }`}
                        >
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex justify-between items-start w-full relative z-10">
                                <div className={`h-4 w-4 rounded-full transition-all duration-1000 ${disc.status === 'verified' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,1)]' : 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] animate-ping'}`} />
                                <span className="text-[12px] uppercase tracking-widest text-white/20 font-black group-hover:text-white/60 italic">{disc.id}</span>
                            </div>
                            <div className="relative z-10 px-4">
                                <p className="text-[10px] uppercase font-black text-white/20 tracking-[0.4em] mb-4 italic">Discovery Metric</p>
                                <h4 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 italic transition-colors leading-none group-hover:text-blue-400">{disc.topic}</h4>
                                <div className="flex justify-between items-center py-4 border-y border-white/5 group-hover:border-blue-500/20 transition-all duration-1000">
                                    <span className="text-[10px] uppercase font-black text-white/20 tracking-[0.3em] italic">Knowledge Confidence</span>
                                    <span className="text-xl font-black text-blue-500 italic">%{disc.confidence}</span>
                                </div>
                                <p className="text-[11px] text-white/20 uppercase tracking-[0.4em] font-black italic mt-4">{disc.source}</p>
                            </div>
                            <div className="flex justify-between items-center border-t border-white/5 pt-8 mt-6 relative z-10">
                                <span className="text-[10px] uppercase font-black text-white/40 tracking-[0.6em] italic leading-none">{disc.status.toUpperCase()}</span>
                                {disc.status === 'scanning' && (
                                    <button 
                                        onClick={() => research.verifyDiscovery(disc.id)}
                                        className="px-10 py-4 bg-white text-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.8em] hover:bg-blue-600 hover:text-white transition-all active:scale-90 shadow-2xl italic"
                                    >
                                        Verify
                                    </button>
                                )}
                                {disc.status === 'verified' && (
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.6em] italic bg-emerald-500/10 px-6 py-2 rounded-full border border-emerald-500/20">TRUTH_LOCKED</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className={`mt-12 p-12 rounded-[7rem] bg-indigo-950 border transition-all duration-1000 flex items-center justify-center gap-24 relative overflow-hidden group ${
                research.isScanning ? 'border-blue-500 shadow-[0_0_60px_rgba(59,130,246,0.3)] animate-pulse' : 'border-slate-800'
            }`}>
                 <p className="text-[14px] uppercase tracking-[1.2em] font-black text-white mb-2 italic text-center leading-none">
                    Discovery Pulse Status: <span className={research.isScanning ? 'text-blue-400' : 'text-emerald-400'}>{research.isScanning ? 'SCANNING' : 'LOCKED'}</span>
                 </p>
            </div>
        </div>
      </div>
      
      <div className="mt-32 text-[12px] uppercase tracking-[1.8em] font-black text-white/10 flex items-center gap-24">
          <div className="h-px w-64 bg-white/5 shadow-sm" />
          Discovery status: ABSOLUTE
          <div className="h-px w-64 bg-white/5 shadow-sm" />
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
        @keyframes fade {
            from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}</style>
    </div>
  );
}
