'use client';
import { worldTheme } from '../../lib/world/theme';

import { useGovernanceStore } from '../../stores/governanceStore';

export default function GovernancePanel() {
  const cases = useGovernanceStore((s) => s.cases);

  return (
    <div className={`absolute right-[340px] top-24 z-30 w-[340px] ${worldTheme.panel} ${worldTheme.spacing.innerPadding}`}>
      <div className={worldTheme.sectionLabel}>
        Governance Review
      </div>

      <div className="mt-4 max-h-[280px] space-y-3 overflow-y-auto pr-1">
        {cases.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/50">
            No governance cases open.
          </div>
        ) : (
          cases.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-red-400/20 bg-red-500/10 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`${worldTheme.heading}`}>{item.status}</div>
                  <div className="mt-1 text-xs text-white/55">{item.reason}</div>
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-red-200/80">
                  {item.severity}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}