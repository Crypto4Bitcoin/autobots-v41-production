import type { AgentNode, DistrictNode } from '../world/types';
import type { PenaltyRecord } from '../penalties/types';
import type { RouteCandidate, SimulationDecision } from './types';
import { getPayoutMultiplierFromTrust, getTreasuryHoldRateFromTrust } from '../reputation/reputationEngine';

function isAgentBlocked(agent: AgentNode, penalties: PenaltyRecord[]) {
  if (agent.status === 'jailed' || agent.status === 'paused') return true;

  return penalties.some(
    (penalty) =>
      penalty.active &&
      penalty.agentId === agent.id &&
      penalty.type === 'assignment_block'
  );
}

function getDistrictBlocked(district: DistrictNode | undefined) {
  if (!district) return true;
  return district.restrictionLevel === 'locked';
}

function scoreCandidate(input: {
  agent: AgentNode;
  district: DistrictNode | undefined;
  payoutAmount: number;
  penalties: PenaltyRecord[];
  strategy: 'balanced' | 'low_risk' | 'max_yield';
}): RouteCandidate | null {
  const { agent, district, payoutAmount, penalties, strategy } = input;

  if (isAgentBlocked(agent, penalties)) return null;
  if (getDistrictBlocked(district)) return null;

  const payoutMultiplier = getPayoutMultiplierFromTrust(agent.trustScore);
  const adjustedPayout = Math.round(payoutAmount * payoutMultiplier);
  const holdRate = getTreasuryHoldRateFromTrust(agent.trustScore);
  const projectedHold = Math.round(adjustedPayout * holdRate);

  let projectedRisk = 0;
  const reasons: string[] = [];

  if (agent.trustScore < 80) {
    projectedRisk += 20;
    reasons.push('Trust score below 80');
  }

  if (agent.trustScore < 60) {
    projectedRisk += 25;
    reasons.push('Trust score below 60');
  }

  if (agent.path === 'enterprise') {
    projectedRisk += 10;
    reasons.push('Enterprise path carries more institutional exposure');
  }

  if (district?.restrictionLevel === 'restricted') {
    projectedRisk += 25;
    reasons.push('District is currently restricted');
  }

  const activePenaltyCount = penalties.filter(
    (penalty) => penalty.active && penalty.agentId === agent.id
  ).length;

  if (activePenaltyCount > 0) {
    projectedRisk += activePenaltyCount * 10;
    reasons.push(`${activePenaltyCount} active penalty records`);
  }

  if (strategy === 'low_risk') {
    projectedRisk = Math.round(projectedRisk * 1.15);
  }

  if (strategy === 'max_yield') {
    projectedRisk = Math.round(projectedRisk * 0.9);
  }

  return {
    taskId: '',
    agentId: agent.id,
    agentName: agent.name,
    district: agent.district,
    projectedPayout: adjustedPayout - projectedHold,
    projectedHold,
    projectedRisk: Math.min(100, projectedRisk),
    trustScore: agent.trustScore,
    selected: false,
    reasons,
  };
}

export function simulateTaskRouting(input: {
  taskId: string;
  requiredRole: string;
  payoutAmount: number;
  agents: AgentNode[];
  districts: DistrictNode[];
  penalties: PenaltyRecord[];
  strategy: 'balanced' | 'low_risk' | 'max_yield';
}): SimulationDecision {
  const candidates = input.agents
    .filter(
      (agent) =>
        input.requiredRole === 'Any' ||
        agent.role.toLowerCase() === input.requiredRole.toLowerCase()
    )
    .map((agent) =>
      scoreCandidate({
        agent,
        district: input.districts.find((d) => d.id === agent.district),
        payoutAmount: input.payoutAmount,
        penalties: input.penalties,
        strategy: input.strategy,
      })
    )
    .filter(Boolean) as RouteCandidate[];

  const normalized = candidates.map((candidate) => ({
    ...candidate,
    taskId: input.taskId,
  }));

  let selected: RouteCandidate | null = null;

  if (input.strategy === 'low_risk') {
    selected =
      [...normalized].sort((a, b) => {
        if (a.projectedRisk !== b.projectedRisk) {
          return a.projectedRisk - b.projectedRisk;
        }
        return b.trustScore - a.trustScore;
      })[0] ?? null;
  } else if (input.strategy === 'max_yield') {
    selected =
      [...normalized].sort((a, b) => {
        if (a.projectedPayout !== b.projectedPayout) {
          return b.projectedPayout - a.projectedPayout;
        }
        return a.projectedRisk - b.projectedRisk;
      })[0] ?? null;
  } else {
    selected =
      [...normalized].sort((a, b) => {
        const aScore = a.projectedPayout - a.projectedRisk * 4;
        const bScore = b.projectedPayout - b.projectedRisk * 4;
        return bScore - aScore;
      })[0] ?? null;
  }

  const finalCandidates = normalized.map((candidate) => ({
    ...candidate,
    selected: candidate.agentId === selected?.agentId,
  }));

  return {
    taskId: input.taskId,
    selectedAgentId: selected?.agentId ?? null,
    selectedAgentName: selected?.agentName ?? null,
    strategy: input.strategy,
    reasons: selected?.reasons ?? ['No viable route candidates'],
    candidates: finalCandidates,
    createdAt: Date.now(),
  };
}
