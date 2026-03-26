'use client';

import React from 'react';
import { useHamsaStore } from '@/stores/hamsaStore';
import { useEconomyStore } from '@/stores/economyStore';
import { worldTheme } from '@/lib/world/theme';
import WorldButton from '@/components/world/ui/WorldButton';

export default function HamsaPage() {
  const { assets, cycleProgress, totalPortfolioValue, marketSentiment, analyzeMarket, liquidateAsset } = useHamsaStore();
  const { sovereignCredits } = useEconomyStore();

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <div className="flex justify-between items-end mb-12 border-b border-amber-900 pb-6">
        <div>
          <h1 className={worldTheme.heading + " text-amber-400"}>HAMSA INTELLIGENCE</h1>
          <p className={worldTheme.sectionLabel + " text-amber-700"}>Real Estate Cycle Analysis // 18-Year Temporal Lineage</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-amber-900 mb-1 font-bold tracking-widest uppercase italic font-black animate-pulse">Cycle Progress</div>
          <div className="text-6xl font-black text-amber-500 tabular-nums">
            {cycleProgress}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8">
           <div className="grid grid-cols-3 gap-6 mb-8">
             <div className={worldTheme.panel + " border-amber-900 !bg-amber-950/20"}>
                <div className="text-[10px] text-amber-800 font-bold mb-1 tracking-widest uppercase">Portfolio Value</div>
                <div className="text-3xl font-black text-amber-400 tabular-nums">{totalPortfolioValue}¢</div>
             </div>
             <div className={worldTheme.panel + " border-amber-900 !bg-amber-950/20"}>
                <div className="text-[10px] text-amber-800 font-bold mb-1 tracking-widest uppercase">Market Sentiment</div>
                <div className="text-3xl font-black text-amber-400 uppercase italic">{marketSentiment}</div>
             </div>
             <div className={worldTheme.panel + " border-amber-900 !bg-amber-950/20"}>
                <div className="text-[10px] text-amber-800 font-bold mb-1 tracking-widest uppercase">Available Capital</div>
                <div className="text-3xl font-black text-amber-400 tabular-nums">{sovereignCredits}¢</div>
             </div>
           </div>

           <h2 className="text-xs font-bold text-amber-800 tracking-tighter uppercase mb-6 px-4">Asset Portfolio</h2>
           <div className="space-y-4">
             {assets.map((asset) => (
                <div key={asset.id} className={worldTheme.panel + " border-amber-900 transition-all hover:border-amber-500"}>
                   <div className="flex justify-between items-center">
                      <div>
                         <div className="text-xs text-amber-700 font-bold opacity-50 mb-1">{asset.location}</div>
                         <div className="text-xl font-bold text-amber-100 uppercase italic">{asset.name}</div>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] text-amber-700 font-bold uppercase mb-1">Current Value</div>
                         <div className="text-2xl font-black text-amber-400 tabular-nums">{asset.currentValue}¢</div>
                      </div>
                      <div className="ml-8 border-l border-amber-950 pl-8">
                         <div className="text-[10px] text-amber-700 font-bold uppercase mb-1">Yield Index</div>
                         <div className="text-2xl font-black text-amber-500 tabular-nums">{asset.yield || 0}%</div>
                      </div>
                      <div className="ml-8">
                         <WorldButton 
                            variant="action" 
                            className="!border-amber-500 !text-amber-500 bg-amber-950/20 hover:!bg-amber-500 hover:!text-black"
                            onClick={() => liquidateAsset(asset.id)}
                         >
                            EXIT POSITION
                         </WorldButton>
                      </div>
                   </div>
                </div>
             ))}
           </div>
        </div>

        <div className="col-span-4 space-y-8">
           <div className={worldTheme.panel + " border-amber-900 !bg-amber-950/10"}>
              <h3 className="text-xs font-black text-amber-700 uppercase mb-4 tracking-widest italic">Temporal Cycle Engine</h3>
              <p className="text-sm text-amber-100/60 leading-relaxed mb-6 italic">
                The 18-year real estate cycle is at phase {cycleProgress}%. Current indicators suggest {marketSentiment === 'bull' ? 'growth expansion' : marketSentiment === 'correction' ? 'liquidity risk' : 'accumulation opportunity'}.
              </p>
              <div className="h-2 bg-amber-950 rounded-full overflow-hidden mb-8">
                 <div className="h-full bg-gradient-to-r from-amber-700 to-amber-400" style={{ width: `${cycleProgress}%` }} />
              </div>
              <WorldButton 
                 className="w-full !bg-amber-500 !text-black !font-black !py-4"
                 onClick={analyzeMarket}
              >
                 RE-CALIBRATE CYCLE SENSORS
              </WorldButton>
           </div>
           
           <div className="p-8 border border-amber-900/30 bg-amber-950/5">
              <div className="text-[10px] text-amber-800 font-black mb-4 uppercase text-center tracking-widest">Shard Equity Pulse</div>
              <div className="text-xs text-amber-500 leading-tight space-y-2 font-black italic">
                 <div>// SYNC_REAL_ESTATE_LATTICE: STABLE</div>
                 <div>// HISTORICAL_PARITY_MATCH: 99.4%</div>
                 <div>// EQUITY_RESERVE: SHOCKED</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}