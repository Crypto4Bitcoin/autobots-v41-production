import type { AgentNode } from '../world/types';
import type { GovernanceCase, GovernanceSeverity } from './types';

function makeSeverity(score: number): GovernanceSeverity {
  if (score >= 90) return 'critical';
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

export function evaluateProgressionRisk(params: {
  agent: AgentNode;
  xpAwarded: number;
  payoutAmount: number;
  taskTitle?: string;
  taskId?: string | null;
}): GovernanceCase | null {
  const { agent, xpAwarded, payoutAmount, taskTitle, taskId } = params;

  let riskScore = 0;
  const reasons: string[] = [];

  if (xpAwarded >= 500) {
    riskScore += 35;
    reasons.push('Large XP jump detected');
  }

  if (payoutAmount >= 10000) {
    riskScore += 35;
    reasons.push('Large payout threshold exceeded');
  }

  if (agent.level >= 10 && xpAwarded >= 250) {
    riskScore += 20;
    reasons.push('High-level agent received unusually large XP');
  }

  if (agent.status === 'paused' || agent.status === 'alert') {
    riskScore += 25;
    reasons.push('Agent state was not ideal for normal progression');
  }

  if (riskScore < 40) return null;

  return {
    id: `gov-${agent.id}-${Date.now()}`,
    agentId: agent.id,
    taskId: taskId ?? null,
    reason: `${reasons.join(' | ')}${taskTitle ? ` | Task: ${taskTitle}` : ''}`,
    severity: makeSeverity(riskScore),
    status: riskScore >= 90 ? 'jailed' : riskScore >= 70 ? 'flagged' : 'reviewing',
    createdAt: Date.now(),
  };
}