'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, ArrowUpRight } from 'lucide-react';

export const EnterpriseMarketplace = () => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="flex flex-col items-center gap-6"
  >
    <div className="w-[500px] h-40 bg-amber-950/10 border border-amber-500/30 rounded-3xl backdrop-blur-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
      
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-amber-500 font-black text-xs uppercase tracking-tighter">Live Market Feed</h4>
          <p className="text-[8px] text-white/30 uppercase mt-1 italic">Enterprise Cluster Sigma-7</p>
        </div>
        <div className="flex gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-mono text-emerald-400">+14.2%</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 relative z-10">
        {[
          { label: 'Revenue', val: '$248k', icon: DollarSign },
          { label: 'Active', val: '1.2k', icon: Users },
          { label: 'Growth', val: '92%', icon: ArrowUpRight },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <stat.icon className="w-3 h-3 text-amber-500/50" />
                <span className="text-[8px] text-white/40 uppercase">{stat.label}</span>
            </div>
            <p className="text-xl font-black text-amber-100">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Ticker Tape */}
      <div className="absolute bottom-0 left-0 w-full h-4 bg-amber-500/10 flex items-center overflow-hidden">
        <motion.div 
          animate={{ x: [0, -500] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap text-[8px] font-mono text-amber-400/60 pl-full flex gap-12"
        >
          <span>HVAC CONTRACT EXECUTED: $1,200</span>
          <span>AGENT LV5 HIRED: CONSTRUCTION DISTRICT</span>
          <span>MARKET SIGNAL RECEIVED: SYMBOLIC CAPTURE ACTIVE</span>
          <span>TREASURY REBALANCING COMPLETE</span>
        </motion.div>
      </div>
    </div>

    <div className="text-center">
      <h3 className="text-amber-500 font-bold text-sm tracking-[0.4em] uppercase">Enterprise Marketplace</h3>
      <p className="text-[8px] text-amber-500/30 mt-1 uppercase italic">Stable Value Exchange Layer</p>
    </div>
  </motion.div>
);
