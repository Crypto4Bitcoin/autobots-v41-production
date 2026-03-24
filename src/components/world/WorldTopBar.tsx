'use client';
import DefenseStatusBar from "./DefenseStatusBar";
import { worldTheme } from '../../lib/world/theme';
import { useWorldStore } from '../../stores/worldStore';

export default function WorldTopBar() {
  const worldName = useWorldStore((s) => s.worldName);
  const phaseLabel = useWorldStore((s) => s.phaseLabel);
  const stability = useWorldStore((s) => s.stability);

  return (
    <div className={"absolute left-[50%] top-6 z-40 flex -translate-x-[50%] items-center gap-4 " + worldTheme.panelStrong + " px-6 py-3 shadow-xl"}>
      <div className="flex items-center gap-3 pr-6 border-r border-white/10">
        <div className={worldTheme.heading}>{worldName}</div>
        <div className="rounded-full bg-blue-500/20 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-blue-300">
          {phaseLabel}
        </div>
      </div>
      <div>
        <div className={worldTheme.sectionLabel}>Core Stability</div>
        <div className="text-xl font-mono font-semibold text-emerald-400">{stability}%</div>
      </div>
      <div className="h-10 w-[1px] bg-white/10 mx-2" />
      <DefenseStatusBar />
    </div>
  );
}
