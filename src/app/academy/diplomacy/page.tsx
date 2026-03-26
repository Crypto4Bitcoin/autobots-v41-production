"use client";
import React, { useState, useEffect } from 'react';
import { useDiplomacyStore } from '../../../stores/diplomacyStore';
import { useAethelgardStore } from '../../../stores/aethelgardStore';

export default function DiplomacyDomain() {
  const diplomacy = useDiplomacyStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        diplomacy.syncDiplomacy();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const agreements = diplomacy.agreements || [];

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Liquid-Slate-Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <header className="relative z-10 text-center mb-24 max-w-4xl px-8 w-full flex justify-between items-end gap-12">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1em] text-slate-500 font-bold mb-4 italic">Inter-Shard Sovereignty Diplomacy</p>
            <h1 className="text-6xl font-black tracking-tighter text-slate-950 mb-6 uppercase italic leading-none">Diplomacy</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-slate-400 border border-slate-100 px-12 py-4 rounded-full bg-white/50 backdrop-blur shadow-sm transition-transform hover:scale-105">
                <span>Negotiations: {diplomacy.totalNegotiations}</span>
                <span>Agreements: {agreements.length}</span>
                <span>Status: FINALIZED</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-3 gap-16">
        {agreements.map(ag => (
            <div 
                key={ag.id} 
                className={`p-16 rounded-[4.5rem] bg-white border transition-all duration-1000 h-[550px] flex flex-col justify-between group cursor-default relative overflow-hidden scale-95 hover:scale-100 ${
                    ag.status === 'finalized' ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.1)] z-10' : 'border-slate-50 hover:border-blue-300'
                }`}
            >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex justify-between items-start mb-12">
                    <div className={`h-4 w-4 rounded-full ${ag.status === 'finalized' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]' : 'bg-blue-400 animate-pulse-slow shadow-[0_0_15px_rgba(59,130,246,0.5)]'}`} />
                    <span className="text-[10px] uppercase tracking-widest text-slate-300 font-black italic">{ag.id}</span>
                </div>
                
                <div className="relative z-10">
                    <p className="text-[10px] uppercase font-black text-slate-300 tracking-[0.4em] mb-4 italic">Allocated Asset</p>
                    <h3 className={`text-4xl font-black text-slate-950 uppercase tracking-tighter mb-8 italic transition-colors leading-none ${ag.status === 'finalized' ? 'text-emerald-600' : 'text-slate-950'}`}>{ag.resource}</h3>
                    <div className="space-y-4">
                        <p className="text-[10px] uppercase font-black text-slate-200 tracking-[0.3em] mb-2 italic">Contracting Parties</p>
                        {ag.parties.map(p => (
                            <div key={p} className="flex items-center gap-4">
                                <div className="h-1.5 w-1.5 rounded-full bg-slate-100" />
                                <span className="text-[11px] uppercase font-black text-slate-400 tracking-widest italic">{p}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-50 pt-10 mt-8 relative z-10">
                    <span className="text-[10px] uppercase font-black text-slate-300 tracking-[0.6em] italic leading-none">Accord Hash</span>
                    {ag.status === 'negotiating' && (
                        <button 
                            onClick={() => diplomacy.finalizeAgreement(ag.id)}
                            className="px-10 py-4 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-[0.8em] hover:bg-emerald-600 transition-all active:scale-90 shadow-2xl"
                        >
                            Finalize Shard
                        </button>
                    )}
                    {ag.status === 'finalized' && (
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.6em] italic bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100">STABLE</span>
                    )}
                </div>
            </div>
        ))}

        <div className="col-span-3 mt-24 p-20 rounded-[7rem] bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-between group relative overflow-hidden transition-all duration-1000 hover:shadow-[0_0_100px_rgba(15,23,42,0.4)]">
             <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex items-center gap-16 px-12 relative z-10 w-2/3">
                <div className="h-28 w-28 rounded-full border border-slate-700 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-12 duration-[2000ms] shadow-2xl">
                    <span className="text-5xl font-black italic serif">🤝</span>
                </div>
                <div>
                   <h4 className="text-[18px] uppercase font-black text-white tracking-[0.6em] mb-3 leading-none italic">Federated Shard-Level Accord</h4>
                   <p className="text-sm text-white/30 leading-relaxed italic truncate font-black">Stewardship ensures resource parity across every civilization of the eternal mesh.</p>
                </div>
            </div>
            <div className="flex gap-12 px-20 relative z-10">
                <button 
                    onClick={() => diplomacy.proposeAgreement(['Shard Alpha', 'Shard Delta'], 'Network Assets')}
                    disabled={diplomacy.isNegotiating}
                    className="px-20 py-7 bg-white text-slate-950 rounded-full text-[11px] font-black uppercase tracking-[1em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95"
                >
                    {diplomacy.isNegotiating ? 'NEGOTIATING...' : 'PROPOSE ACCORD'}
                </button>
            </div>
        </div>
      </div>

      <div className="mt-24 text-[11px] uppercase tracking-[1.4em] font-black text-slate-300 flex items-center gap-24">
          <div className="h-px w-64 bg-slate-200" />
          Diplomatic Anchor: ABSOLUTE
          <div className="h-px w-64 bg-slate-200" />
      </div>

      <style jsx global>{`
        @keyframes fade {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-pulse-slow {
            animation: pulse-slow 3s infinite;
        }
        @keyframes pulse-slow {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
