'use client';
import React from 'react';
import { motion } from 'framer-motion';

export const CommunicationNetwork = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
      <svg className="w-full h-full">
        <motion.path 
          d="M 50% 50% L 50% 10%" 
          stroke="rgba(59,130,246,0.5)" 
          strokeWidth="2" 
          strokeDasharray="5, 10"
          animate={{ strokeDashoffset: -100 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        <motion.path 
          d="M 50% 50% L 90% 50%" 
          stroke="rgba(52,211,153,0.5)" 
          strokeWidth="2" 
          strokeDasharray="5, 10"
          animate={{ strokeDashoffset: -100 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        <motion.path 
          d="M 50% 50% L 10% 50%" 
          stroke="rgba(255,255,255,0.5)" 
          strokeWidth="2" 
          strokeDasharray="5, 10"
          animate={{ strokeDashoffset: -100 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        <motion.path 
          d="M 50% 50% L 50% 90%" 
          stroke="rgba(245,158,11,0.5)" 
          strokeWidth="2" 
          strokeDasharray="5, 10"
          animate={{ strokeDashoffset: -100 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
};
