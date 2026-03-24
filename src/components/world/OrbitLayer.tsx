'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export const OrbitLayer = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        initial={{ 
          x: (((i * 17) % 100) / 100) * 2000 - 500, 
          y: (((i * 23) % 100) / 100) * 2000 - 500,
          opacity: 0.1
        }}
        animate={{ 
          opacity: [0.1, 0.5, 0.1],
          scale: [1, 1.5, 1],
        }}
        transition={{ 
          duration: 5 + (((i * 11) % 100) / 100) * 10, 
          repeat: Infinity, 
          delay: (((i * 7) % 100) / 100) * 5 
        }}
      >
        <Star className="text-white/20 w-1 h-1" />
      </motion.div>
    ))}

    {[
      { label: 'HVAC CORE', x: '20%', y: '15%', color: 'text-emerald-400' },
      { label: 'FINANCE CORE', x: '75%', y: '10%', color: 'text-blue-400' },
      { label: 'REASONING ALPHA', x: '45%', y: '5%', color: 'text-purple-400' },
    ].map((cluster, i) => (
      <motion.div
        key={i}
        className={"absolute " + cluster.color + " flex flex-col items-center gap-1"}
        style={{ left: cluster.x, top: cluster.y }}
        animate={{ filter: ['brightness(1)', 'brightness(2)', 'brightness(1)'] }}
        transition={{ duration: 3, repeat: Infinity, delay: i }}
      >
        <div className="w-4 h-4 rounded-full bg-current blur-[6px] animate-pulse" />
        <span className="text-[6px] font-black tracking-[0.4em] opacity-40 uppercase">{cluster.label}</span>
      </motion.div>
    ))}
  </div>
);
