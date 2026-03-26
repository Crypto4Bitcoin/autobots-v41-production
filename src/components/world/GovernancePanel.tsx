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
          <div className={`${worldTheme.panel} text-sm text-white/50`.trim()}>
            No governance cases open.
          </div>
        ) : (
          cases.map((item) => (
            <div
              key={item.id}
              className={`${worldTheme.panel} rounded-xl border border-red-400/20 bg-red-500/10 p-3`.trim()}
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