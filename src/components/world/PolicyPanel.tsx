'use client';
import WorldButton from './ui/WorldButton';
import { worldTheme } from '../../lib/world/theme';

import { usePolicyStore } from '../../stores/policyStore';

export default function PolicyPanel() {
  const policies = usePolicyStore((s) => s.policies);
  const activePolicyId = usePolicyStore((s) => s.activePolicyId);
  const activatePolicy = usePolicyStore((s) => s.activatePolicy);
  const deactivatePolicy = usePolicyStore((s) => s.deactivatePolicy);

  return (
    <div className={`absolute left-6 top-[370px] z-30 w-[360px] ${worldTheme.panel} ${worldTheme.spacing.innerPadding}`}>
      <div className={worldTheme.sectionLabel}>
        Command Doctrine
      </div>

      <div className="mt-4 space-y-3">
        {policies.map((policy) => {
          const isActive = policy.id === activePolicyId;
          return (
            <div
              key={policy.id}
              className={`rounded-xl border p-3 ${
                isActive
                  ? 'border-amber-400/20 bg-amber-500/10'
                  : 'border-white/10 bg-white/5 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`${worldTheme.heading}`}>{policy.name}</div>
                {isActive ? (
                  <WorldButton
                    onClick={deactivatePolicy}
                    className="rounded text-[10px] uppercase tracking-wider text-amber-300"
                  >
                    Active
                  </WorldButton>
                ) : (
                  <WorldButton
                    onClick={() => activatePolicy(policy.id)}
                    className="rounded text-[10px] uppercase tracking-wider text-white/50 hover:text-white"
                  >
                    Enact
                  </WorldButton>
                )}
              </div>
              <div className="mt-2 text-xs text-white/55">
                Yield Pref: {policy.simulationPreference} • Tolerance: {policy.assignmentRiskTolerance}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
