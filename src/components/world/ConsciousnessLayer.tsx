'use client';
import React from 'react';
import { motion } from 'framer-motion';

export const ConsciousnessLayer = ({ activeThoughts }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
      {activeThoughts.map((thought, i) => (
        <motion.div
           key={i}
           initial={{ opacity: 0, scale: 0.5, y: 0 }}
           animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 1], y: -100 }}
           transition={{ duration: 4, ease: "easeOut" }}
           className="absolute flex flex-col items-center gap-2"
           style={{ left: thought.x + '%', top: thought.y + '%' }}
        >
           <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <span className="text-[6px] font-black uppercase tracking-widest text-blue-400">Thought: {thought.text}</span>
           </div>
           <div className="w-[1px] h-12 bg-gradient-to-t from-white/20 to-transparent" />
        </motion.div>
      ))}
    </div>
  );
};
