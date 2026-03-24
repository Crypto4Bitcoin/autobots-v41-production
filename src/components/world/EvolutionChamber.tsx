'use client';
import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Activity, BookOpen, ShieldCheck, TrendingUp } from 'lucide-react';

export const EvolutionChamber = ({ agent, onEvolved }) => {
  const [evolving, setEvolving] = useState(false);
  const [progress, setProgress] = useState(0);

  const stats = [
    { label: 'Tasks', value: agent.taskCount, icon: Zap, color: 'text-blue-400' },
    { label: 'Knowledge', value: agent.knowledgePercent + '%', icon: BookOpen, color: 'text-purple-400' },
    { label: 'Memory', value: agent.memoryScore, icon: Activity, color: 'text-emerald-400' },
    { label: 'Market', value: agent.marketImpact, icon: TrendingUp, color: 'text-amber-400' },
    { label: 'Security', value: agent.securityScore, icon: ShieldCheck, color: 'text-rose-400' },
  ];

  const handleEvolve = () => {
    setEvolving(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onEvolved();
          setEvolving(false);
          setProgress(0);
        }, 800);
      }
    }, 100);
  };

  return (
    <div className="relative w-full max-w-4xl h-[500px] bg-black/60 border border-white/10 rounded-[3rem] backdrop-blur-3xl overflow-hidden p-10 flex flex-col items-center justify-between shadow-[0_0_80px_rgba(59,130,246,0.1)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
      
      <div className="text-center z-10">
        <h3 className="text-xl font-black italic tracking-tighter text-white uppercase">Agent Evolution <span className="text-blue-500">Chamber</span></h3>
        <p className="text-[8px] text-white/30 tracking-[0.4em] uppercase mt-1">Tier Advancement Protocol</p>
      </div>

      <div className="relative flex items-center justify-center w-full h-48 z-10">
        <motion.div 
          animate={evolving ? { scale: [1, 1.1, 1], filter: 'brightness(1.5)' } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          className="relative w-24 h-24 bg-white/5 border border-white/20 rounded-full flex items-center justify-center"
        >
          <Cpu className={"w-10 h-10 " + (evolving ? 'text-blue-400' : 'text-white/20')} />
        </motion.div>

        {stats.map((s, i) => (
          <div key={i} className="absolute flex flex-col items-center" style={{ top: 80 + Math.sin(i * 1.25) * 140, left: 'calc(50% + ' + (Math.cos(i * 1.25) * 200) + 'px)' }}>
            <div className={"w-8 h-8 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center mb-1 " + s.color}>
              <s.icon className="w-4 h-4" />
            </div>
            <p className="text-[7px] font-black text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="w-full max-w-xs z-10">
        {evolving ? (
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div initial={{ width: 0 }} animate={{ width: progress + "%" }} className="h-full bg-blue-500" />
          </div>
        ) : (
          <button onClick={handleEvolve} className="w-full py-3 bg-white text-black text-[10px] font-black tracking-[0.2em] uppercase rounded-full hover:bg-blue-50 transition-all">
            Initiate Evolution
          </button>
        )}
      </div>
    </div>
  );
};
