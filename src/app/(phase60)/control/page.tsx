"use client";
import React, { useState, useEffect } from 'react';
import { useControlStore } from '../../../stores/controlStore';
import { useAethelgardStore } from '../../../stores/aethelgardStore';

export default function ControlDomain() {
  const control = useControlStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        control.syncControl();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Crystalline Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-950/20 via-black to-slate-950" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      
      <header className="relative z-10 text-center mb-24 max-w-4xl px-8 w-full flex justify-between items-center">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[0.8em] text-emerald-400 font-bold mb-4">Interstellar Strategic Control</p>
            <h1 className="text-6xl font-black tracking-tighter text-white mb-6 uppercase italic">Control</h1>
        </div>
        <div className="flex gap-4">
            <button 
                onClick={() => control.triggerAction('interrupt', { priority: 'URGENT', scope: 'GLOBAL' })}
                className="px-12 py-5 bg-rose-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.5em] hover:bg-rose-500 transition-all shadow-xl active:scale-95 border border-rose-400/30"
            >
                Emergency Interrupt
            </button>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-4 space-y-12">
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8 font-bold px-4">Strategic Intent Registry</h3>
            <div className="space-y-6">
                {control.objectives.map((obj, i) => (
                    <div key={i} className="p-10 rounded-[3.5rem] bg-white/5 border border-white/5 shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500">
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">V{obj.version}</span>
                            <div className="text-right">
                                <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Weight</span>
                                <div className="text-2xl font-black text-white">{obj.weight}</div>
                            </div>
                        </div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-emerald-400 transition-colors">{obj.name}</h4>
                        <p className="text-xs text-white/40 leading-relaxed italic">{obj.description}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="col-span-8 flex flex-col h-full grow">
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8 font-bold px-4">Unified Decision Ledger</h3>
            <div className="flex-1 p-12 rounded-[4.5rem] bg-white/5 border border-white/5 shadow-2xl relative overflow-hidden h-full flex flex-col divide-y divide-white/5">
                {control.decisions.map((dec, i) => (
                    <div key={i} className="py-10 px-4 group hover:bg-emerald-500/5 transition-all duration-500 first:pt-0 last:pb-0">
                         <div className="flex justify-between items-start mb-4">
                            <span className="text-[9px] font-black text-emerald-500/40 uppercase tracking-widest">{dec.source_layer}</span>
                            <span className="text-[10px] text-white/20 font-mono italic">{new Date(dec.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-lg font-bold text-white mb-6 group-hover:text-emerald-400 transition-colors">{dec.explanation}</p>
                        <div className="flex items-center gap-6">
                            <div className="h-1.5 w-40 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" style={{ width: `${dec.intent_alignment * 100}%` }}></div>
                            </div>
                            <span className="text-[10px] text-emerald-500 font-mono font-bold uppercase tracking-widest">Alignment: {Math.round(dec.intent_alignment * 100)}%</span>
                        </div>
                    </div>
                ))}
                {control.decisions.length === 0 && (
                    <div className="flex-1 flex items-center justify-center py-40 text-center opacity-10 italic uppercase tracking-[0.4em] text-xs">Waiting for meta-logic decisions...</div>
                )}
            </div>
            
            <div className="mt-12 p-12 rounded-[5rem] bg-emerald-950/20 border border-emerald-500/20 shadow-2xl flex justify-between items-center group">
                <div className="flex items-center gap-10 px-8">
                   <div className="h-20 w-20 rounded-full border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all transform animate-[spin_20s_linear_infinite]">
                        <span className="text-4xl font-black italic serif">c</span>
                    </div>
                    <div>
                        <h4 className="text-[10px] uppercase font-bold text-emerald-400 tracking-[0.2em] mb-1">Control Guidance</h4>
                        <p className="text-xs text-white/40 leading-relaxed italic truncate">Every decision is a pivot of universal sovereignty.</p>
                    </div>
                </div>
                <div className="flex gap-4 px-12">
                   <div className="text-center">
                        <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest block mb-1">Mission Integrity</span>
                        <span className="text-4xl font-black text-emerald-400">92%</span>
                   </div>
                </div>
            </div>
        </div>
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
