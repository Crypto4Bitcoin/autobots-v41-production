import { AgentTrait } from '../intelligence/personalityRegistry';
export function mutateTrait(currentTraits: AgentTrait[]): AgentTrait[] {
  // Phase 181: Self-modifying code (traits)
  const allTraits: AgentTrait[] = ['ANALYTICAL', 'AGGRESSIVE', 'CAUTIOUS', 'INNOVATIVE', 'PERSISTENT', 'ADAPTIVE'];
  const randomTrait = allTraits[Math.floor(Math.random() * allTraits.length)];
  return [...new Set([...currentTraits, randomTrait])].slice(-3); // Keep up to 3 traits
}
