'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Factory, Construction, Settings, Zap } from 'lucide-react';

export const ProductionFabric = () => (
  <div className="flex flex-col items-center gap-8">
    <div className="grid grid-cols-1 gap-6">
      {[
        { tier: '3x3x3', label: 'Modular Cell', color: 'border-white/20', icon: Settings },
        { tier: '6x6x6', label: 'Industrial Nexus', color: 'border-white/40', icon: Factory },
        { tier: '9x9x9', label: 'Alpha Foundry', color: 'border-white/60', icon: Construction },
      ].map((cell, i) => (
        <motion.div
          key={i}
          whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.1)' }}
          className={`w-64 h-24 bg-white/5 border-l-4 ${cell.color} rounded-r-xl flex items-center p-4 gap-6 relative overflow-hidden group`}
        >
          <cell.icon className="w-10 h-10 text-white/30 group-hover:text-white transition-colors" />
          <div>
            <p className="text-xs font-black text-white">{cell.tier}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">{cell.label}</p>
          </div>
          
          {/* Animated Piston Effect */}
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute right-4 top-4 w-1 h-12 bg-white/10 rounded-full"
          />

          <div className="ml-auto">
             <Zap className="w-4 h-4 text-amber-500 animate-bounce" />
          </div>
        </motion.div>
      ))}
    </div>
    <div className="text-center uppercase tracking-tighter shadow-2xl">
      <h3 className="text-white font-black text-lg">Production Fabric</h3>
      <p className="text-[8px] text-white/30">V37 Scalable Throughput Grid</p>
    </div>
  </div>
);
