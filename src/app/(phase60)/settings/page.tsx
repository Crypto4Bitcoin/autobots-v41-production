"use client";
import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../../stores/settingsStore';
import { useAethelgardStore } from '../../../stores/aethelgardStore';

export default function SettingsDomain() {
  const settings = useSettingsStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        settings.calibrateLogic();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const policies = settings.policies || [];

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Crystalline Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-amber-50 via-white to-slate-100" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
      
      <header className="relative z-10 text-center mb-24 max-w-4xl px-8">
        <p className="text-[10px] uppercase tracking-[0.8em] text-amber-600 font-bold mb-4">Meta-Logic Configuration</p>
        <h1 className="text-6xl font-black tracking-tighter text-slate-950 mb-6 uppercase">Settings</h1>
        <div className="flex justify-center items-center gap-12 text-[11px] uppercase tracking-widest text-amber-600 border border-amber-100 px-12 py-4 rounded-full bg-white/50 backdrop-blur shadow-sm transition-transform hover:scale-105">
            <span>System Mode: {settings.systemMode.toUpperCase()}</span>
            <span>Encryption: {settings.encryptionLevel}</span>
            <span>Status: ALIGNED</span>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-12 gap-16">
        <div className="col-span-8 space-y-12">
            <div className="p-16 rounded-[4rem] bg-white border border-amber-100 shadow-2xl relative overflow-hidden h-[600px] flex flex-col justify-between group">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-slate-400 mb-10 font-bold">Logic Calibration Suite</h3>
                
                <div className="flex flex-col items-center justify-center h-full">
                    <div 
                        className="w-80 h-80 rounded-full border border-amber-500/10 flex items-center justify-center transition-transform duration-[4000ms] ease-in-out"
                        style={{ transform: `scale(${pulse})` }}
                    >
                        <div className="w-48 h-48 rounded-full border-4 border-amber-500/20 shadow-xl relative">
                            <div className="absolute inset-8 rounded-full bg-amber-500/20 blur-2xl animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-4 w-4 bg-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.8)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {policies.map(policy => (
                    <div key={policy.id} className="p-12 rounded-[3.5rem] bg-white border border-slate-100 shadow-sm group hover:border-amber-200 transition-all duration-500 flex justify-between items-center">
                        <div>
                            <h4 className="text-2xl font-black tracking-tight mb-2 uppercase group-hover:text-amber-600 transition-colors">{policy.name}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed italic truncate">{policy.desc}</p>
                        </div>
                        <button 
                            onClick={() => settings.togglePolicy(policy.id)}
                            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-xl active:scale-95 ${
                                policy.enabled ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'
                            }`}
                        >
                            {policy.enabled ? 'ENABLED' : 'DISABLED'}
                        </button>
                    </div>
                ))}
            </div>
        </div>

        <div className="col-span-4 space-y-8 flex flex-col h-full">
            <div className="p-12 rounded-[5rem] bg-slate-900 border border-slate-800 shadow-2xl text-white flex-1 flex flex-col justify-between overflow-hidden relative group">
                <div className="absolute bottom-0 right-0 p-12 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                    <span className="text-[150px] font-black italic serif">S</span>
                </div>
                <div>
                   <h3 className="text-[10px] uppercase font-bold tracking-[0.4em] text-amber-400 mb-12">Core Configuration</h3>
                   <div className="space-y-10">
                       {[
                           { label: "Logic Latency", val: "0.01ms", color: "text-emerald-400" },
                           { label: "Policy Drift", val: "NOMINAL", color: "text-white" },
                           { label: "Encryption", val: "SECURE", color: "text-amber-400" },
                           { label: "Calibration", val: "NOMINAL", color: "text-white" }
                       ].map(stat => (
                           <div key={stat.label}>
                               <div className="text-[9px] uppercase text-white/30 mb-1 tracking-widest">{stat.label}</div>
                               <div className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.val}</div>
                           </div>
                       ))}
                   </div>
                </div>
                <div className="pt-12 border-t border-white/5 flex gap-4">
                    <button 
                        onClick={() => settings.setSystemMode('autonomous')}
                        className={`w-full py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-xl active:scale-95 ${
                            settings.systemMode === 'autonomous' ? 'bg-amber-500 text-white' : 'bg-white text-slate-950 hover:bg-slate-50'
                        }`}
                    >
                        Autonomous
                    </button>
                    <button 
                        onClick={() => settings.setSystemMode('manual')}
                        className={`w-full py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-xl active:scale-95 ${
                            settings.systemMode === 'manual' ? 'bg-amber-500 text-white' : 'bg-white text-slate-950 hover:bg-slate-50'
                        }`}
                    >
                        Manual
                    </button>
                </div>
            </div>

            <div className="p-12 rounded-[4rem] bg-white border border-slate-100 shadow-sm flex items-center gap-8 group">
                <div className="h-14 w-14 rounded-full border border-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all transform group-hover:rotate-[360deg] duration-[2s]">
                    <span className="text-2xl font-black">⚙️</span>
                </div>
                <div>
                    <h4 className="text-[10px] uppercase font-bold text-amber-600 tracking-[0.2em] mb-1">Logic Guidance</h4>
                    <p className="text-xs text-slate-400 leading-relaxed italic truncate">Global policies are synchronized across every logical node.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
