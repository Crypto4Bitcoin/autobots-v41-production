import type { AgentNode, DistrictNode } from '../world/types';
import type { PenaltyRecord } from '../penalties/types';
import type {
  AgentRiskForecast,
  DistrictRiskForecast,
  TreasuryExposureForecast,
} from './types';

function getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 85) return 'critical';
  if (score >= 65) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

export function forecastAgentRisk(
  agent: AgentNode,
  penalties: PenaltyRecord[]
): AgentRiskForecast {
  let riskScore = 0;
  const reasons: string[] = [];

  if (agent.status === 'jailed') {
    riskScore += 55;
    reasons.push('Agent is jailed');
  }

  if (agent.status === 'alert') {
    riskScore += 25;
    reasons.push('Agent is already in alert state');
  }

  if (agent.status === 'paused') {
    riskScore += 15;
    reasons.push('Paused agents increase workflow instability');
  }

  if (agent.trustScore < 80) {
    riskScore += 20;
    reasons.push('Trust score below 80');
  }

  if (agent.trustScore < 60) {
    riskScore += 20;
    reasons.push('Trust score below 60');
  }

  if (agent.path === 'enterprise') {
    riskScore += 10;
    reasons.push('Enterprise path carries larger institutional risk');
  }

  const activePenalties = penalties.filter(
    (penalty) => penalty.active && penalty.agentId === agent.id
  );

  if (activePenalties.length > 0) {
    riskScore += activePenalties.length * 12;
    reasons.push(`${activePenalties.length} active penalty records`);
  }

  return {
    agentId: agent.id,
    agentName: agent.name,
    district: agent.district,
    riskScore: Math.min(100, riskScore),
    riskLevel: getRiskLevel(Math.min(100, riskScore)),
    reasons,
    createdAt: Date.now(),
  };
}

export function forecastDistrictRisk(
  district: DistrictNode,
  penalties: PenaltyRecord[]
): DistrictRiskForecast {
  let riskScore = 0;
  const reasons: string[] = [];

  if (district.restrictionLevel === 'restricted') {
    riskScore += 35;
    reasons.push('District is restricted');
  }

  if (district.restrictionLevel === 'locked') {
    riskScore += 70;
    reasons.push('District is locked');
  }

  if (district.trustScore < 85) {
    riskScore += 15;
    reasons.push('District trust score below 85');
  }

  if (district.trustScore < 70) {
    riskScore += 20;
    reasons.push('District trust score below 70');
  }

  const districtPenalties = penalties.filter(
    (penalty) => penalty.active && penalty.district === district.id
  );

  if (districtPenalties.length > 0) {
    riskScore += districtPenalties.length * 10;
    reasons.push(`${districtPenalties.length} district penalty records`);
  }

  return {
    district: district.id,
    riskScore: Math.min(100, riskScore),
    riskLevel: getRiskLevel(Math.min(100, riskScore)),
    reasons,
    createdAt: Date.now(),
  };
}

export function forecastTreasuryExposure(input: {
  estimatedGross: number;
  averageTrustScore: number;
  openSignalCount: number;
}): TreasuryExposureForecast {
  const holdRate =
    input.averageTrustScore >= 90
      ? 0.03
      : input.averageTrustScore >= 75
      ? 0.08
      : input.averageTrustScore >= 60
      ? 0.14
      : 0.22;

  const estimatedHeldAmount = Math.round(input.estimatedGross * holdRate);
  const estimatedReleasedAmount = input.estimatedGross - estimatedHeldAmount;
  const estimatedQuarantineRisk = Math.min(
    100,
    Math.round((input.openSignalCount * 12) + (100 - input.averageTrustScore) * 0.8)
  );

  return {
    estimatedHeldAmount,
    estimatedReleasedAmount,
    estimatedQuarantineRisk,
    createdAt: Date.now(),
  };
}
