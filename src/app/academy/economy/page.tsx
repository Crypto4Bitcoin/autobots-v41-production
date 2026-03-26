"use client";
import React, { useState, useEffect } from 'react';
import { useEconomyStore } from '../../../stores/economyStore';
import { useAethelgardStore } from '../../../stores/aethelgardStore';

export default function PricingDomain() {
  const economy = useEconomyStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);
  const [activeTierId, setActiveTierId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        economy.syncEconomy();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const tiers = economy.tiers || [];

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans relative overflow-hidden flex flex-col items-center p-16">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-amber-50 via-white to-slate-100" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <header className="relative z-10 text-center mb-24 max-w-4xl px-8 w-full flex justify-between items-end gap-12">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[1em] text-amber-600 font-bold mb-4 italic">Interstellar Economic Framework</p>
            <h1 className="text-6xl font-black tracking-tighter text-slate-950 mb-6 uppercase italic leading-none">Prosperity</h1>
        </div>
        <div className="text-right">
             <div className="flex gap-12 text-[11px] uppercase tracking-widest text-amber-600 border border-amber-100 px-12 py-4 rounded-full bg-white/50 backdrop-blur shadow-sm transition-transform hover:scale-105">
                <span>Value Index: {economy.marketValue.toFixed(1)}</span>
                <span>Sovereign Credits: {economy.sovereignCredits.toLocaleString()}</span>
                <span>Status: PERPETUAL</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-3 gap-16">
        {tiers.map(tier => (
            <div 
                key={tier.id} 
                className={`p-16 rounded-[6rem] border transition-all duration-1000 flex flex-col justify-between group h-[650px] relative overflow-hidden scale-95 hover:scale-100 ${
                    activeTierId === tier.id ? 'bg-slate-900 text-white border-slate-800 shadow-[0_50px_100px_-20px_rgba(15,23,42,0.4)] z-10' : 'bg-white border-slate-100 hover:border-amber-300'
                }`}
            >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex justify-between items-start mb-12">
                    <div className={`h-4 w-4 rounded-full ${activeTierId === tier.id ? 'bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,1)]' : 'bg-amber-400 opacity-20'}`} />
                    <span className={`text-[10px] uppercase tracking-widest font-black italic ${activeTierId === tier.id ? 'text-white/40' : 'text-slate-300'}`}>{tier.id}</span>
                </div>
                
                <div className="relative z-10">
                    <h3 className={`text-4xl font-black text-slate-950 uppercase tracking-tighter mb-4 italic transition-colors leading-none ${activeTierId === tier.id ? 'text-white' : 'text-slate-950 group-hover:text-amber-600'}`}>{tier.name}</h3>
                    <div className="flex items-baseline gap-2 mb-10">
                        <span className={`text-7xl font-black tracking-tight ${activeTierId === tier.id ? 'text-white' : 'text-slate-950'}`}>${tier.price}</span>
                        <span className={`text-[10px] uppercase font-black tracking-widest ${activeTierId === tier.id ? 'text-white/40' : 'text-slate-300'}`}>/ EON</span>
                    </div>
                    
                    <ul className="space-y-6">
                        {tier.features.map((f, i) => (
                            <li key={i} className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-4 transition-all duration-700 ${activeTierId === tier.id ? 'text-white/80' : 'text-slate-400 group-hover:text-slate-950'}`}>
                                <div className={`h-1.5 w-1.5 rounded-full ${activeTierId === tier.id ? 'bg-amber-400' : 'bg-amber-400/20 group-hover:bg-amber-400'}`} />
                                {f}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="pt-12 relative z-10">
                    <button 
                        onClick={() => {
                            setActiveTierId(tier.id);
                            economy.upgradeTier(tier.id);
                        }}
                        className={`w-full py-7 rounded-full text-[11px] font-black uppercase tracking-[0.8em] transition-all shadow-2xl active:scale-90 italic ${
                            activeTierId === tier.id ? 'bg-white text-slate-900' : 'bg-slate-900 text-white hover:bg-amber-600'
                        }`}
                    >
                        {activeTierId === tier.id ? 'ACTIVE SCHEMATIC' : 'UPGRADE CIVILIZATION'}
                    </button>
                </div>
            </div>
        ))}

        <div className="col-span-3 mt-24 p-20 rounded-[7rem] bg-amber-500/10 border border-amber-500/30 shadow-2xl flex items-center justify-between group relative overflow-hidden transition-all duration-1000">
             <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex items-center gap-16 px-12 relative z-10 w-2/3">
                <div className="h-28 w-28 rounded-full border border-amber-500/20 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all transform group-hover:rotate-180 duration-[2000ms] shadow-2xl">
                    <span className="text-5xl font-black italic serif">💰</span>
                </div>
                <div>
                   <h4 className="text-[18px] uppercase font-black text-amber-600 tracking-[0.6em] mb-3 leading-none italic">Omniversal Credit Injection</h4>
                   <p className="text-sm text-slate-500 leading-relaxed italic truncate font-black">Universal credits are distributed across the eternal mesh instantly to ensure resource parity.</p>
                </div>
            </div>
            <div className="flex gap-12 px-20 relative z-10">
                {[5000, 25000].map(amt => (
                   <button 
                    key={amt}
                    onClick={() => economy.purchaseCredits(amt)}
                    className="px-16 py-7 bg-slate-900 text-white rounded-full text-[11px] font-black uppercase tracking-[1em] hover:bg-amber-600 transition-all shadow-2xl active:scale-95 border border-slate-800"
                   >
                       +{amt.toLocaleString()} ℥
                   </button>
                ))}
            </div>
        </div>
      </div>

      <div className="mt-24 text-[11px] uppercase tracking-[1.4em] font-black text-slate-300 flex items-center gap-24">
          <div className="h-px w-64 bg-slate-200" />
          Economic Anchor: ABSOLUTE
          <div className="h-px w-64 bg-slate-200" />
      </div>
    </div>
  );
}