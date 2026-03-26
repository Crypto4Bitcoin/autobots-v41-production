'use client';

import React from 'react';
import { useRegulationStore } from '@/stores/regulationStore';
import { clsx } from 'clsx';
import { Shield, Zap, RefreshCcw, Activity, Ghost } from 'lucide-react';
import { motion } from 'framer-motion';

export const RegulationPanel: React.FC = () => {
  const reg = useRegulationStore();

  const rhythms: ('OFF' | 'LOW' | 'MEDIUM' | 'HIGH' | 'LOCKED')[] = ['OFF', 'LOW', 'MEDIUM', 'HIGH', 'LOCKED'];

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-8 w-full max-w-4xl mx-auto shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Activity className="text-emerald-400" />
          REGULATION BRAIN (V1)
        </h2>
        <div className="flex gap-2">
            <span className={clsx("px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-tighter", 
                reg.factories === 'IDLE' ? "bg-amber-900 text-amber-300" : 
                reg.factories === 'ACTIVE' ? "bg-emerald-900 text-emerald-300 border border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : 
                "bg-slate-800 text-slate-500"
            )}>
                {reg.factories} MODE
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Rhythm Selectors */}
        {[
          { id: 'verifierMesh', label: 'Verifier Mesh', icon: <Zap className="w-4 h-4 text-amber-400" /> },
          { id: 'supervisorMesh', label: 'Supervisor Mesh', icon: <Shield className="w-4 h-4 text-emerald-400" /> },
          { id: 'storageMesh', label: 'Storage Mesh', icon: <RefreshCcw className="w-4 h-4 text-blue-400" /> },
        ].map((layer) => (
          <div key={layer.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <label className="text-xs text-slate-500 uppercase font-bold mb-3 flex items-center gap-2">
              {layer.icon}
              {layer.label}
            </label>
            <div className="flex flex-wrap gap-1 mt-2">
              {rhythms.map((r) => (
                <button
                  key={r}
                  onClick={() => reg.setRhythm(layer.id as any, r)}
                  className={clsx(
                    "px-2 py-1 text-[10px] rounded border transition-all duration-200",
                    reg[layer.id as keyof typeof reg] === r 
                      ? "bg-slate-100 text-slate-900 border-white scale-105 shadow-md"
                      : "bg-transparent text-slate-500 border-slate-800 hover:border-slate-600 hover:text-slate-300"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Binary Toggles */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ghost className={clsx("w-5 h-5", reg.guardianMesh.watch ? "text-indigo-400" : "text-slate-700")} />
              <div>
                <p className="text-sm font-bold text-slate-200">Guardian Watch</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Disposal Guard</p>
              </div>
            </div>
            <button 
                onClick={() => reg.toggleGuardian('watch')}
                className={clsx("w-10 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none flex items-center", reg.guardianMesh.watch ? "bg-indigo-600 justify-end" : "bg-slate-800 justify-start")}
            >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
            </button>
        </div>

        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
           <label className="text-xs text-slate-500 uppercase font-bold mb-3">Avengers Protocol</label>
           <div className="grid grid-cols-3 gap-1">
             {(['OFF', 'PASSIVE', 'INTERCEPT'] as const).map(m => (
               <button 
                 key={m}
                 onClick={() => reg.toggleAvengers(m)}
                 className={clsx("px-2 py-1.5 text-[10px] rounded uppercase font-bold border transition-all", 
                    reg.avengersMode === m 
                     ? "bg-red-900/50 text-red-200 border-red-500" 
                     : "bg-transparent text-slate-600 border-slate-800 hover:border-slate-700 hover:text-slate-400"
                 )}
               >
                 {m}
               </button>
             ))}
           </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
           <label className="text-xs text-slate-500 uppercase font-bold mb-3">Factory Activity</label>
           <div className="grid grid-cols-3 gap-1">
             {(['OFF', 'IDLE', 'ACTIVE'] as const).map(m => (
               <button 
                 key={m}
                 onClick={() => reg.toggleFactory(m)}
                 className={clsx("px-2 py-1.5 text-[10px] rounded uppercase font-bold border transition-all", 
                    reg.factories === m 
                     ? "bg-amber-900/50 text-amber-200 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]" 
                     : "bg-transparent text-slate-600 border-slate-800 hover:border-slate-700 hover:text-slate-400"
                 )}
               >
                 {m}
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
                <div className={clsx("w-2 h-2 rounded-full", reg.mainBrain ? "bg-emerald-500" : "bg-red-500")} /> Core Brain
            </span>
            <span className="flex items-center gap-1">
                <div className={clsx("w-2 h-2 rounded-full", reg.innerBubble ? "bg-emerald-500" : "bg-red-500")} /> Infinity Bubble
            </span>
         </div>
         <button 
           onClick={() => reg.emergencyShutdown()}
           className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
           EMERGENCY SHUTDOWN
         </button>
      </div>
    </div>
  );
};
