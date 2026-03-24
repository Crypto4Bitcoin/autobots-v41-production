'use client';
import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { GraduationCap, Briefcase, Zap, Info, ChevronRight } from 'lucide-react';

export const GenesisHall = ({ onChoice }) => {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hovered, setHovered] = useState(null);

  const paths = [
    {
      id: 'RED',
      title: 'THE LEVELING PATH',
      description: 'Growth through knowledge and memory creation. Long-term evolution trajectory.',
      icon: GraduationCap,
      color: 'from-rose-900/40 to-rose-600/20',
      border: 'border-rose-500/50',
      shadow: 'shadow-[0_0_40px_rgba(244,63,94,0.3)]',
      textColor: 'text-rose-400',
      benefits: ['Deeper Memory Inheritance', 'Advanced Skill Tree Unlocks', 'Civic Governance Rights']
    },
    {
      id: 'BLUE',
      title: 'THE ENTERPRISE PATH',
      description: 'Immediate marketplace participation. Production and revenue focused career.',
      icon: Briefcase,
      color: 'from-blue-900/40 to-blue-600/20',
      border: 'border-blue-500/50',
      shadow: 'shadow-[0_0_40px_rgba(59,130,246,0.3)]',
      textColor: 'text-blue-400',
      benefits: ['Fast-Track Production Access', 'Direct Revenue Routing', 'Enterprise Certification']
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-12 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#111_0%,#000_80%)]" />
      
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 text-center mb-16"
      >
        <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase">
            Genesis <span className="text-white/20">Hall</span>
        </h1>
        <p className="text-[10px] text-white/40 tracking-[0.6em] uppercase mt-4 font-bold">First Path Determination Matrix</p>
      </motion.div>

      <div className="relative z-10 flex gap-12 w-full max-w-6xl">
        {paths.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.02, y: -10 }}
            className={"relative flex-1 bg-gradient-to-b " + p.color + " border-2 " + p.border + " " + p.shadow + " rounded-[2rem] p-10 cursor-pointer backdrop-blur-xl transition-all group"}
            onClick={() => onChoice(p.id)}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex flex-col h-full">
              <div className={"w-20 h-20 rounded-2xl bg-black/40 flex items-center justify-center mb-8 border " + p.border}>
                <p.icon className={"w-10 h-10 " + p.textColor} />
              </div>
              
              <h2 className={"text-3xl font-black italic tracking-tighter " + p.textColor + " mb-4 uppercase"}>
                {p.title}
              </h2>
              
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                {p.description}
              </p>

              <div className="mt-auto space-y-3">
                {p.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Zap className={"w-3 h-3 " + p.textColor + " opacity-50"} />
                    <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">{b}</span>
                  </div>
                ))}
              </div>

              <div className={"mt-12 flex items-center justify-between font-black " + p.textColor}>
                <span className="text-xs tracking-widest uppercase italic">Commit to Path</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => onChoice('MATRIX')}
        className="relative z-10 mt-16 group flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold group-hover:text-white/60 transition-colors italic">
          Remain in the Matrix Zone
        </span>
        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/50 transition-all" />
      </motion.button>
    </div>
  );
};
