import { create } from 'zustand';
import type { GovernancePolicy, PolicyState } from '../lib/policy/types';
import { compilePolicyOverrides } from '../lib/policy/policyEngine';

const DEFAULT_POLICIES: GovernancePolicy[] = [
  {
    id: 'policy-expansion',
    name: 'Aggressive Expansion',
    treasuryHoldMultiplier: 0.5,
    xpThrottleEnabled: false,
    assignmentRiskTolerance: 'high',
    districtLockThreshold: 85,
    maxUnreviewedPayout: 5000,
    simulationPreference: 'max_yield',
    createdAt: Date.now(),
  },
  {
    id: 'policy-stabilize',
    name: 'System Stabilization',
    treasuryHoldMultiplier: 1.5,
    xpThrottleEnabled: true,
    assignmentRiskTolerance: 'low',
    districtLockThreshold: 45,
    maxUnreviewedPayout: 800,
    simulationPreference: 'low_risk',
    createdAt: Date.now(),
  },
  {
    id: 'policy-balanced',
    name: 'Balanced Governance',
    treasuryHoldMultiplier: 1.0,
    xpThrottleEnabled: false,
    assignmentRiskTolerance: 'medium',
    districtLockThreshold: 70,
    maxUnreviewedPayout: 2000,
    simulationPreference: 'balanced',
    createdAt: Date.now(),
  },
];

interface PolicyStore extends PolicyState {
  activatePolicy: (policyId: string) => void;
  deactivatePolicy: () => void;
}

export const usePolicyStore = create<PolicyStore>((set, get) => ({
  activePolicyId: null,
  policies: DEFAULT_POLICIES,
  compiledPolicy: null,

  activatePolicy: (policyId) => {
    const policy = get().policies.find((p) => p.id === policyId) ?? null;
    const compiledPolicy = compilePolicyOverrides(policy);

    set({ activePolicyId: policyId, compiledPolicy });
  },

  deactivatePolicy: () => {
    set({ activePolicyId: null, compiledPolicy: null });
  },
}));
