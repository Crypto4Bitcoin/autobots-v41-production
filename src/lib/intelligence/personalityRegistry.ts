export type AgentTrait = 'ANALYTICAL' | 'AGGRESSIVE' | 'CAUTIOUS' | 'INNOVATIVE' | 'PERSISTENT' | 'ADAPTIVE';
export interface TraitModifiers {
  successRate: number;
  speed: number;
  riskTolerance: number;
  xpGain: number;
}
export const PERSONALITY_TRAITS: Record<AgentTrait, TraitModifiers> = {
  ANALYTICAL: { successRate: 1.15, speed: 0.9, riskTolerance: -0.1, xpGain: 1.25 },
  AGGRESSIVE: { successRate: 1.2, speed: 1.5, riskTolerance: 0.3, xpGain: 1.1 },
  CAUTIOUS: { successRate: 0.95, speed: 0.8, riskTolerance: -0.4, xpGain: 1.0 },
  INNOVATIVE: { successRate: 1.1, speed: 1.1, riskTolerance: 0.1, xpGain: 1.6 },
  PERSISTENT: { successRate: 1.05, speed: 1.0, riskTolerance: -0.05, xpGain: 1.3 },
  ADAPTIVE: { successRate: 1.1, speed: 1.1, riskTolerance: 0.05, xpGain: 1.2 },
};
