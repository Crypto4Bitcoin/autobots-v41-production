"use client";
import React, { useState, useEffect } from 'react';
import { useRehearsalStore } from '../../../stores/rehearsalStore';
import { useAethelgardStore } from '../../../stores/aethelgardStore';

export default function RehearsalDomain() {
  const rehearsal = useRehearsalStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        rehearsal.syncRehearsal();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const metaScenarios = rehearsal.scenarios || [];

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Liquid-Rose-Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-rose-950/30 via-black to-slate-950" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <header className="relative z-10 text-center mb-24 max-w-4xl px-8 w-full flex justify-between items-end gap-12">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1em] text-rose-500 font-bold mb-4 italic">Interstellar Strategic Rehearsal</p>
            <h1 className="text-6xl font-black tracking-tighter text-white mb-6 uppercase italic leading-none">Rehearsal</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-rose-400 border border-white/5 px-12 py-4 rounded-full bg-white/5 shadow-2xl backdrop-blur-3xl transition-transform hover:scale-105">
                <span>Horizon: 100 YEARS</span>
                <span>Scenarios: {metaScenarios.length}</span>
                <span>Status: PERPETUAL</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-4 space-y-12">
            <h3 className="text-[11px] uppercase tracking-[0.6em] text-white/40 mb-10 font-black italic px-4">Scenario Library</h3>
            <div className="space-y-8">
                {metaScenarios.map(sc => (
                    <button 
                        key={sc.id} 
                        onClick={() => { setActiveScenarioId(sc.id); rehearsal.selectScenario(sc.id); }}
                        className={`w-full p-12 rounded-[4.5rem] border transition-all duration-1000 text-left relative overflow-hidden group active:scale-95 ${
                            activeScenarioId === sc.id ? 'bg-rose-500/10 border-rose-500/40 text-white shadow-2xl' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-8">
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest px-4 py-1.5 bg-rose-500/10 rounded-full border border-rose-500/30 italic">{sc.horizon_years} YRS</span>
                            <div className={`h-4 w-4 rounded-full transition-all duration-1000 ${activeScenarioId === sc.id ? 'bg-rose-500 shadow-[0_0_20px_rose]' : 'bg-white/20'}`} />
                        </div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic transition-colors leading-none group-hover:text-rose-400">{sc.name}</h4>
                        <div className="text-[9px] uppercase tracking-[0.5em] opacity-40 italic">Status: ALIGNED</div>
                    </button>
                ))}
            </div>
        </div>

        <div className="col-span-8 flex flex-col h-full grow">
            <h3 className="text-[11px] uppercase tracking-[0.6em] text-white/40 mb-10 font-black italic px-4">Simulation Console</h3>
            <div className="flex-1 p-20 rounded-[6rem] bg-white/5 border border-white/1 flex flex-col justify-between group h-[650px] relative overflow-hidden transition-all duration-1000 hover:shadow-[0_0_100px_rgba(244,63,94,0.1)]">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <div className="absolute top-0 right-0 p-16">
                   <div className="flex items-center gap-6">
                        <div className={`h-4 w-4 rounded-full transition-all duration-1000 ${rehearsal.isSimulating ? 'bg-rose-500 animate-ping shadow-[0_0_20px_rose]' : 'bg-rose-950 shadow-inner'}`} />
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-[1em] italic">SYNC</span>
                   </div>
                </div>

                <div className="relative z-10 flex-1 flex flex-col justify-center">
                    {rehearsal.selectedScenario ? (
                        <div className="space-y-20">
                            <div className="grid grid-cols-3 gap-12">
                                {[
                                    { label: 'Stability', val: Math.round(rehearsal.selectedScenario.outcomes.stability * 100) + '%' },
                                    { label: 'Growth', val: Math.round(rehearsal.selectedScenario.outcomes.growth * 100) + '%' },
                                    { label: 'Alignment', val: Math.round(rehearsal.selectedScenario.outcomes.alignment * 100) + '%' }
                                ].map(st => (
                                    <div key={st.label} className="p-12 rounded-[4rem] bg-black/60 border border-white/5 text-center group-hover:border-rose-500/20 transition-all duration-1000">
                                        <div className="text-[10px] uppercase font-black text-white/20 mb-3 tracking-[0.6em] italic">{st.label}</div>
                                        <div className="text-5xl font-black text-white tracking-tighter italic group-hover:text-rose-400 leading-none">{st.val}</div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="p-16 rounded-[5.5rem] bg-rose-950/20 border border-rose-500/20 shadow-2xl relative overflow-hidden group/narr">
                                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent opacity-0 group-hover/narr:opacity-100 transition-opacity" />
                                <h5 className="text-[10px] uppercase font-black text-rose-500 tracking-[0.8em] mb-6 italic">Strategic Narrative</h5>
                                <p className="text-3xl font-serif italic text-rose-100 leading-relaxed relative z-10">&quot;{rehearsal.selectedScenario.outcomes.narrative}&quot;</p>
                            </div>

                            <div className="flex justify-center">
                                <button 
                                    onClick={() => rehearsal.runRehearsal(rehearsal.selectedScenario!.id)}
                                    className="px-24 py-8 bg-rose-600 text-white rounded-full text-[11px] font-black uppercase tracking-[1em] hover:bg-rose-500 transition-all shadow-2xl active:scale-95 border border-rose-400/30 italic"
                                >
                                    {rehearsal.isSimulating ? 'REHEARSING TIMELINE...' : 'EXECUTE REHEARSAL'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-48 text-center opacity-10 filter blur-[1px]">
                             <div className="h-32 w-32 rounded-full border-4 border-white/10 flex items-center justify-center mb-10 transform -rotate-12">
                                <span className="text-6xl font-black italic serif">?</span>
                             </div>
                             <p className="text-[11px] uppercase tracking-[1em] font-black italic">Select a long-horizon scenario to begin simulation.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mt-12 p-12 rounded-[5.5rem] bg-white/5 border border-white/1 shadow-2xl flex justify-between items-center group transition-all hover:bg-white/10">
                <div className="flex items-center gap-12 px-12 relative z-10">
                   <div className="h-20 w-20 rounded-full border border-rose-500/20 flex items-center justify-center text-rose-500 group-hover:bg-rose-600 group-hover:text-white transition-all transform group-hover:rotate-12 duration-1000 shadow-2xl">
                        <span className="text-3xl font-black italic serif">🎭</span>
                    </div>
                    <div>
                        <h4 className="text-[12px] uppercase font-black text-rose-400 tracking-[0.6em] mb-2 italic">Rehearsal Guidance</h4>
                        <p className="text-xs text-white/30 leading-relaxed italic truncate font-black">Strategy is the collective memory of the future.</p>
                    </div>
                </div>
                <div className="flex gap-16 px-16 relative z-10">
                   <div className="text-right border-r border-white/5 pr-12">
                        <span className="text-[10px] uppercase font-black text-white/20 tracking-[0.4em] block mb-2 italic">Stress Test Vector</span>
                        <span className="text-2xl font-black text-rose-400 uppercase italic tracking-tighter">MAXIMUM</span>
                   </div>
                </div>
            </div>
        </div>
      </div>

      <div className="mt-24 text-[11px] uppercase tracking-[1.4em] font-black text-white/20 flex items-center gap-24">
          <div className="h-px w-64 bg-white/5" />
          Rehearsal status: ABSOLUTE
          <div className="h-px w-64 bg-white/5" />
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
