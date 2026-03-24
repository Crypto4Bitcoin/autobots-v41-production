'use client';
import React from 'react';
import { motion } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Shield, Radar, Zap } from 'lucide-react';

export const MetaCitadel = () => (
  <motion.div 
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="flex flex-col items-center"
  >
    <div className="relative w-64 h-64">
      {/* Orbital Rings */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border border-blue-500/20 rounded-full"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 border border-blue-400/10 rounded-full border-dashed"
      />
      
      {/* Main Fortress */}
      <div className="absolute inset-1/4 bg-blue-950/40 border-2 border-blue-500/50 rounded-xl backdrop-blur-xl flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.3)]">
        <Shield className="w-16 h-16 text-blue-400 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent" />
        
        {/* Radar Sweep */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-100%] border-r-[40px] border-blue-400/10"
        />
      </div>

      {/* Satellite Drones */}
      {[0, 120, 240].map((angle, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_10px_#fff]"
          animate={{ 
            x: Math.cos(angle * Math.PI / 180) * 100,
            y: Math.sin(angle * Math.PI / 180) * 100,
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
    </div>

    <div className="mt-4 text-center">
      <h3 className="text-blue-400 font-bold text-sm tracking-[0.3em] uppercase">Meta Oversight Citadel</h3>
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="text-[10px] text-white/40 font-mono">THREATS: 0</div>
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <div className="text-[10px] text-blue-500 font-mono animate-pulse">SCANNING...</div>
      </div>
    </div>
  </motion.div>
);
