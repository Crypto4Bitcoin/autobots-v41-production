'use client';
import { useWorldStore } from '../../../stores/worldStore';

export default function DistrictInstitutional() {
  const selectedDistrict = useWorldStore((s) => s.selectedDistrict);
  const setSelectedDistrict = useWorldStore((s) => s.setSelectedDistrict);

  const active = selectedDistrict === 'institutional';

  return (
    <button
      onClick={() => setSelectedDistrict('institutional')}
      className={`absolute right-[12%] top-[46%] rounded-2xl border px-6 py-5 text-left transition ${active ? 'border-emerald-400 bg-emerald-500/12 shadow-[0_0_30px_rgba(52,211,153,0.25)]' : 'border-white/10 bg-white/5 hover:border-emerald-300/40 hover:bg-white/8'}`}
    >
      <div className="text-[10px] uppercase tracking-[0.45em] text-emerald-300/70">
        District
      </div>
      <div className="mt-2 text-lg font-semibold text-white">Institutional</div>
      <div className="mt-1 max-w-[220px] text-sm text-white/55">
        Governance, IRS, fraud prevention, civic rules, and compliance memory.
      </div>
    </button>
  );
}