'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldAlert, Newspaper, Briefcase, Network, BrainCircuit } from 'lucide-react';

const treeData = [
  { id: 'research', label: 'Research', icon: Search },
  { id: 'architect', label: 'Knowledge Architect', icon: BrainCircuit },
  { id: 'director', label: 'Civ Director', icon: Network },
  { id: 'verif', label: 'Verification', icon: ShieldAlert },
  { id: 'guardian', label: 'Integrity Guardian', icon: ShieldAlert },
  { id: 'content', label: 'Content', icon: Newspaper },
  { id: 'strategist', label: 'Narrative Strategist', icon: Briefcase },
];

export const SkillTree = () => {
  return (
    <div className="relative w-full h-full p-10 flex flex-col items-center">
      <div className="text-center mb-12">
         <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">Civ Evolution <span className="text-emerald-500">Tree</span></h3>
         <p className="text-[8px] text-white/40 tracking-[0.4em] uppercase mt-1">Career Mapping Grid</p>
      </div>

      <div className="relative flex flex-wrap justify-center gap-12 max-w-4xl">
        {treeData.map((node, i) => (
          <motion.div key={node.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex flex-col items-center w-24 opacity-60 hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                <node.icon className="w-5 h-5 text-white/30" />
            </div>
            <p className="text-[7px] font-black text-white/60 mt-2 text-center uppercase tracking-tighter leading-none">
                {node.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
