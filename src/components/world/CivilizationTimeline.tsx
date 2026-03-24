'use client';
import React from 'react';
import { motion } from 'framer-motion';

const eras = [
  { id: 'genesis', label: 'Genesis', active: true },
  { id: 'industrial', label: 'Industrial', active: true },
  { id: 'territory', label: 'Territory', active: true },
  { id: 'economic', label: 'Economic', active: false },
  { id: 'inst', label: 'Institutional', active: false },
  { id: 'civ', label: 'Civilizational', active: false },
];

export const CivilizationTimeline = () => {
  return (
    <div className="w-full px-20">
      <div className="relative h-12 flex items-center">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2" />
        <div className="absolute top-1/2 left-0 w-1/2 h-[1px] bg-blue-500/50 -translate-y-1/2 shadow-[0_0_10px_#3b82f6]" />

        <div className="relative w-full flex justify-between">
          {eras.map((era, i) => (
            <div key={era.id} className="relative flex flex-col items-center">
               <motion.div 
                 className={"w-3 h-3 rounded-full border-2 transition-all " + (era.active ? 'bg-blue-500 border-blue-400 shadow-[0_0_100px_#3b82f6]' : 'bg-black border-white/20')}
               />
               <span className={"text-[8px] font-black uppercase mt-4 tracking-[0.3em] " + (era.active ? 'text-white' : 'text-white/20')}>
                 {era.label}
               </span>
               {era.active && i === 2 && (
                  <div className="absolute -top-8 px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded text-[6px] font-mono text-blue-400 uppercase tracking-widest whitespace-nowrap">
                    CURRENT ERA: V38.0
                  </div>
               )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
