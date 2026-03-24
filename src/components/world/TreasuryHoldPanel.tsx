'use client';
import { worldTheme } from '../../lib/world/theme';

import { useReputationStore } from '../../stores/reputationStore';

export default function TreasuryHoldPanel() {
  const treasuryHolds = useReputationStore((s) => s.treasuryHolds);

  return (
    <div className="absolute left-[390px] bottom-24 z-30 w-[340px] rounded-[24px] border border-emerald-400/15 bg-black/60 p-4 backdrop-blur-md">
      <div className="text-[10px] uppercase tracking-[0.35em] text-emerald-300/80">
        Treasury Hold Routing
      </div>

      <div className="mt-4 max-h-[260px] space-y-3 overflow-y-auto pr-1">
        {treasuryHolds.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/50">
            No treasury holds yet.
          </div>
        ) : (
          treasuryHolds.map((hold) => (
            <div
              key={hold.id}
              className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3"
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
