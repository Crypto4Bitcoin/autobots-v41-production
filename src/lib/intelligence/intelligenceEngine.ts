import { AgentTrait, PERSONALITY_TRAITS } from './personalityRegistry';
export interface IntelligenceMetadata {
  confidence: number;
  uncertaintyWeight: number;
  learningGain: number;
}
export function calculateConfidence(agentLevel: number, trait: AgentTrait, environmentStability: number, experience: number): number {
  const base = agentLevel * 5;
  const traitMod = PERSONALITY_TRAITS[trait].successRate;
  const growthFactor = Math.log10(experience + 10) * 2;
  const score = (base * traitMod + growthFactor) * (environmentStability / 100);
  return Math.min(Math.max(score, 0), 100);
}
export function calculateReinforcementReward(baseReward: number, confidence: number, trait: AgentTrait): number {
  const traitXp = PERSONALITY_TRAITS[trait].xpGain;
  const confidenceMultiplier = 1 + (confidence / 100);
  return Math.floor(baseReward * traitXp * confidenceMultiplier);
}
