'use client';
import { useWorldStore } from '../../../stores/worldStore';

export default function DistrictTerritory() {
  const selectedDistrict = useWorldStore((s) => s.selectedDistrict);
  const setSelectedDistrict = useWorldStore((s) => s.setSelectedDistrict);

  const active = selectedDistrict === 'territory';

  return (
    <button
      onClick={() => setSelectedDistrict('territory')}
      className={`absolute left-[38%] top-[8%] rounded-2xl border px-6 py-5 text-left transition ${active ? 'border-blue-400 bg-blue-500/12 shadow-[0_0_30px_rgba(96,165,250,0.25)]' : 'border-white/10 bg-white/5 hover:border-blue-300/40 hover:bg-white/8'}`}
    >
      <div className="text-[10px] uppercase tracking-[0.45em] text-blue-300/70">
        District
      </div>
      <div className="mt-2 text-lg font-semibold text-white">Territory</div>
      <div className="mt-1 max-w-[220px] text-sm text-white/55">
        Land control, pathways, routes, district unlocks, and expansion logic.
      </div>
    </button>
  );
}