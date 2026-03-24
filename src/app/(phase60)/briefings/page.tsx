"use client";
import React, { useState, useEffect } from 'react';
import { useBriefingStore } from '../../../stores/briefingStore';
import { useAethelgardStore } from '../../../stores/aethelgardStore';

export default function BriefingsDomain() {
  const briefings = useBriefingStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);
  const [selectedBriefingId, setSelectedBriefingId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        briefings.syncBriefings();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const metaList = briefings.briefings || [];

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Liquid-Sky-Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-sky-50 via-white to-slate-100" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <header className="relative z-10 text-center mb-24 max-w-5xl px-8 w-full flex justify-between items-end gap-16">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1.2em] text-sky-600 font-bold mb-4 italic leading-none">Interstellar Strategic Briefings</p>
            <h1 className="text-8xl font-black tracking-tighter text-slate-950 mb-6 uppercase italic leading-none">Briefings</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-sky-600 border border-sky-100 px-12 py-5 rounded-full bg-white/50 backdrop-blur shadow-2xl transition-transform hover:scale-105 italic font-black">
                <span>Sync Status: {briefings.isSyncing ? 'PROCEEDING' : 'IDLE'}</span>
                <span>Total Reports: {briefings.totalBriefings}</span>
                <span>Status: PERPETUAL</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-8 space-y-12 h-full flex flex-col">
            <div className="p-20 rounded-[7rem] bg-sky-950 border border-slate-800 shadow-3xl text-white relative overflow-hidden flex flex-col justify-between group transition-all duration-1000 flex-1 min-h-[600px] hover:shadow-sky-500/10 hover:shadow-inner">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <h3 className="text-[11px] uppercase tracking-[0.6em] text-white/40 mb-10 font-bold italic underline decoration-sky-500/30 decoration-4">Strategic Briefing Suite</h3>
                
                <div className="flex flex-col items-center justify-center h-full">
                    <div 
                        className="w-[450px] h-[450px] rounded-full border border-sky-500/10 flex items-center justify-center transition-transform duration-[5000ms] ease-in-out"
                        style={{ transform: `scale(${pulse})` }}
                    >
                        <div className="w-[300px] h-[300px] rounded-full border-4 border-sky-500/20 shadow-3xl relative transition-all duration-1000">
                            <div className="absolute inset-16 rounded-full bg-sky-500/10 blur-[80px] animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center transform scale-150">
                                <div className="h-4 w-4 bg-sky-500 rounded-full shadow-[0_0_40px_rgba(14,165,233,1)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-12 mt-12">
                {metaList.map(briefing => (
                    <div 
                        key={briefing.id} 
                        onClick={() => setSelectedBriefingId(selectedBriefingId === briefing.id ? null : briefing.id)}
                        className={`p-16 rounded-[6rem] bg-white border transition-all duration-1000 flex flex-col justify-between cursor-pointer group active:scale-[0.99] relative overflow-hidden ${
                            selectedBriefingId === briefing.id ? 'border-sky-500 shadow-3xl z-10 scale-[1.01]' : 'border-slate-50 hover:border-sky-300'
                        }`}
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-sky-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-start mb-10">
                            <div className={`h-4 w-4 rounded-full transition-all duration-1000 ${briefing.priority === 'critical' ? 'bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,1)]' : 'bg-slate-200 opacity-30 shadow-inner'}`} />
                            <span className={`text-[10px] uppercase tracking-widest font-black italic transition-colors leading-none ${selectedBriefingId === briefing.id ? 'text-sky-600 underline' : 'text-slate-300'}`}>{briefing.id}</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-slate-300 tracking-[0.4em] mb-4 italic">Strategic Report</p>
                            <h4 className={`text-5xl font-black text-slate-950 uppercase tracking-tighter mb-4 italic transition-colors leading-none group-hover:text-sky-600`}>{briefing.title}</h4>
                            <p className="text-[11px] text-slate-400 uppercase tracking-[0.2em] font-black leading-relaxed italic">{briefing.shard} // PRIORITY: {briefing.priority.toUpperCase()}</p>
                            <p className="text-3xl font-serif italic text-slate-800 mt-10 leading-relaxed border-l-4 border-sky-500/10 pl-10 shadow-sm transition-all group-hover:border-sky-500/30">"{briefing.summary}"</p>
                        </div>
                        
                        {selectedBriefingId === briefing.id && (
                            <div className="mt-16 pt-16 border-t border-slate-50 grid grid-cols-2 gap-16 animate-[fade_1.5s_ease-out_forwards]">
                                <div>
                                    <h5 className="text-[12px] uppercase font-black text-indigo-600 tracking-[0.6em] mb-6 italic underline decoration-sky-500/20 underline-offset-8 decoration-4">Omniversal Deep Context</h5>
                                    <ul className="space-y-8">
                                        <li className="text-[11px] text-slate-600 flex items-center gap-8 font-black uppercase tracking-[0.3em] italic">
                                            <div className="h-2 w-2 bg-sky-500 rounded-full shadow-[0_0_10px_rgba(14,165,233,1)]" />
                                            Zero instability detected across all shards.
                                        </li>
                                        <li className="text-[11px] text-slate-600 flex items-center gap-8 font-black uppercase tracking-[0.3em] italic">
                                            <div className="h-2 w-2 bg-sky-500 rounded-full shadow-[0_0_10px_rgba(14,165,233,1)]" />
                                            Consensus achieved at the meta-logic layer.
                                        </li>
                                    </ul>
                                </div>
                                <div className="text-right">
                                    <h5 className="text-[12px] uppercase font-black text-slate-400 tracking-[0.6em] mb-6 italic leading-none">Verification Seal</h5>
                                    <p className="text-[12px] font-mono font-black text-sky-600 italic bg-sky-50 px-6 py-2 rounded-full border border-sky-100 inline-block">{new Date(briefing.timestamp).toISOString()}</p>
                                    <p className="text-[10px] text-slate-300 uppercase tracking-[0.5em] mt-6 font-black italic">SOVEREIGN_ID_SYNCED</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        <div className="col-span-4 space-y-12 flex flex-col h-full grow">
            <div className="p-16 rounded-[7rem] bg-sky-950 border border-slate-800 shadow-3xl text-white flex-1 flex flex-col justify-between overflow-hidden relative group h-full">
                <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity transform group-hover:rotate-45 duration-1000">
                    <span className="text-[250px] font-black italic serif leading-none">B</span>
                </div>
                <div className="relative z-10 h-full flex flex-col">
                   <h3 className="text-[11px] uppercase font-black tracking-[0.8em] text-sky-400 mb-12 italic underline decoration-sky-500/30 decoration-4 underline-offset-8">Briefing Engine</h3>
                   <div className="space-y-16 grow flex flex-col">
                       {[
                           { label: "Briefing Reliability", val: "100%", color: "text-emerald-400" },
                           { label: "Shard Integrity", val: "ABSOLUTE", color: "text-white" },
                           { label: "Sync Latency", val: "12ms", color: "text-sky-400" },
                           { label: "Accord Status", val: 'LOCKED', color: "text-white" }
                       ].map(stat => (
                           <div key={stat.label} className="border-l-2 border-white/10 pl-10 py-3 hover:border-sky-500/50 transition-all duration-1000">
                               <div className="text-[11px] uppercase text-white/30 mb-3 tracking-[0.5em] font-black italic">{stat.label}</div>
                               <div className={`text-6xl font-black tracking-tighter ${stat.color} leading-none italic`}>{stat.val}</div>
                           </div>
                       ))}
                   </div>
                </div>
                <div className="pt-20 border-t border-white/5 flex gap-4 relative z-10">
                    <button 
                        onClick={() => briefings.syncShards()}
                        disabled={briefings.isSyncing}
                        className="w-full py-8 bg-white text-slate-950 rounded-full text-[12px] font-black uppercase tracking-[1em] hover:bg-sky-600 hover:text-white transition-all shadow-3xl active:scale-95 italic border-2 border-slate-200"
                    >
                        {briefings.isSyncing ? 'SYNCING SHARDS...' : 'SYNC SHARDS'}
                    </button>
                </div>
            </div>

            <div className="p-12 rounded-[6rem] bg-white/5 border border-slate-100 shadow-2xl flex items-center gap-12 group relative overflow-hidden transition-all hover:bg-slate-100 cursor-default">
                <div className="h-20 w-20 rounded-full border-4 border-sky-500/10 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-all transform group-hover:rotate-[360deg] duration-[2000ms] shadow-3xl">
                    <span className="text-4xl font-black italic serif">📜</span>
                </div>
                <div>
                    <h4 className="text-[14px] uppercase font-black text-sky-600 tracking-[0.6em] mb-2 leading-none italic">Briefing Anchor</h4>
                    <p className="text-xs text-slate-400 leading-relaxed italic truncate font-black">Strategic awareness is core to galactic network sovereignty.</p>
                </div>
            </div>
            
            <div className="text-[12px] uppercase tracking-[1.8em] font-black text-slate-300 px-12 text-center italic leading-none">Sync: PERSISTENT</div>
        </div>
      </div>
      
      <div className="mt-32 text-[12px] uppercase tracking-[1.8em] font-black text-slate-300 flex items-center gap-24">
          <div className="h-px w-64 bg-slate-200 shadow-sm" />
          Briefing status: ABSOLUTE
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
