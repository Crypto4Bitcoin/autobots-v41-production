'use client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Activity, BarChart3, Terminal, Shield, Package, Globe, Headphones } from 'lucide-react';
import { AudioLayer } from './AudioLayer';

export const CommandBridge = ({ children, stats }) => {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pressure, setPressure] = useState(stats.activeAgents / 2000);

  return (
    <div className="relative w-full h-screen overflow-hidden text-white font-sans bg-black">
      <AudioLayer systemPressure={pressure} />
      
      <div className="absolute inset-0 z-0">
        {children}
      </div>

      {/* TOP HEADER */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent z-[60] flex items-center justify-between px-12">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-white/10 rounded-xl flex items-center justify-center bg-white/5">
                <Globe className="w-5 h-5 text-blue-500" />
            </div>
            <div>
                <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Command <span className="text-blue-500">Bridge</span></h1>
                <p className="text-[8px] text-white/20 uppercase tracking-[0.4em] font-bold">AutoBots Civilization Control</p>
            </div>
        </div>

        <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
                 <Headphones className="w-4 h-4 text-emerald-500 animate-pulse" />
                 <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 leading-none">MusicAgents: Ambient_Flow_V2</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="text-right">
                <p className="text-[10px] font-black text-blue-400">SYS_STABLE</p>
                <p className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Latency: 14ms</p>
            </div>
        </div>
      </div>

      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute left-6 top-24 bottom-24 w-72 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-xl p-6 z-50 flex flex-col gap-8"
      >
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-blue-500" />
          <h4 className="text-xs font-black tracking-widest uppercase">Agent Monitor</h4>
        </div>

        <div className="space-y-6">
          {[
            { label: 'Active Agents', val: stats.activeAgents, color: 'bg-blue-500' },
            { label: 'Growth Tier', val: stats.growthTier, color: 'bg-purple-500' },
            { label: 'Matrix Stagnancy', val: stats.stagnancy + '%', color: 'bg-rose-500' },
          ].map((s, i) => (
            <div key={i} className="space-y-2">
                <div className="flex justify-between text-[8px] uppercase font-bold text-white/40 tracking-widest">
                    <span>{s.label}</span>
                    <span>{s.val}</span>
                </div>
                <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={"h-full transition-all duration-1000 " + s.color} style={{ width: i === 2 ? s.val + '%' : (stats.activeAgents/20) + '%' }} />
                </div>
            </div>
          ))}
        </div>
        
        <div className="mt-auto pt-6 border-t border-white/5 font-mono text-[7px] text-white/20">
            <p>&gt; AUTH_SUCCESS: GLOBAL_ROOT</p>
            <p>&gt; CONNECTED: 14 REGIONS</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute right-6 top-24 bottom-24 w-72 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-xl p-6 z-50 flex flex-col gap-8"
      >
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-emerald-500" />
          <h4 className="text-xs font-black tracking-widest uppercase">Influence Grid</h4>
        </div>

        <div className="space-y-4">
          {['HVAC', 'Construction', 'Crypto'].map((t, i) => (
            <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group hover:border-emerald-500/50 transition-all cursor-pointer">
                <span className="text-[10px] font-bold text-white/60">{t}</span>
                <span className="text-[8px] font-mono text-emerald-500">+{80 - i * 15}%</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-6 left-80 right-80 h-28 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-xl p-6 z-50 flex items-center justify-between gap-12"
      >
        <div className="flex items-center gap-4">
           <BarChart3 className="w-8 h-8 text-amber-500/50 animate-pulse" />
           <div>
              <p className="text-[8px] uppercase tracking-[0.4em] text-white/40 font-bold">Economic Signaling Exchange</p>
              <p className="text-2xl font-black italic text-white">$2,481,200 <span className="text-[10px] text-emerald-400 font-mono">+12.4%</span></p>
           </div>
        </div>
      </motion.div>

    </div>
  );
};
