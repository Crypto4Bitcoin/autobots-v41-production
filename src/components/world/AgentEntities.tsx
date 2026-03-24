'use client';
import React from 'react';
import { motion } from 'framer-motion';

const paths = [
  { id: 'p1', from: { x: '50%', y: '50%' }, to: { x: '80%', y: '50%' } }, 
  { id: 'p2', from: { x: '20%', y: '50%' }, to: { x: '50%', y: '50%' } }, 
  { id: 'p3', from: { x: '50%', y: '50%' }, to: { x: '50%', y: '20%' } }, 
  { id: 'p4', from: { x: '50%', y: '50%' }, to: { x: '50%', y: '80%' } }, 
];

export const AgentEntities = () => (
  <div className="absolute inset-0 pointer-events-none z-20">
    {paths.map((path, index) => (
      <div key={path.id}>
        {Array.from({ length: 3 }).map((_, j) => (
          <motion.div
            key={j}
            className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#fff] blur-[1px]"
            initial={{ left: path.from.x, top: path.from.y }}
            animate={{ left: path.to.x, top: path.to.y, opacity: [0, 1, 0] }}
            transition={{ 
              duration: 3 + ((index * 3 + j * 7) % 10) / 5, 
              repeat: Infinity, 
              delay: index + j * 1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    ))}
  </div>
);
