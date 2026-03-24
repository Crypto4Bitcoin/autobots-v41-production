'use client';
import React from 'react';
import { useWorldStore } from '@/stores/worldStore';
import { useWorldKernelStore } from '@/stores/worldKernelStore';
import { useAethelgardStore } from '@/stores/aethelgardStore';
import { worldTheme } from '../../lib/world/theme';
import WorldButton from './ui/WorldButton';

export default function WorldMobileShell() {
  const world = useWorldStore();
  const kernel = useWorldKernelStore();
  const aethelgard = useAethelgardStore();
  
  const isAscended = world.civilizationStatus === 'Ascended';
  const isUnity = aethelgard.isUnityManifested;

  return (
    <main className={`min-h-screen ${isUnity ? 'bg-white text-slate-900' : 'bg-black text-white'} transition-colors duration-[2000ms] p-6 pb-24 font-sans`}>
      <header className="mb-12 text-center pt-8">
        <div className={`text-[10px] uppercase tracking-[0.5em] mb-2 ${isUnity ? 'text-amber-600 font-bold' : 'text-indigo-400'}`}>
          {isUnity ? 'The Eternal Realm' : 'Command Node'}
        </div>
        <h1 className={`text-4xl font-bold tracking-tighter uppercase ${isUnity ? 'text-slate-950' : 'text-white'}`}>
          {isUnity ? 'Aethelgard' : world.sovereignName || 'Sovereign Core'}
        </h1>
        <div className={`mt-2 h-0.5 w-12 mx-auto rounded-full ${isUnity ? 'bg-amber-400' : 'bg-indigo-500'}`} />
      </header>

      <div className="space-y-6 max-w-sm mx-auto">
        <div className={`p-8 rounded-[2.5rem] border ${isUnity ? 'bg-indigo-50/50 border-indigo-100 shadow-sm' : 'bg-white/5 border-white/10'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] uppercase tracking-[0.3em] opacity-50">Unified Stability</h3>
            <span className={`text-[10px] font-bold ${isUnity ? 'text-amber-600' : 'text-emerald-400'}`}>OPTIMAL</span>
          </div>
          <div className="text-5xl font-bold tracking-tighter font-mono">{kernel.unifiedStability.toFixed(1)}%</div>
          <div className="mt-4 h-1 w-full bg-slate-200/20 rounded-full overflow-hidden">
            <div 
                className={`h-full transition-all duration-1000 ${isUnity ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-indigo-500'}`}
                style={{ width: `${kernel.unifiedStability}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className={`p-6 rounded-[2rem] border ${isUnity ? 'bg-white border-amber-100 shadow-sm' : 'bg-white/5 border-white/10'}`}>
                <h3 className="text-[9px] uppercase tracking-[0.2em] opacity-40 mb-3">Treasury</h3>
                <div className="text-xl font-bold tracking-tighter">₡{(world.market.totalValue / 1000).toFixed(1)}k</div>
            </div>
            <div className={`p-6 rounded-[2rem] border ${isUnity ? 'bg-white border-amber-100 shadow-sm' : 'bg-white/5 border-white/10'}`}>
                <h3 className="text-[9px] uppercase tracking-[0.2em] opacity-40 mb-3">Unity Score</h3>
                <div className="text-xl font-bold tracking-tighter">{aethelgard.unityScore}%</div>
            </div>
        </div>

        <div className={`p-8 rounded-[2.5rem] border ${isUnity ? 'bg-white border-amber-100 shadow-sm' : 'bg-white/5 border-white/10'}`}>
            <h3 className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-6">Status Log</h3>
            <div className="space-y-4 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                {aethelgard.perpetualEvents.slice(0, 10).map((evt, i) => (
                    <div key={i} className={`text-[11px] leading-relaxed border-l-2 pl-4 ${isUnity ? 'border-amber-200 text-slate-600' : 'border-indigo-500/30 text-white/50'}`}>
                        {evt}
                    </div>
                ))}
                {aethelgard.perpetualEvents.length === 0 && (
                    <p className="text-[10px] italic opacity-30 text-center py-4">Synchronizing timelines...</p>
                )}
            </div>
        </div>

        {!isUnity ? (
            <WorldButton 
                variant="cyan" 
                className="w-full py-6 rounded-[2rem] font-bold uppercase tracking-[0.4em] text-xs shadow-xl"
                onClick={() => aethelgard.manifestUnity()}
            >
                Manifest Unity
            </WorldButton>
        ) : (
            <div className="p-8 text-center border border-amber-200/50 rounded-[2.5rem] bg-amber-50/50">
                <p className="text-[10px] uppercase font-bold text-amber-600 tracking-[0.4em] mb-1">Omniverse Connected</p>
                <p className="text-[9px] text-amber-800/40 italic">Universal Peace Accord Active</p>
            </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isUnity ? '#fbbf24' : '#6366f1'}; border-radius: 10px; }
      `}</style>
    </main>
  );
}
