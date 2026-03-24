'use client';
import WorldButton from './ui/WorldButton';
import { worldTheme } from '../../lib/world/theme';
import { useWorldStore } from '../../stores/worldStore';
import type { DistrictType } from '../../lib/world/types';

const districtOrder: DistrictType[] = [
  'industrial',
  'territory',
  'economic',
  'institutional',
];

export default function WorldLeftRail() {
  const districts = useWorldStore((s) => s.districts);
  const selectedDistrict = useWorldStore((s) => s.selectedDistrict);
  const setSelectedDistrict = useWorldStore((s) => s.setSelectedDistrict);
  const market = useWorldStore((s) => s.market);
  const discoveredWorlds = useWorldStore((s) => s.discoveredWorlds);

  return (
    <aside className={"ml-4 w-[220px] fixed top-24 left-0 h-[calc(100vh-120px)] " + worldTheme.panel + " p-5 overflow-y-auto"}>
      <div className={worldTheme.heading}>
        Civilization Monitor
      </div>

      <div className="mt-5 space-y-3">
        {districtOrder.map((id) => {
          const district = districts.find((d) => d.id === id);
          if (!district) return null;
          const active = selectedDistrict === id;
          return (
            <WorldButton key={district.id} onClick={() => setSelectedDistrict(district.id)}
              className='w-full text-left p-3 rounded-xl border'>
              <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase text-white/50">{district.id}</span>
                  <div className='h-1.5 w-1.5 rounded-full bg-emerald-400' />
              </div>
              <div className="text-xs font-bold text-white">{district.label}</div>
            </WorldButton>
          );
        })}
      </div>

      <div className="mt-8">
        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-3">Cluster Resonance</div>
        <div className="space-y-3">
            {discoveredWorlds.length === 0 ? (
                <div className="text-[10px] text-white/30 italic">Scanning for remote clusters...</div>
            ) : discoveredWorlds.slice(0, 3).map(world => (
                <div key={world.id} className="p-2 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-white font-mono">{world.id}</span>
                        <span className="text-[10px] text-white/40">{Math.round(world.load)}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400 transition-all duration-300" style={{ width: `${world.health}%` }} />
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className={"mt-8 p-4 " + worldTheme.panel + " border-amber-400/20 bg-amber-500/10 rounded-xl"}>
        <div className="text-[10px] uppercase tracking-[0.2em] text-amber-300/75">Capital Exchange</div>
        <div className="mt-2 text-xl font-bold text-white"></div>
        <div className="mt-1 text-xs text-emerald-300">+{market.growthRate}% Projection</div>
      </div>
    </aside>
  );
}
