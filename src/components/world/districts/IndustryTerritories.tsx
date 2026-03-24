'use client';
import React from 'react';
import { motion } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Globe, TowerControl as Tower, Cpu } from 'lucide-react';

export const IndustryTerritories = () => (
  <div className="flex flex-col items-center gap-12">
    <div className="relative w-80 h-80 flex items-center justify-center">
      {/* Narrative Hubs */}
      {[
        { name: 'HVAC', color: 'text-emerald-400', pos: 'top-0' },
        { name: 'FINANCE', color: 'text-blue-400', pos: 'right-0' },
        { name: 'CRYPTO', color: 'text-purple-400', pos: 'bottom-0' },
        { name: 'PLUMBING', color: 'text-amber-400', pos: 'left-0' },
      ].map((t, i) => (
        <motion.div
          key={i}
          className={`absolute ${t.pos} w-24 h-24 bg-black/40 border border-white/10 rounded-2xl flex flex-col items-center justify-center backdrop-blur-md group hover:border-white/50 transition-all`}
          animate={{ scale: [1, 1.05, 1], y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
        >
          <Globe className={`w-8 h-8 ${t.color} mb-2 opacity-50`} />
          <span className="text-[8px] font-black tracking-widest">{t.name}</span>
          
          {/* Memory Tower */}
          <div className="absolute -top-8 w-[1px] h-8 bg-gradient-to-t from-emerald-500 to-transparent" />
          <div className="absolute -top-10 w-2 h-2 rounded-full bg-emerald-400 blur-[2px] animate-pulse" />
        </motion.div>
      ))}

      {/* Center Influence Core */}
      <div className="w-16 h-16 bg-white/5 rounded-full border border-white/20 flex items-center justify-center relative">
         <Cpu className="w-6 h-6 text-white/20" />
         <motion.div 
           animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="absolute inset-0 border border-white/40 rounded-full"
         />
      </div>
    </div>

    <div className="text-center">
      <h3 className="text-emerald-400 font-bold text-sm tracking-[0.4em] uppercase">Industry Territories</h3>
      <p className="text-[8px] text-emerald-400/30 mt-1 italic">V38 Narrative Domain Strategy</p>
    </div>
  </div>
);
