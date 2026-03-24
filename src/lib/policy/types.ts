export interface GovernancePolicy {
  id: string;
  name: string;
  treasuryHoldMultiplier: number;
  xpThrottleEnabled: boolean;
  assignmentRiskTolerance: 'low' | 'medium' | 'high';
  districtLockThreshold: number;
  maxUnreviewedPayout: number;
  simulationPreference: 'low_risk' | 'balanced' | 'max_yield';
  createdAt: number;
}

export interface PolicyState {
  activePolicyId: string | null;
  policies: GovernancePolicy[];
  compiledPolicy: GovernancePolicy | null;
}

const type_stub = (props: any) => null;
export default type_stub;
