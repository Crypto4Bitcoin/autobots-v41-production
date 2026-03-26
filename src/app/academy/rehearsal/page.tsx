"use client";
import React, { useState, useEffect } from 'react';
import { useRehearsalStore } from '../../../stores/rehearsalStore';
import { worldTheme } from '../../../lib/world/theme';
import WorldButton from '../../../components/world/ui/WorldButton';

export default function RehearsalDomain() {
  const rehearsal = useRehearsalStore();
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        rehearsal.syncRehearsal();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col items-center p-16">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-violet-950/20 via-black to-slate-950" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      
      <header className="relative z-10 text-center mb-20 max-w-5xl px-8 w-full flex justify-between items-end gap-16">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1.2em] text-violet-400 font-bold mb-4 italic leading-none">Interstellar Strategic Rehearsal</p>
            <h1 className="text-8xl font-black tracking-tighter text-white mb-6 uppercase italic leading-none">Rehearsal</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-violet-400 border border-violet-500/20 px-12 py-5 rounded-full bg-white/5 backdrop-blur shadow-2xl transition-all hover:border-violet-400 italic font-black hover:scale-105">
                <span>Scenarios: {rehearsal.scenarios.length}</span>
                <span>Mode: SIMULATING</span>
                <div className={`h-2 w-2 rounded-full ${rehearsal.isSimulating ? 'bg-violet-400 animate-pulse' : 'bg-white/20'}`} />
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-4 space-y-12">
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8 font-bold px-4 italic">Strategic Scenario Registry</h3>
            <div className="space-y-6">
                {rehearsal.scenarios.map((scen, i) => (
                    <div 
                        key={i} 
                        onClick={() => rehearsal.selectScenario(scen.id)}
                        className={`p-10 rounded-[3.5rem] bg-white/5 border transition-all duration-500 cursor-pointer group hover:scale-[1.02] ${
                            rehearsal.selectedScenario?.id === scen.id ? 'border-violet-500 shadow-[0_0_40px_rgba(139,92,246,0.1)]' : 'border-white/5 hover:border-violet-500/30'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[10px] font-black text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20 italic">{scen.horizon_years}Y Horizon</span>
                            <div className="text-right">
                                <span className={`text-[9px] uppercase font-black tracking-widest transition-colors ${rehearsal.selectedScenario?.id === scen.id ? 'text-violet-400' : 'text-white/20'}`}>Scenario</span>
                                <div className="text-2xl font-black text-white italic">{scen.id}</div>
                            </div>
                        </div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-violet-400 transition-colors leading-none">{scen.name}</h4>
                        <div className="h-px w-full bg-white/5 group-hover:bg-violet-500/20 transition-all duration-500" />
                    </div>
                ))}
            </div>
        </div>

        <div className="col-span-8 flex flex-col h-full grow">
             <div className={`flex-1 p-20 rounded-[7rem] bg-white/5 border border-white/5 shadow-3xl relative overflow-hidden flex flex-col justify-between group transition-all duration-1000 ${
                 rehearsal.selectedScenario ? 'border-violet-500/30 shadow-violet-500/10 shadow-inner' : ''
             }`}>
                <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none transform group-hover:rotate-45 duration-1000">
                    <span className="text-[250px] font-black italic serif leading-none">R</span>
                </div>
                
                {rehearsal.selectedScenario ? (
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-[11px] uppercase tracking-[0.8em] text-violet-400 mb-12 font-black italic underline decoration-violet-500/30 decoration-4 underline-offset-8">Simulation Active</h3>
                            <h2 className="text-7xl font-black text-white uppercase tracking-tighter mb-8 italic leading-none">{rehearsal.selectedScenario.name}</h2>
                            <p className="text-2xl text-white/40 leading-relaxed italic font-serif max-w-3xl mb-16">"{rehearsal.selectedScenario.outcomes.narrative}"</p>
                        </div>

                        <div className="grid grid-cols-3 gap-12">
                             {[
                                { label: 'Temporal Stability', val: `%${rehearsal.selectedScenario.outcomes.stability * 100}`, color: 'text-violet-400' },
                                { label: 'Growth Vector', val: `%${rehearsal.selectedScenario.outcomes.growth * 100}`, color: 'text-emerald-400' },
                                { label: 'Logic Alignment', val: `%${rehearsal.selectedScenario.outcomes.alignment * 100}`, color: 'text-white' }
                             ].map(stat => (
                                <div key={stat.label} className="border-l-2 border-white/10 pl-10 py-4 hover:border-violet-500 transition-all duration-500">
                                    <div className="text-[11px] uppercase text-white/30 mb-4 tracking-[0.5em] font-black italic">{stat.label}</div>
                                    <div className={`text-6xl font-black tracking-tighter ${stat.color} leading-none italic`}>{stat.val}</div>
                                </div>
                             ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10">
                        <div className="text-[200px] mb-8 italic serif font-black">?</div>
                        <div className="text-xs uppercase tracking-[1em] font-black italic">Select scenario to initiate temporal rehearsal</div>
                    </div>
                )}
            </div>

            <div className="mt-12 flex gap-8">
                <button 
                    disabled={!rehearsal.selectedScenario || rehearsal.isSimulating}
                    onClick={() => rehearsal.selectedScenario && rehearsal.runRehearsal(rehearsal.selectedScenario.id)}
                    className="flex-1 py-10 bg-white text-slate-950 rounded-[5rem] text-[14px] font-black uppercase tracking-[1.5em] hover:bg-violet-600 hover:text-white transition-all shadow-3xl active:scale-95 italic border-2 border-slate-200 disabled:opacity-20 disabled:grayscale"
                >
                    {rehearsal.isSimulating ? 'SIMULATING...' : 'EXECUTE REHEARSAL'}
                </button>
            </div>
        </div>
      </div>
      
      <div className="mt-32 text-[12px] uppercase tracking-[1.8em] font-black text-white/20 flex items-center gap-24">
          <div className="h-px w-64 bg-white/5 shadow-sm" />
          Strategic Parity: ABSOLUTE
          <div className="h-px w-64 bg-white/5 shadow-sm" />
      </div>
    </div>
  );
}
