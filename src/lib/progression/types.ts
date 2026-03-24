import type { ProgressionPath } from '../world/types';

export type SkillTier = 1 | 2 | 3 | 4;

export interface SkillNode {
  id: string;
  role: string;
  label: string;
  description: string;
  tier: SkillTier;
  requiredLevel: number;
  path: ProgressionPath | 'any';
  requiresSkillIds: string[];
}

export interface ProgressionSnapshot {
  level: number;
  xp: number;
  nextLevelXp: number;
  progressPercent: number;
}

export interface ProgressionState {
  selectedSkillRole: string | null;
}
const type_stub = (props: any) => null;
export default type_stub;
