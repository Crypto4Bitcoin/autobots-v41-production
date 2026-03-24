import type { AgentNode, DistrictNode } from '../world/types';
import type { PenaltyRecord } from './types';

export function isAgentAssignmentBlocked(
  agent: AgentNode,
  penalties: PenaltyRecord[]
): boolean {
  if (agent.status === 'jailed') return true;

  return penalties.some(
    (penalty) =>
      penalty.active &&
      penalty.agentId === agent.id &&
      penalty.type === 'assignment_block'
  );
}

export function isSkillUnlockBlocked(
  agent: AgentNode,
  penalties: PenaltyRecord[]
): boolean {
  return penalties.some(
    (penalty) =>
      penalty.active &&
      penalty.agentId === agent.id &&
      (penalty.type === 'skill_block' || penalty.type === 'enterprise_suspension')
  );
}

export function isDistrictAccessible(
  district: DistrictNode
): boolean {
  return district.restrictionLevel !== 'locked';
}

export function applyDistrictRestriction(
  district: DistrictNode,
  level: DistrictNode['restrictionLevel']
): DistrictNode {
  return {
    ...district,
    restrictionLevel: level,
  };
}
