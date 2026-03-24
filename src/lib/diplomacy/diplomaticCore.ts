export type DiplomaticStance = 'Hostile' | 'Neutral' | 'Allied';
export interface ExternalWorld { id: string; name: string; stance: DiplomaticStance; lastDiscovery: number }
export function calculateDiplomaticPenalty(stance: DiplomaticStance): number {
  if (stance === 'Hostile') return 0.5; // 50% reward reduction
  if (stance === 'Allied') return 1.5; // 50% reward boost
  return 1.0;
}
