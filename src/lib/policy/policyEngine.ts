import type { GovernancePolicy } from './types';

export function compilePolicyOverrides(policy: GovernancePolicy | null): GovernancePolicy | null {
  if (!policy) return null;
  return { ...policy };
}

export function shouldLockDistrict(riskScore: number, threshold: number): boolean {
  return riskScore >= threshold;
}

export function shouldBlockAssignment(
  projectedRisk: number,
  tolerance: 'low' | 'medium' | 'high'
): boolean {
  if (tolerance === 'low' && projectedRisk > 30) return true;
  if (tolerance === 'medium' && projectedRisk > 60) return true;
  if (tolerance === 'high' && projectedRisk > 85) return true;
  return false;
}
