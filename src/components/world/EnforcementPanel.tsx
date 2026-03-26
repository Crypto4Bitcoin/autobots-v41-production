'use client';
import WorldButton from './ui/WorldButton';
import { worldTheme } from '../../lib/world/theme';

import { useEnforcementStore } from '../../stores/enforcementStore';
import { useGovernanceStore } from '../../stores/governanceStore';

export default function EnforcementPanel() {
  const quarantinedPayouts = useEnforcementStore((s) => s.quarantinedPayouts);
  const verifyCaseAndRelease = useEnforcementStore((s) => s.verifyCaseAndRelease);
  const forfeitCasePayout = useEnforcementStore((s) => s.forfeitCasePayout);
  const cases = useGovernanceStore((s) => s.cases);

  return (
    <div className={`absolute left-6 top-24 z-30 w-[360px] ${worldTheme.panel} ${worldTheme.spacing.innerPadding}`}>
      <div className={worldTheme.sectionLabel}>
        IRS Enforcement Grid
      </div>

      <div className="mt-4 max-h-[320px] space-y-3 overflow-y-auto pr-1">
        {quarantinedPayouts.length === 0 ? (
          <div className={`${worldTheme.panel} text-sm text-white/50`.trim()}>
            No quarantined payouts.
          </div>
        ) : (
          quarantinedPayouts.map((item) => {
            const relatedCase = cases.find((c) => c.id === item.caseId);

            return (
              <div
                key={item.id}
                className={`${worldTheme.panel} rounded-xl border border-orange-400/20 bg-orange-500/10 p-3`.trim()}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className={`${worldTheme.heading}`}>
                      $${item.amount} • XP ${item.xpAmount}
                    </div>
                    <div className="mt-1 text-xs text-white/55">
                      {relatedCase?.reason ?? 'Under enforcement review'}
                    </div>
                  </div>

                  <div className="text-xs uppercase tracking-[0.18em] text-orange-200/80">
                    {item.status}
                  </div>
                </div>

                {item.status === 'quarantined' ? (
                  <div className="mt-3 flex gap-2">
                    <WorldButton
                      onClick={() => verifyCaseAndRelease(item.caseId)}
                      variant="emerald" size="sm"
                    >
                      Verify + Release
                    </WorldButton>

                    <WorldButton
                      onClick={() => forfeitCasePayout(item.caseId)}
                      variant="red" size="sm"
                    >
                      Forfeit
                    </WorldButton>
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
