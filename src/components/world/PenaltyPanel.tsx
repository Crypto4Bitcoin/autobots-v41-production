'use client';
import { worldTheme } from '../../lib/world/theme';

import { usePenaltyStore } from '../../stores/penaltyStore';
import { useWorldStore } from '../../stores/worldStore';

export default function PenaltyPanel() {
  const penalties = usePenaltyStore((s) => s.penalties);
  const districts = useWorldStore((s) => s.districts);

  return (
    <div className={`absolute left-6 bottom-24 z-30 w-[360px] ${worldTheme.panel} ${worldTheme.spacing.innerPadding}`}>
      <div className={worldTheme.sectionLabel}>
        Institutional Penalties
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="text-xs uppercase tracking-[0.2em] text-white/50">
          District Access
        </div>
        <div className="mt-2 space-y-2">
          {districts.map((district) => (
            <div key={district.id} className="flex items-center justify-between text-sm">
              <span className="capitalize text-white/70">{district.label}</span>
              <span className="capitalize text-white">{district.restrictionLevel}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 max-h-[220px] space-y-3 overflow-y-auto pr-1">
        {penalties.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/50">
            No active penalties.
          </div>
        ) : (
          penalties.map((penalty) => (
            <div
              key={penalty.id}
              className={`rounded-xl border p-3 ${
                penalty.active
                  ? 'border-yellow-400/20 bg-yellow-500/10'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`${worldTheme.heading}`}>{penalty.type}</div>
                  <div className="mt-1 text-xs text-white/55">{penalty.reason}</div>
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-yellow-200/80">
                  {penalty.active ? 'active' : 'cleared'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
