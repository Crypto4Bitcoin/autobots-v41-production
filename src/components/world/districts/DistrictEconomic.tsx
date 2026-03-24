'use client';
import { useWorldStore } from '../../../stores/worldStore';

export default function DistrictEconomic() {
  const selectedDistrict = useWorldStore((s) => s.selectedDistrict);
  const setSelectedDistrict = useWorldStore((s) => s.setSelectedDistrict);

  const active = selectedDistrict === 'economic';

  return (
    <button
      onClick={() => setSelectedDistrict('economic')}
      className={`absolute right-[20%] top-[16%] rounded-2xl border px-6 py-5 text-left transition ${active ? 'border-amber-400 bg-amber-500/12 shadow-[0_0_30px_rgba(251,191,36,0.25)]' : 'border-white/10 bg-white/5 hover:border-amber-300/40 hover:bg-white/8'}`}
    >
      <div className="text-[10px] uppercase tracking-[0.45em] text-amber-300/70">
        District
      </div>
      <div className="mt-2 text-lg font-semibold text-white">Economic</div>
      <div className="mt-1 max-w-[220px] text-sm text-white/55">
        Revenue flow, task economy, exchange logic, and growth metrics.
      </div>
    </button>
  );
}