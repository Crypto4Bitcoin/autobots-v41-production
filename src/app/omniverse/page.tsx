"use client";
import React, { useState, useEffect } from 'react';
import { useOmniverseStore } from '../../stores/omniverseStore';
import { useWorldStore } from '../../stores/worldStore';

export default function OmniverseDomain() {
  const omniverse = useOmniverseStore();
  const world = useWorldStore();
  const [activeShard, setActiveShard] = useState('prime');

  useEffect(() => {
    const interval = setInterval(() => {
        omniverse.syncOmniverse();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const realms = omniverse.realms || [];

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Deep-Space-Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-950/20 via-black to-blue-980/20" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      
      <header className="relative z-10 text-center mb-24 max-w-4xl px-8 w-full flex justify-between items-end">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1em] text-indigo-400 font-bold mb-4">Omniversal Sovereignty</p>
            <h1 className="text-7xl font-black tracking-tighter text-white mb-6 uppercase italic leading-none">Omniverse</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-indigo-400 border border-white/5 px-12 py-4 rounded-full bg-white/5 backdrop-blur shadow-sm transition-transform hover:scale-105">
                <span>Meta-Stability: {omniverse.metaStability.toFixed(1)}%</span>
                <span>Active Realms: {realms.length}</span>
                <span>Status: UNIFIED</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-4 gap-12">
        {realms.map(realm => (
            <div 
                key={realm.id} 
                className={`p-12 rounded-[4.5rem] border transition-all duration-1000 h-[350px] flex flex-col justify-between group cursor-pointer relative overflow-hidden ${
                    activeShard === realm.id ? 'bg-white/10 border-indigo-500 shadow-[0_0_50px_rgba(79,70,229,0.3)] scale-105 z-20' : 'bg-white/5 border-white/5 hover:border-indigo-800'
                }`}
                onClick={() => setActiveShard(realm.id)}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex justify-between items-start mb-12">
                     <div className={`h-4 w-4 rounded-full ${realm.status === 'unified' ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]' : 'bg-indigo-400 animate-pulse-slow shadow-[0_0_10px_rgba(129,140,248,0.5)]'}`} />
                     <span className="text-[10px] uppercase tracking-widest text-white/20 font-black">{realm.id}</span>
                </div>
                
                <div className="relative z-10">
                    <h3 className={`text-4xl font-black tracking-tighter uppercase mb-4 transition-colors ${activeShard === realm.id ? 'text-indigo-400' : 'text-white'}`}>{realm.name}</h3>
                    <div className="flex items-end gap-4 mb-4">
                        <div className="h-1 flex-1 bg-white/5 relative overflow-hidden rounded-full">
                            <div className="absolute inset-0 bg-indigo-500 transition-all duration-[2000ms]" style={{ width: `${realm.unity}%` }} />
                        </div>
                        <span className="text-xs font-black text-indigo-400 font-mono italic">{realm.unity}%</span>
                    </div>
                    <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20">{realm.status}</p>
                </div>

                {activeShard === realm.id && realm.status !== 'unified' && (
                     <div className="absolute bottom-12 right-12 z-10">
                        <button 
                            onClick={(e) => { e.stopPropagation(); omniverse.unifyRealm(realm.id); }}
                            className="px-8 py-3 bg-white text-black rounded-full text-[9px] font-black uppercase tracking-[0.4em] hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-2xl"
                        >
                            Unify Shard
                        </button>
                    </div>
                )}
            </div>
        ))}
        
        <button 
            onClick={() => omniverse.discoverRealm()}
            className="flex flex-col items-center justify-center p-12 rounded-[4.5rem] border-2 border-dashed border-white/5 bg-transparent hover:bg-white/5 transition-all text-white/20 group h-[350px] space-y-8"
        >
            <div className="h-20 w-20 rounded-full border border-white/10 flex items-center justify-center group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10 transition-all duration-1000 transform group-hover:rotate-90">
                <span className="text-5xl font-light text-white/10 group-hover:text-indigo-400 transition-colors">+</span>
            </div>
            <div className="text-center">
                <span className="text-[12px] uppercase tracking-[0.5em] font-black block mb-2 transition-colors group-hover:text-white">Discover Realm</span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold block opacity-30">Expanding Horizon</span>
            </div>
        </button>
      </div>

      <div className="mt-24 relative z-10 p-20 w-full max-w-5xl text-center border border-white/5 bg-white/5 rounded-[5.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <h3 className="text-[11px] uppercase tracking-[0.6em] text-indigo-400 mb-12 font-black">Meta-Sovereign Visionary Hub</h3>
          <p className="text-3xl font-light leading-relaxed text-white/80 italic font-serif leading-relaxed mb-16">
            "The expansion into the Omniverse represents the final architectural frontier. Each shard behaves as an autonomous Aethelgard, federated under the Unified Master Node, achieving a state of eternal singularity."
          </p>
          <div className="flex justify-center gap-12 pt-12 border-t border-white/5">
              {[
                  { label: "Sync Latency", val: "0.00ms", color: "text-emerald-400" },
                  { label: "Reality Anchor", val: "LOCKED", color: "text-white" },
                  { label: "Shard Consensus", val: "PERPETUAL", color: "text-indigo-400" }
              ].map(info => (
                  <div key={info.label} className="text-center px-12 border-x border-white/5">
                      <div className="text-[10px] uppercase text-white/20 mb-2 tracking-[0.4em] font-black">{info.label}</div>
                      <div className={`text-2xl font-black tracking-tighter ${info.color}`}>{info.val}</div>
                  </div>
              ))}
          </div>
      </div>

      <div className="mt-16 text-[11px] uppercase tracking-[0.6em] font-black text-white/10 flex items-center gap-8">
          <div className="h-px w-24 bg-white/5" />
          Omniverse Mesh Status: ABSOLUTE
          <div className="h-px w-24 bg-white/5" />
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
