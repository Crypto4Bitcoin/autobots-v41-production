'use client';
import { worldTheme } from '../../lib/world/theme';
import WorldButton from './ui/WorldButton';
import { useDefenseDistrictStore } from '../../stores/defenseDistrictStore';

export default function NetworkDefensePanel() {
  const cells = useDefenseDistrictStore((s) => s.cells);
  const resilience = useDefenseDistrictStore((s) => s.resilience);
  
  // Group into 9 Sectors (9x9 conceptual structure)
  const sectors = Array.from({ length: 9 }).map((_, sectorIndex) => {
    return cells.slice(sectorIndex * 9, (sectorIndex + 1) * 9);
  });

  return (
    <div className={`absolute right-[24px] top-[120px] z-30 w-[340px] ${worldTheme.panelStrong} ${worldTheme.spacing.innerPadding}`}>
      <div className="flex items-center justify-between">
        <div className={worldTheme.sectionLabel}>
          Digital Defense // 9x9x9 Mesh
        </div>
        <div className="text-xs font-mono text-indigo-400">
          RES: {resilience}%
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {sectors.map((sector, sIdx) => (
          <div key={sIdx} className="rounded-lg border border-white/5 bg-white/5 p-2">
            <div className="mb-2 text-[8px] uppercase tracking-widest text-white/30 text-center">
              Sec-0{sIdx + 1}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {sector.map((cell) => (
                <div
                  key={cell.id}
                  title={`Cell ${cell.id} | Integrity: ${cell.integrity}% | Sector: ${Math.floor(cells.indexOf(cell) / 9) + 1}`} className={`h-2 w-2 rounded-sm cursor-help transition-colors duration-500 ${
                    cell.status === 'breach' ? 'bg-red-500 animate-pulse' :
                    cell.status === 'alert' ? 'bg-amber-500 animate-pulse' :
                    cell.status === 'reinforced' ? 'bg-emerald-400' :
                    'bg-indigo-400/20'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        <div className={`${worldTheme.panel} `.trim()}>
          <div className="text-[9px] uppercase tracking-[0.2em] text-white/40">
            Threat Intelligence
          </div>
          <div className="mt-2 space-y-2">
             <div className="flex items-center justify-between text-[11px]">
                <span className="text-white/60">Active Attacks</span>
                <span className="text-amber-400">Low Pattern Detected</span>
             </div>
             <div className="flex items-center justify-between text-[11px]">
                <span className="text-white/60">Guard Readiness</span>
                <span className="text-emerald-400">92% Optimal</span>
             </div>
          </div>
        </div>

                <div className={`${worldTheme.panel} rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 shadow-inner`.trim()}>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-200">
              Tactical Advisory // v1.0
            </div>
          </div>
          <div className="text-xs leading-relaxed text-indigo-100/80 italic font-serif">
            "The 9x9 tactical grid represents the civilization's neural fabric. Maintain resilience above 70% to prevent cascading node breaches."
          </div>
        </div>

        <div className="flex gap-2">
          <WorldButton variant="cyan" size="sm" className="flex-1">
             Deploy Mesh
          </WorldButton>
          <WorldButton variant="ghost" size="sm" className="flex-1">
             Full Audit
          </WorldButton>
        </div>
      </div>
    </div>
  );
}
