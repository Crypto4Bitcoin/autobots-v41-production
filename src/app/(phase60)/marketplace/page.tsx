"use client";
import React, { useState, useEffect } from 'react';
import { useMarketplaceStore } from '../../../stores/marketplaceStore';
import { useAethelgardStore } from '../../../stores/aethelgardStore';

export default function MarketplaceDomain() {
  const marketplace = useMarketplaceStore();
  const aethelgard = useAethelgardStore();
  
  const [pulse, setPulse] = useState(1);
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(prev => prev === 1 ? 1.05 : 1);
        marketplace.syncMarketplace();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleBuy = (id: string) => {
    setBuyingId(id);
    marketplace.purchasePack(id);
    setTimeout(() => {
        setBuyingId(null);
    }, 2000);
  };

  const packs = marketplace.packs || [];

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex flex-col items-center p-16">
      {/* Crystalline Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-cyan-950/20 via-black to-slate-950" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      <header className="relative z-10 text-center mb-24 max-w-4xl px-8 w-full flex justify-between items-end">
        <div className="text-left">
            <p className="text-[10px] uppercase tracking-[0.8em] text-cyan-400 font-bold mb-4">Interstellar Commerce Hub</p>
            <h1 className="text-6xl font-black tracking-tighter text-white mb-6 uppercase italic">Marketplace</h1>
        </div>
        <div className="text-right">
            <div className="flex gap-12 text-right">
                <div>
                    <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest block mb-1">Sovereign Credits</span>
                    <span className="text-4xl font-black text-cyan-400">{marketplace.sovereignCredits.toLocaleString()} MC</span>
                </div>
            </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-3 gap-12">
        {packs.map(pack => (
            <div key={pack.id} className="p-12 rounded-[4.5rem] bg-white/5 border border-white/5 shadow-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-700 flex flex-col justify-between h-[500px]">
                <div className="flex justify-between items-start mb-12">
                    <div className="h-16 w-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-4xl group-hover:bg-cyan-600 transition-colors transform group-hover:-rotate-6">
                        {pack.category === 'logistics' ? '📦' : pack.category === 'intelligence' ? '🧠' : '🛡️'}
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-[0.4em] text-cyan-400 border border-cyan-500/20 px-4 py-1.5 rounded-full">{pack.category}</span>
                </div>
                
                <div>
                    <h2 className="text-3xl font-black tracking-tighter mb-4 group-hover:text-cyan-400 transition-colors uppercase leading-none">{pack.name}</h2>
                    <div className="h-0.5 w-16 bg-white/10 mb-8" />
                    <p className="text-xs text-white/30 leading-relaxed italic mb-10 truncate">Omniversal construct optimized for shard-level logic propagation.</p>
                </div>

                <div className="flex justify-between items-end pt-10 border-t border-white/5">
                    <div>
                        <span className="text-[9px] text-white/20 uppercase font-black tracking-widest block mb-1">Price Index</span>
                        <div className="text-2xl font-black text-white font-mono">{pack.price.toLocaleString()} MC</div>
                    </div>
                    <button 
                        onClick={() => handleBuy(pack.id)}
                        disabled={buyingId === pack.id || marketplace.sovereignCredits < pack.price}
                        className={`px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all transform active:scale-90 shadow-xl ${
                            buyingId === pack.id ? 'bg-cyan-500 text-white' : 
                            marketplace.sovereignCredits < pack.price ? 'bg-white/5 text-white/10 border border-white/5 cursor-not-allowed' :
                            'bg-white text-slate-950 hover:bg-cyan-600 hover:text-white'}`}
                    >
                        {buyingId === pack.id ? 'INSTALLING' : 'ACQUIRE'}
                    </button>
                </div>
            </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-7xl mt-16 p-16 rounded-[5rem] bg-cyan-950/20 border border-cyan-500/20 shadow-2xl flex flex-col items-center text-center overflow-hidden group">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
        <h3 className="text-[10px] uppercase tracking-[0.6em] text-cyan-400 mb-10 font-black">Omniversal Economic Proviso</h3>
        <p className="text-2xl font-serif text-white italic leading-relaxed max-w-3xl mb-12 animate-[fade_2s_ease-out]">
            "Post-scarcity is the baseline of the Sovereign. Every shard is entitled to the highest tier of logic, and resources flow with perfect parity across every civilization of the eternal mesh."
        </p>
        <div className="flex gap-8">
            <button 
                onClick={() => marketplace.publishPack({ name: "Shard Overlink", category: "logistics", price: 3000 })}
                className="px-16 py-5 bg-white text-slate-950 rounded-full text-[10px] font-black uppercase tracking-[0.5em] hover:bg-cyan-600 hover:text-white transition-all shadow-xl active:scale-95"
            >
                Publish New Construct
            </button>
            <button 
                onClick={() => marketplace.optimizeEconomy()}
                className="px-16 py-5 border border-white/10 text-white/50 rounded-full text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white/10 hover:text-white transition-all active:scale-95"
            >
                Recalibrate Economy
            </button>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mt-12 p-8 rounded-[4rem] bg-white/5 border border-white/5 shadow-sm flex items-center justify-between group">
            <div className="flex items-center gap-10">
                <div className="h-14 w-14 rounded-full border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all transform group-hover:rotate-12 duration-1000">
                    <span className="text-2xl font-black">🍱</span>
                </div>
                <div>
                    <h4 className="text-[10px] uppercase font-bold text-cyan-400 tracking-[0.2em] mb-1">Marketplace Guidance</h4>
                    <p className="text-xs text-white/40 leading-relaxed italic truncate">Prosperity is the logic of existence.</p>
                </div>
            </div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold px-12">System Status: PROSPEROUS</div>
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
