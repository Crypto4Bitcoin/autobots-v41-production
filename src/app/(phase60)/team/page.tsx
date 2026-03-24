"use client";
import React, { useState, useEffect } from 'react';
import { useTeamStore } from '../../../stores/teamStore';
import { useWorldKernelStore } from '../../../stores/worldKernelStore';

export default function TeamDomain() {
  const team = useTeamStore();
  const kernel = useWorldKernelStore();
  
  const [pulse, setPulse] = useState(1);
  const [activeCitizenId, setActiveCitizenId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        team.syncTeam();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const metaList = team.citizens || [];

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Liquid-Amber-Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-50 via-white to-amber-50" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <header className="relative z-10 text-center mb-24 max-w-5xl px-8 w-full flex justify-between items-end gap-16">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1em] text-indigo-600 font-bold mb-4 italic leading-none">Interstellar Meta-Citizenship</p>
            <h1 className="text-8xl font-black tracking-tighter text-slate-950 mb-6 uppercase italic leading-none">Citizens</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-indigo-600 border border-indigo-100 px-12 py-5 rounded-full bg-white/50 backdrop-blur shadow-2xl transition-transform hover:scale-105 italic font-black">
                <span>Population: {team.totalCitizens.toLocaleString()}</span>
                <span>Active Sync: {team.isSyncing ? 'ACTIVE' : 'IDLE'}</span>
                <span>Status: {kernel.unifiedStability > 99 ? 'FEDERATED' : 'SYNCING'}</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-8 space-y-12 h-full flex flex-col">
            <div className="p-20 rounded-[7rem] bg-indigo-950 border border-slate-800 shadow-3xl text-white relative overflow-hidden flex flex-col justify-between group transition-all duration-1000 flex-1 min-h-[600px] hover:shadow-indigo-500/10 hover:shadow-inner">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <h3 className="text-[11px] uppercase tracking-[0.6em] text-white/40 mb-10 font-bold italic underline decoration-indigo-500/30 decoration-4 underline-offset-8">Federated Identity Pulse</h3>
                
                <div className="flex flex-col items-center justify-center h-full">
                    <div 
                        className="w-[450px] h-[450px] rounded-full border border-indigo-500/10 flex items-center justify-center transition-transform duration-[4000ms] ease-in-out"
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
                <div className="text-center mt-12 bg-white/5 p-6 rounded-[3rem] border border-white/5">
                    <p className="text-[12px] uppercase tracking-[0.8em] font-black text-indigo-400 mb-2 italic">Omniverse Identity Baseline</p>
                    <p className="text-4xl font-black tracking-tighter text-white uppercase italic">{team.isSyncing ? 'Syncing Citizens...' : 'Total Consensus'}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mt-12">
                {metaList.map(citizen => (
                    <div 
                        key={citizen.id} 
                        className="p-10 rounded-[4.5rem] bg-white border border-slate-50 transition-all duration-1000 h-[280px] flex flex-col justify-between cursor-default group active:scale-95 shadow-sm hover:border-indigo-300 hover:shadow-2xl hover:scale-105"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`h-4 w-4 rounded-full transition-all duration-1000 ${citizen.trustScore > 95 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]' : 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)]'}`} />
                            <span className="text-[10px] uppercase tracking-widest text-slate-300 font-black italic">{citizen.id}</span>
                        </div>
                        <div>
                             <p className="text-[9px] uppercase font-black text-slate-300 tracking-[0.4em] mb-2 italic leading-none">Sovereign Citizen</p>
                             <h4 className="text-3xl font-black tracking-tighter text-slate-950 uppercase italic leading-none transition-colors group-hover:text-indigo-600">{citizen.name}</h4>
                             <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-relaxed mt-2 italic font-black">{citizen.role}</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-50 pt-8 mt-4 group-hover:border-indigo-100 transition-all">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest italic text-indigo-600">TRUST SCORE: {citizen.trustScore}%</span>
                            </div>
                            <button 
                                onClick={() => team.removeCitizen(citizen.id)}
                                className="text-[10px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-[0.3em] italic bg-rose-50 px-6 py-2 rounded-full border border-rose-100 active:scale-90 transition-all"
                            >
                                OFFBOARD
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="col-span-4 space-y-12 flex flex-col h-full grow">
            <div className="p-16 rounded-[7rem] bg-indigo-950 border border-slate-800 shadow-3xl text-white flex-1 flex flex-col justify-between overflow-hidden relative group h-full">
                <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity transform group-hover:rotate-45 duration-1000">
                    <span className="text-[250px] font-black italic serif leading-none">C</span>
                </div>
                <div className="relative z-10 h-full flex flex-col">
                   <h3 className="text-[11px] uppercase font-black tracking-[0.8em] text-indigo-400 mb-12 italic underline decoration-indigo-500/30 decoration-4 underline-offset-8">Citizenship Metrics</h3>
                   <div className="space-y-16 grow flex flex-col">
                       {[
                           { label: "Identity Latency", val: "0.2ms", color: "text-emerald-400" },
                           { label: "Trust Consensus", val: "ABSOLUTE", color: "text-white" },
                           { label: "Citizenship Status", val: "FEDERATED", color: "text-indigo-400" },
                           { label: "Baseline Alignment", val: 'STABLE', color: "text-white" }
                       ].map(stat => (
                           <div key={stat.label} className="border-l-2 border-white/10 pl-10 py-3 hover:border-indigo-500/50 transition-all duration-1000">
                               <div className="text-[11px] uppercase text-white/30 mb-3 tracking-[0.5em] font-black italic">{stat.label}</div>
                               <div className={`text-6xl font-black tracking-tighter ${stat.color} leading-none italic`}>{stat.val}</div>
                           </div>
                       ))}
                   </div>
                </div>
                <div className="pt-20 border-t border-white/5">
                    <button 
                        onClick={() => team.onboardCitizen("New Architect", "Sovereign Overseer")}
                        className="w-full py-8 bg-white text-slate-900 rounded-full text-[12px] font-black uppercase tracking-[1em] hover:bg-indigo-600 hover:text-white transition-all shadow-3xl active:scale-95 italic border-2 border-slate-200"
                    >
                        Onboard Citizen
                    </button>
                </div>
            </div>

            <div className="p-12 rounded-[6rem] bg-white/5 border border-slate-100 shadow-2xl flex items-center gap-12 group relative overflow-hidden transition-all hover:bg-slate-100 cursor-default">
                <div className="h-20 w-20 rounded-full border-4 border-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-[360deg] duration-[2000ms] shadow-3xl">
                    <span className="text-4xl font-black italic serif">👥</span>
                </div>
                <div>
                    <h4 className="text-[14px] uppercase font-black text-indigo-600 tracking-[0.6em] mb-2 leading-none italic">Identity Anchor</h4>
                    <p className="text-xs text-slate-400 leading-relaxed italic truncate font-black">Citizen trust index is baseline across every shard.</p>
                </div>
            </div>
            
            <div className="text-[11px] uppercase tracking-[1.4em] font-black text-slate-300 px-12 text-center italic leading-none">Sync: PERSISTENT</div>
        </div>
      </div>
      
      <div className="mt-32 text-[12px] uppercase tracking-[1.8em] font-black text-slate-300 flex items-center gap-24">
          <div className="h-px w-64 bg-slate-200 shadow-sm" />
          Citizenship status: ABSOLUTE
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
