'use client';
import { worldTheme } from '../../lib/world/theme';

import { usePolicyStore } from '../../stores/policyStore';

export default function DoctrinePanel() {
  const compiledPolicy = usePolicyStore((s) => s.compiledPolicy);

  if (!compiledPolicy) return null;

  return (
    <div className="absolute right-[390px] bottom-24 z-30 w-[340px] rounded-[24px] border border-orange-400/15 bg-black/60 p-4 backdrop-blur-md">
      <div className="text-[10px] uppercase tracking-[0.35em] text-orange-300/80">
        Active Overrides
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-white/70">
        <div className="rounded-lg border border-white/10 bg-white/5 p-2">
          <div className="text-white/40">Treasury Hold</div>
          <div className="mt-1 font-mono text-orange-200">
            x{compiledPolicy.treasuryHoldMultiplier.toFixed(1)}
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-2">
          <div className="text-white/40">XP Throttle</div>
          <div className="mt-1 font-mono text-orange-200">
            {compiledPolicy.xpThrottleEnabled ? 'ENABLED' : 'OFF'}
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-2">
          <div className="text-white/40">Lock Threshold</div>
          <div className="mt-1 font-mono text-orange-200">
            {compiledPolicy.districtLockThreshold} Risk
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-2">
          <div className="text-white/40">Auto-Review &gt;</div>
          <div className="mt-1 font-mono text-orange-200">
            ${compiledPolicy.maxUnreviewedPayout}
          </div>
        </div>
      </div>
    </div>
  );
}
