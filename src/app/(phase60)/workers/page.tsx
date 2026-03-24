"use client";
import React, { useState, useEffect } from 'react';
import { useWorkerStore } from '../../../stores/workerStore';
import { useAethelgardStore } from '../../../stores/aethelgardStore';

export default function WorkersPage() {
  const workers = useWorkerStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        workers.syncWorkers();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const list = workers.workers || [];

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Golden-Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-amber-950/20 via-black to-slate-900" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      
      <header className="relative z-10 text-center mb-24 max-w-4xl px-8 w-full flex justify-between items-end gap-12">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1em] text-amber-500 font-black mb-4">Omniversal Labor Division</p>
            <h1 className="text-7xl font-black tracking-tighter text-white mb-6 uppercase italic leading-none">Workers</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-amber-500 border border-white/5 px-12 py-4 rounded-full bg-white/5 backdrop-blur shadow-sm transition-transform hover:scale-105">
                <span>Throughput: {workers.totalThroughput.toFixed(1)} ops/s</span>
                <span>Active Assets: {list.length}</span>
                <span>Status: OPTIMIZED</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-3 gap-12">
        {list.map(w => (
            <div 
                key={w.id} 
                className={`p-16 rounded-[4.5rem] border transition-all duration-1000 h-[500px] flex flex-col justify-between group cursor-pointer relative overflow-hidden ${
                    w.status === 'active' ? 'bg-white/10 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.2)]' : 'bg-white/5 border-white/5'
                }`}
                onClick={() => workers.toggleWorker(w.id)}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex justify-between items-start mb-12">
                     <div className={`h-4 w-4 rounded-full ${w.status === 'active' ? 'bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.8)]' : 'bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]'}`} />
                     <span className="text-[10px] uppercase tracking-widest text-white/20 font-black">{w.id}</span>
                </div>
                
                <div className="relative z-10">
                    <h3 className={`text-4xl font-black tracking-tighter uppercase mb-2 ${w.status === 'active' ? 'text-amber-500' : 'text-white/40 group-hover:text-white transition-colors'}`}>{w.name}</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] uppercase font-black text-amber-500/50">{w.shard}</span>
                        <div className="h-0.5 flex-1 bg-white/5 relative overflow-hidden rounded-full">
                            <div className="absolute inset-0 bg-amber-500 transition-all duration-[2000ms]" style={{ width: `${w.performance}%` }} />
                        </div>
                        <span className="text-xs font-black text-amber-500 font-mono italic">{w.performance}%</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">{w.status}</p>
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-10 mt-8 relative z-10">
                    <span className="text-[9px] uppercase font-black text-white/20 tracking-[0.4em]">Labor Shard</span>
                    <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="px-10 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.5em] hover:bg-amber-600 hover:text-white transition-all active:scale-90 shadow-2xl"
                    >
                        Provision Info
                    </button>
                </div>
            </div>
        ))}
        
        <button 
            onClick={() => workers.provisionWorker("Quantum Auditor", "Shard Delta")}
            className="flex flex-col items-center justify-center p-12 rounded-[4.5rem] border-2 border-dashed border-white/10 bg-transparent hover:bg-white/5 transition-all text-white/20 group h-[500px] space-y-8"
        >
            <div className="h-24 w-24 rounded-full border border-white/10 flex items-center justify-center group-hover:border-amber-500/40 group-hover:bg-amber-500/10 transition-all duration-1000 transform group-hover:rotate-90">
                <span className="text-6xl font-light text-white/10 group-hover:text-amber-400 transition-colors">+</span>
            </div>
            <div className="text-center">
                <span className="text-[14px] uppercase tracking-[0.6em] font-black block mb-2 transition-colors group-hover:text-white">Provision Worker</span>
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold block opacity-30 italic">Omniverse Scaling</span>
            </div>
        </button>
      </div>

      <div className="mt-24 relative z-10 p-20 w-full max-w-5xl text-center border border-white/5 bg-white/5 rounded-[5.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <h3 className="text-[11px] uppercase tracking-[0.6em] text-amber-500 mb-12 font-black">Meta-Labor Visionary Hub</h3>
          <p className="text-3xl font-light leading-relaxed text-white/80 italic font-serif leading-relaxed mb-16">
            "Persistent labor is the backbone of the Sovereign economy. Every worker acts as a neural asset within the shard, achieving parity through autonomous intelligence and federated performance."
          </p>
          <div className="flex justify-center gap-12 pt-12 border-t border-white/10">
              {[
                  { label: "Throughput", val: workers.totalThroughput.toFixed(1) + " ops/s", color: "text-emerald-400" },
                  { label: "Labor Anchor", val: "LOCKED", color: "text-white" },
                  { label: "Parity Status", val: "OPTIMIZED", color: "text-amber-500" }
              ].map(info => (
                  <div key={info.label} className="text-center px-12 border-x border-white/10">
                      <div className="text-[10px] uppercase text-white/20 mb-2 tracking-[0.4em] font-black">{info.label}</div>
                      <div className={`text-2xl font-black tracking-tighter ${info.color}`}>{info.val}</div>
                  </div>
              ))}
          </div>
      </div>

      <div className="mt-16 text-[11px] uppercase tracking-[0.8em] font-black text-white/20 flex items-center gap-12">
          <div className="h-px w-32 bg-white/10" />
          Worker Shard Integration: ABSOLUTE
          <div className="h-px w-32 bg-white/10" />
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
        }
        .animate-pulse-slow {
            animation: pulse-slow 3s infinite;
        }
      `}</style>
    </div>
  );
}
