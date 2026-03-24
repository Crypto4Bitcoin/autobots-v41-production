'use client';
import { useWorldStore } from '../../../stores/worldStore';

export default function DistrictIndustrial() {
  const selectedDistrict = useWorldStore((s) => s.selectedDistrict);
  const setSelectedDistrict = useWorldStore((s) => s.setSelectedDistrict);

  const active = selectedDistrict === 'industrial';

  return (
    <button
      onClick={() => setSelectedDistrict('industrial')}
      className={`absolute left-[16%] top-[16%] rounded-2xl border px-6 py-5 text-left transition ${active ? 'border-cyan-400 bg-cyan-500/12 shadow-[0_0_30px_rgba(34,211,238,0.25)]' : 'border-white/10 bg-white/5 hover:border-cyan-300/40 hover:bg-white/8'}`}
    >
      <div className="text-[10px] uppercase tracking-[0.45em] text-cyan-300/70">
        District
      </div>
      <div className="mt-2 text-lg font-semibold text-white">Industrial</div>
      <div className="mt-1 max-w-[220px] text-sm text-white/55">
        Production, HVAC, fabrication, field work, and logistics agents.
      </div>
    </button>
  );
}