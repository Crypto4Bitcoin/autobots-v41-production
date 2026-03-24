'use client';

import { useDefenseDistrictStore } from '../../stores/defenseDistrictStore';
import { worldTheme } from '../../lib/world/theme';

export default function DefenseStatusBar() {
  const resilience = useDefenseDistrictStore((s) => s.resilience);
  
  const statusColor = resilience > 70 ? 'text-emerald-400' : resilience > 30 ? 'text-amber-400' : 'text-red-500';
  const barColor = resilience > 70 ? 'bg-emerald-400/70' : resilience > 30 ? 'bg-amber-400/70' : 'bg-red-500/70';

  return (
    <div className={`flex items-center gap-4 ${worldTheme.panel} px-4 py-2 border-indigo-500/10 shadow-lg`}>
      <div className="flex flex-col">
        <span className={`text-[9px] uppercase tracking-[0.2em] font-bold ${worldTheme.sectionLabel}`}>
          Civilization Resilience
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-mono font-bold ${statusColor}`}>
            {resilience}%
          </span>
          <span className="text-[10px] text-white/30 uppercase tracking-widest">
            Nominal Range
          </span>
        </div>
      </div>
      
      <div className="h-6 w-[2px] bg-white/5 mx-1" />
      
      <div className="flex-1 min-w-[120px]">
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${barColor}`}
            style={{ width: `${resilience}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[8px] uppercase tracking-widest text-white/20">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
