import { AgentTrait } from '../intelligence/personalityRegistry';
export function calculateSynergy(traits1: AgentTrait[], traits2: AgentTrait[]): number {
  // Phase 265: Agent synergy
  const matches = traits1.filter(t => traits2.includes(t)).length;
  return 1 + (matches * 0.1);
}
