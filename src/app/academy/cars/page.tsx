'use client';

import React from 'react';
import { useCarStore } from '@/stores/carStore';
import { useEconomyStore } from '@/stores/economyStore';
import { worldTheme } from '@/lib/world/theme';
import WorldButton from '@/components/world/ui/WorldButton';

export default function CarPage() {
  const { fleet, totalFleetValue, operationalEfficiency, retireCar, calculateEfficiency } = useCarStore();

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <div className="flex justify-between items-end mb-12 border-b border-slate-700 pb-6">
        <div>
          <h1 className={worldTheme.heading + " text-slate-300"}>CAR INTELLIGENCE</h1>
          <p className={worldTheme.sectionLabel + " text-slate-500"}>Fleet Management // Autonomous Logistics Mesh</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-700 mb-1 font-bold tracking-widest uppercase">Efficiency Index</div>
          <div className="text-6xl font-black text-slate-100 tabular-nums">
            {operationalEfficiency.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12">
           <div className="grid grid-cols-4 gap-6 mb-12">
              <div className={worldTheme.panel + " border-slate-800"}>
                 <div className="text-[10px] text-slate-600 font-bold mb-1 uppercase tracking-widest">Fleet Valuation</div>
                 <div className="text-3xl font-black text-slate-200 tabular-nums">{totalFleetValue}¢</div>
              </div>
              <div className={worldTheme.panel + " border-slate-800"}>
                 <div className="text-[10px] text-slate-600 font-bold mb-1 uppercase tracking-widest">Active Units</div>
                 <div className="text-3xl font-black text-slate-200 tabular-nums">{fleet.filter(c => c.status === 'active').length}</div>
              </div>
              <div className={worldTheme.panel + " border-slate-800"}>
                 <div className="text-[10px] text-slate-600 font-bold mb-1 uppercase tracking-widest">Collector Alpha</div>
                 <div className="text-3xl font-black text-slate-400 italic">POSITIVE</div>
              </div>
              <div className="flex items-center">
                 <WorldButton 
                   className="w-full !bg-slate-100 !text-black !font-black !py-4"
                   onClick={calculateEfficiency}
                 >
                    SYNC LOGISTICS
                 </WorldButton>
              </div>
           </div>

           <h2 className="text-xs font-bold text-slate-600 tracking-tighter uppercase mb-6 px-4">Autonomous Fleet Registry</h2>
           <div className="grid grid-cols-2 gap-6">
             {fleet.map((car) => (
                <div key={car.id} className={worldTheme.panel + " border-slate-800 hover:border-slate-500 transition-all group"}>
                   <div className="flex justify-between items-start mb-6">
                      <div>
                         <div className="text-xs text-slate-600 font-bold mb-1 opacity-50 uppercase tracking-widest">{car.type} VEHICLE</div>
                         <div className="text-2xl font-black text-slate-100 group-hover:text-white transition-colors uppercase italic leading-none">{car.model}</div>
                      </div>
                      <div className={`px-3 py-1 text-[10px] font-black rounded ${
                        car.status === 'active' ? 'bg-slate-700 text-slate-100 animate-pulse' : 'bg-slate-900 text-slate-700'
                      }`}>
                        {car.status.toUpperCase()}
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-8 mb-8">
                      <div>
                         <div className="text-[10px] text-slate-600 font-bold mb-1 uppercase">Asset Value</div>
                         <div className="text-xl font-bold text-slate-300 tabular-nums">{car.value}¢</div>
                      </div>
                      <div>
                         <div className="text-[10px] text-slate-600 font-bold mb-1 uppercase">Utility</div>
                         <div className="text-xl font-bold text-slate-300 tabular-nums">%{car.utilityIndex}</div>
                      </div>
                      <div>
                         <div className="text-[10px] text-slate-600 font-bold mb-1 uppercase">Depreciation</div>
                         <div className={`text-xl font-bold tabular-nums ${car.depreciationRate < 0 ? 'text-green-500' : 'text-slate-400'}`}>
                            {car.depreciationRate < 0 ? '↑' : '↓'}{Math.abs(car.depreciationRate)}%
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex gap-4">
                      <WorldButton 
                        variant="ghost" 
                        className="flex-1 !border-slate-800 !text-slate-500 hover:!bg-slate-800 hover:!text-white"
                        onClick={() => {}}
                      >
                         DIAGNOSTICS
                      </WorldButton>
                      <WorldButton 
                        variant="action" 
                        className="flex-1 !border-slate-300 !text-slate-300 hover:!bg-slate-300 hover:!text-black"
                        onClick={() => retireCar(car.id)}
                      >
                         RETIRE ASSET
                      </WorldButton>
                   </div>
                </div>
             ))}
           </div>
        </div>
      </div>
      
      <div className="mt-12 text-center p-8 border border-slate-900/30">
          <p className="text-[10px] text-slate-700 uppercase tracking-[1em] font-black italic animate-pulse">
            // FLEET_INTELLIGENCE_RECURSION_ACTIVE //
          </p>
      </div>
    </div>
  );
}