"use client";
import React, { useState, useEffect } from 'react';
import { useCultureStore } from '../../../stores/cultureStore';
import { useAethelgardStore } from '../../../stores/aethelgardStore';

export default function CultureDomain() {
  const culture = useCultureStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);
  const [selectedPersonaId, setSelectedPersonaId] = useState('per-01');
  const [baseText, setBaseText] = useState('The system logic requires absolute parity across all regional shards to ensure eternal stability.');
  const [adaptedText, setAdaptedText] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        culture.syncCulture();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAdapt = () => {
    const res = culture.synthesizeNarrative(selectedPersonaId, baseText);
    setAdaptedText(res);
  };

  const personas = culture.personas || [];

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans relative overflow-hidden flex flex-col items-center p-16">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-50 via-white to-slate-100" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
      
      <header className="relative z-10 text-center mb-20 max-w-5xl px-8 w-full flex justify-between items-end gap-16">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1.2em] text-indigo-600 font-bold mb-4 italic leading-none">Interstellar Narrative Synthesis</p>
            <h1 className="text-8xl font-black tracking-tighter text-slate-950 mb-6 uppercase italic leading-none">Culture</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-indigo-600 border border-indigo-100 px-12 py-5 rounded-full bg-white/50 backdrop-blur shadow-2xl transition-transform hover:scale-105 italic font-black">
                <span>Resonance: {culture.globalResonance.toFixed(1)}%</span>
                <span>Personas: {personas.length}</span>
                <span>Status: HARMONIZED</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-8 space-y-12 h-full flex flex-col">
            <div className="p-20 rounded-[7rem] bg-white border border-slate-100 shadow-3xl relative overflow-hidden flex flex-col justify-between group transition-all duration-1000 flex-1 h-[600px] hover:shadow-indigo-500/10 hover:shadow-inner">
                <h3 className="text-[11px] uppercase tracking-[0.6em] text-slate-400 mb-10 font-black italic">Civilizational Narrative Studio</h3>
                
                <div className="flex flex-col items-center justify-center h-full">
                    <div 
                        className="w-[450px] h-[450px] rounded-full border border-indigo-500/10 flex items-center justify-center transition-transform duration-[5000ms] ease-in-out"
                        style={{ transform: `scale(${pulse})` }}
                    >
                        <div className="w-[300px] h-[300px] rounded-full border-4 border-indigo-500/10 shadow-3xl relative transition-all duration-1000">
                            <div className="absolute inset-16 rounded-full bg-indigo-500/10 blur-[80px] animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center transform scale-150">
                                <div className="h-4 w-4 bg-indigo-500 rounded-full shadow-[0_0_40px_rgba(99,102,241,1)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mt-12">
                {personas.map(p => (
                    <div 
                        key={p.id} 
                        onClick={() => setSelectedPersonaId(p.id)}
                        className={`p-12 rounded-[5.5rem] bg-white border transition-all duration-1000 h-[420px] flex flex-col justify-between cursor-pointer group active:scale-95 relative overflow-hidden ${
                            selectedPersonaId === p.id ? 'border-indigo-500 shadow-3xl z-10 scale-[1.02]' : 'border-slate-50 hover:border-indigo-300'
                        }`}
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-start mb-10">
                            <div className={`h-4 w-4 rounded-full transition-all duration-1000 ${selectedPersonaId === p.id ? 'bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)]' : 'bg-slate-200 opacity-30 shadow-inner'}`} />
                            <span className={`text-[10px] uppercase tracking-widest font-black italic transition-colors leading-none ${selectedPersonaId === p.id ? 'text-indigo-600 underline' : 'text-slate-300'}`}>{p.id}</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-slate-300 tracking-[0.4em] mb-4 italic">Cultural Persona</p>
                            <h4 className={`text-4xl font-black text-slate-950 uppercase tracking-tighter mb-4 italic transition-colors leading-none group-hover:text-indigo-600`}>{p.name}</h4>
                            <p className="text-[11px] text-slate-400 uppercase tracking-[0.2em] font-black leading-relaxed italic">{p.background}</p>
                            <div className="mt-8 pt-4 border-t border-slate-50 flex justify-between items-center group-hover:border-indigo-100 transition-all duration-1000">
                                <span className="text-[9px] uppercase font-black text-indigo-500/60 tracking-[0.4em] italic">Resonance Index</span>
                                <span className="text-xl font-black text-indigo-600 italic">%{p.resonance}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50/50 p-6 rounded-[3rem] mt-6 relative z-10 group-hover:bg-indigo-50 transition-all duration-1000">
                            <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.4em] italic">IDENTITY MAPPING</span>
                            {selectedPersonaId === p.id && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); culture.increaseResonance(p.id); }}
                                    className="text-[10px] font-black text-white uppercase tracking-[0.6em] px-8 py-3 bg-indigo-600 rounded-full border border-indigo-400 hover:bg-slate-950 transition-all shadow-2xl scale-95 hover:scale-100 active:scale-90 italic"
                                >
                                    Resonate
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="col-span-4 space-y-12 flex flex-col h-full grow">
            <div className="p-16 rounded-[7rem] bg-indigo-950 border border-slate-800 shadow-3xl text-white flex-1 flex flex-col justify-between overflow-hidden relative group h-full">
                <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity transform group-hover:rotate-45 duration-1000">
                    <span className="text-[250px] font-black italic serif leading-none">N</span>
                </div>
                <div className="relative z-10 h-full flex flex-col">
                   <h3 className="text-[11px] uppercase font-black tracking-[0.8em] text-indigo-400 mb-12 italic underline decoration-indigo-500/30 decoration-4 underline-offset-8">Synthesis Engine</h3>
                   <div className="space-y-16 grow flex flex-col">
                       <div className="grow flex flex-col">
                            <label className="text-[10px] uppercase tracking-[0.6em] font-black text-white/20 mb-6 block italic">Base Logic Matrix</label>
                            <textarea 
                                value={baseText}
                                onChange={(e) => setBaseText(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-[5rem] p-12 text-3xl text-white italic font-serif focus:border-indigo-500 outline-none transition-all resize-none shadow-3xl h-64 scrollbar-hide grow leading-relaxed"
                                placeholder="Enter core system logic..."
                            />
                        </div>
                       <div className="space-y-12">
                           {[
                               { label: "Narrative Parity", val: "100%", color: "text-emerald-400" },
                               { label: "Global Resonance", val: culture.globalResonance.toFixed(1) + "%", color: "text-indigo-400" },
                               { label: "Legacy status", val: 'ABSOLUTE', color: "text-white" }
                           ].map(stat => (
                               <div key={stat.label} className="border-l-2 border-white/10 pl-10 py-3 hover:border-indigo-500/50 transition-all duration-1000">
                                   <div className="text-[11px] uppercase text-white/30 mb-3 tracking-[0.5em] font-black italic">{stat.label}</div>
                                   <div className={`text-6xl font-black tracking-tighter ${stat.color} leading-none italic`}>{stat.val}</div>
                                </div>
                           ))}
                       </div>
                   </div>
                </div>
                <div className="pt-20 border-t border-white/5 flex gap-4 relative z-10">
                    <button 
                        onClick={handleAdapt}
                        className="w-full py-8 bg-white text-slate-950 rounded-full text-[12px] font-black uppercase tracking-[1em] hover:bg-indigo-600 hover:text-white transition-all shadow-3xl active:scale-95 italic border-2 border-slate-200"
                    >
                        Synthesize Legacy
                    </button>
                </div>
            </div>

            {adaptedText && (
                <div className="p-20 rounded-[7rem] bg-white border border-slate-100 shadow-3xl flex flex-col gap-10 animate-[fade_2.5s_ease-out_forwards] relative overflow-hidden group hover:border-indigo-200 transition-all duration-1000">
                    <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none transform group-hover:scale-110 duration-[3000ms] group-hover:rotate-12">
                       <span className="text-[200px] font-black italic serif leading-none cursor-default">"</span>
                    </div>
                    <h4 className="text-[12px] uppercase font-black text-indigo-600 tracking-[0.8em] mb-4 italic underline decoration-indigo-500/20 underline-offset-8 decoration-[6px]">Synthesized Directive</h4>
                    <p className="text-4xl text-slate-950 leading-relaxed italic font-serif transition-colors relative z-10 transform group-hover:skew-x-1 duration-1000">"{adaptedText}"</p>
                    <div className="h-2 w-32 bg-indigo-500/20 rounded-full shadow-inner" />
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
