'use client';
import { worldTheme } from '../../lib/world/theme';

import { useReputationStore } from '../../stores/reputationStore';

export default function TreasuryHoldPanel() {
  const treasuryHolds = useReputationStore((s) => s.treasuryHolds);

  return (
    <div className={`${worldTheme.panel} absolute left-[390px] bottom-24 z-30 w-[340px] p-4`.trim()}>
      <div className={`${worldTheme.sectionLabel} text-emerald-300/80`.trim()}>
        Treasury Hold Routing
      </div>

      <div className="mt-4 max-h-[260px] space-y-3 overflow-y-auto pr-1">
        {treasuryHolds.length === 0 ? (
          <div className={`${worldTheme.panel} text-sm text-white/50`.trim()}>
            No treasury holds yet.
          </div>
        ) : (
          treasuryHolds.map((hold) => (
            <div
              key={hold.id}
              className={`${worldTheme.panel} rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3`.trim()}
            >
              <div className="text-sm font-semibold text-white">
                Gross $${hold.grossAmount}
              </div>
              <div className="mt-1 text-xs text-white/55">{hold.reason}</div>
              <div className="mt-2 flex items-center justify-between text-xs text-white/70">
                <span>Held: $${hold.heldAmount}</span>
                <span>Released: $${hold.releasedAmount}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
