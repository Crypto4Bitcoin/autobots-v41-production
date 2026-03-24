'use client';
import React from 'react';
import { motion } from 'framer-motion';

export const UndergroundLayer = ({ visible }) => (
  <div 
    className={"absolute inset-0 transition-opacity duration-1000 " + (visible ? 'opacity-100' : 'opacity-0 pointer-events-none')}
  >
    <div className="absolute inset-0 bg-rose-950/20 backdrop-invert-[0.05]" />
    
    <svg className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="rose-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="rgba(244, 63, 94, 0.3)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.path
          key={i}
          d={"M -100 " + (200 + i * 80) + " Q " + (500 + Math.sin(i) * 200) + " " + (300 + i * 80) + " 1200 " + (200 + i * 80)}
          fill="none"
          stroke="url(#rose-grad)"
          strokeWidth="2"
          strokeDasharray="10, 20"
          animate={{ strokeDashoffset: -1000 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
        />
      ))}
    </svg>

    <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-rose-500/40 text-[12px] font-black tracking-[1.5em] uppercase whitespace-nowrap">
      IRS Symbolic Capture Network
    </div>
  </div>
);
