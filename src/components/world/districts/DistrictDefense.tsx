'use client';
import { useWorldStore } from '../../../stores/worldStore';
import { useDefenseDistrictStore } from '../../../stores/defenseDistrictStore';
import { useState, useEffect } from 'react';
import { worldTheme } from '../../../lib/world/theme';

export default function DistrictDefense() {
  const selectedDistrict = useWorldStore((s) => s.selectedDistrict);
  const setSelectedDistrict = useWorldStore((s) => s.setSelectedDistrict);
  const resilience = useDefenseDistrictStore((s) => s.resilience);

    const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const active = selectedDistrict === 'defense';

  return (
    <button
      onClick={() => setSelectedDistrict('defense')}
      className={`absolute left-4 top-4 right-4 bottom-4 rounded-[20px] border transition-all duration-500 ${
        active 
          ? 'border-indigo-400 bg-indigo-500/15 shadow-[0_0_40px_rgba(99,102,241,0.3)]' 
          : 'border-white/10 bg-white/5 hover:border-indigo-400/40 hover:bg-white/8'
      }`}
    >
      <div className="flex h-full flex-col justify-between p-5">
        <div>
          <div className={worldTheme.sectionLabel}>
             District // 05
          </div>
          <div className={worldTheme.heading + " mt-2"}>Network Defense</div>
          <div className="mt-1 max-w-[200px] text-xs text-white/50">
            Resilience: {resilience}% • 9x9 Tactical Grid Active
          </div>
        </div>

        <div className="grid grid-cols-9 gap-[2px] opacity-30">
          {Array.from({ length: 81 }).map((_, i) => (
            <div 
              key={i} 
              className="h-1 w-1 rounded-full bg-indigo-400/80"
              style={{ opacity: mounted ? 0.2 + (Math.sin(i + Date.now()/1000) + 1) / 2 : 0.4 }}
            />
          ))}
        </div>
      </div>
      
      {/* Scanning effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px]">
        <div className="h-full w-[2px] bg-indigo-400/20 blur-sm animate-[scan_4s_linear_infinite]" />
      </div>
    </button>
  );
}
