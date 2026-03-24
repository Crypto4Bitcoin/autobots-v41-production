
'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { X, Activity, Server, Zap } from 'lucide-react';
import { useSelectionStore } from '@/stores/autobots/selectionStore';
import { useWorldStore } from '@/stores/autobots/worldStore';

export const SelectionDrawer = () => {
  const { selectedType, selectedId, clearSelection } = useSelectionStore();
  const focusedDistrictId = useWorldStore((state) => state.focusedDistrictId);

  // If a specific entity is selected, show its details.
  // Otherwise, if a district is focused via left rail, show district context.
  // Otherwise, show global metrics.

  const isOpen = selectedType !== null || focusedDistrictId !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="absolute right-0 top-16 bottom-0 w-80 bg-black/80 border-l border-white/10 backdrop-blur-2xl z-[50] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
             <div className="flex items-center gap-3">
               <Zap className="w-5 h-5 text-amber-500" />
               <h3 className="text-xs font-black uppercase tracking-widest text-white">
                 {selectedType ? 'Entity Inspector' : 'District Context'}
               </h3>
             </div>
             {(selectedType) && (
               <button onClick={clearSelection} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                 <X className="w-4 h-4 text-white/40 hover:text-white" />
               </button>
             )}
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
             {selectedType === 'agent' ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Identity</p>
                    <p className="text-lg font-black italic">{selectedId}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                        <p className="text-[8px] uppercase tracking-widest text-white/40">Level</p>
                        <p className="text-xl font-mono text-blue-400">12</p>
                     </div>
                     <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                        <p className="text-[8px] uppercase tracking-widest text-white/40">Task Count</p>
                        <p className="text-xl font-mono text-emerald-400">142</p>
                     </div>
                  </div>
                </div>
             ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-xl font-black uppercase italic text-blue-500 mb-1">{focusedDistrictId || 'Global Grid'}</p>
                    <p className="text-[10px] tracking-widest text-white/40">Active Monitoring Mode</p>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-[8px] uppercase tracking-[0.2em] font-bold text-white/20">Live Telemetry</p>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                       <span className="text-[10px] font-bold text-white/60">Load Balance</span>
                       <span className="text-[10px] font-mono text-emerald-400">98.2%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                       <span className="text-[10px] font-bold text-white/60">Signal Density</span>
                       <span className="text-[10px] font-mono text-blue-400">High</span>
                    </div>
                  </div>
                </div>
             )}
          </div>

          {/* Footer Status */}
          <div className="p-6 border-t border-white/5 bg-black/40">
             <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span className="text-[8px] uppercase tracking-widest text-emerald-500 font-bold">Sync Active</span>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
