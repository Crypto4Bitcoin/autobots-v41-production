import React from 'react';
import { DomainStatus } from '../../contracts/types';

interface StatusProps {
  status: DomainStatus;
  theme?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function DomainStatusBadge({ status, theme = 'cyan', size = 'md' }: StatusProps) {
  const colors = {
    idle: 'bg-neutral-800 text-neutral-500 border-white/5',
    active: `bg-${theme}-950 text-${theme}-400 border-${theme}-500/30 animate-pulse-slow`,
    warning: 'bg-yellow-950 text-yellow-400 border-yellow-500/30 animate-pulse',
    error: 'bg-rose-950 text-rose-400 border-rose-500/30 animate-ping',
    locked: 'bg-indigo-950 text-indigo-400 border-indigo-500/30'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[8px] tracking-[0.2em]',
    md: 'px-6 py-2 text-[10px] tracking-[0.4em]',
    lg: 'px-12 py-5 text-[12px] tracking-[0.8em]'
  }

  return (
    <div className={`rounded-full border font-black uppercase transition-all duration-1000 ${colors[status]} ${sizes[size]}`}>
       <span className="flex items-center gap-4">
          <div className={`h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]`} />
          {status}
       </span>
    </div>
  );
}
