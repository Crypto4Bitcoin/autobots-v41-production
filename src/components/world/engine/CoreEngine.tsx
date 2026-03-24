'use client';


import React from 'react';
import { motion } from 'framer-motion';

const rings = [
  { id: 'task', label: 'TASK LAYER', color: 'border-blue-400', size: 'w-[500px] h-[500px]', duration: 40, direction: 1 },
  { id: 'level', label: 'LEVEL LAYER', color: 'border-purple-400', size: 'w-[400px] h-[400px]', duration: 35, direction: -1 },
  { id: 'memory', label: 'MEMORY LAYER', color: 'border-emerald-400', size: 'w-[300px] h-[300px]', duration: 30, direction: 1 },
  { id: 'market', label: 'MARKETPLACE', color: 'border-amber-400', size: 'w-[200px] h-[200px]', duration: 25, direction: -1 },
  { id: 'irs', label: 'IRS LAYER', color: 'border-rose-400', size: 'w-[100px] h-[100px]', duration: 20, direction: 1 },
];

export const CoreEngine = () => {
  return (
    <div className="relative flex items-center justify-center w-[600px] h-[600px] bg-black/50 rounded-full backdrop-blur-xl border border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.2)]">
      {/* Central Core Pulse */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-12 h-12 bg-white rounded-full blur-md shadow-[0_0_30px_#fff]"
      />

{/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
      {rings.map((ring, index) => (
        <motion.div
          key={ring.id}
          className={`absolute rounded-full border-2 ${ring.color} ${ring.size} border-dashed opacity-50 flex items-center justify-center`}
          animate={{ rotate: 360 * ring.direction }}
          transition={{ duration: ring.duration, repeat: Infinity, ease: "linear" }}
        >
           {/* Label on the ring */}
           <div 
             className="absolute -top-4 bg-black/80 px-2 py-0.5 rounded border border-white/20 text-[8px] font-bold tracking-widest text-white whitespace-nowrap"
           >
             {ring.label}
           </div>

           {/* Energy Pulse Orbiting the ring */}
           <motion.div 
             className={`absolute w-3 h-3 rounded-full bg-white shadow-[0_0_15px_#fff]`}
             style={{ top: '-6px' }}
             animate={{ scale: [1, 1.5, 1] }}
             transition={{ duration: 2, repeat: Infinity }}
           />
        </motion.div>
      ))}

      {/* Cross-Ring Energy Flow Lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div 
          key={i}
          className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{ transform: `rotate(${i * 45}deg)` }}
        />
      ))}

      <div className="absolute -bottom-12 text-center w-full">
        <h2 className="text-xl font-black italic tracking-tighter text-white uppercase opacity-80">
            Circle of Life <span className="text-blue-500">Engine</span>
        </h2>
        <p className="text-[10px] text-white/40 tracking-[0.2em]">KINETIC EQUILIBRIUM ACTIVE</p>
      </div>
    </div>
  );
};
