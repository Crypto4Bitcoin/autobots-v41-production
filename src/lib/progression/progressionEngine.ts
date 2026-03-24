import type { AgentNode, ProgressionPath } from '../world/types';
import type { ProgressionSnapshot, SkillNode } from './types';

export function getXpRequiredForLevel(level: number): number {
  return level * 150;
}

export function getProgressionSnapshot(level: number, xp: number): ProgressionSnapshot {
  const currentFloor = getXpRequiredForLevel(level);
  const nextLevelXp = getXpRequiredForLevel(level + 1);
  const span = nextLevelXp - currentFloor;
  const progress = Math.max(0, xp - currentFloor);
  const progressPercent = span <= 0 ? 100 : Math.min(100, Math.round((progress / span) * 100));

  return {
    level,
    xp,
    nextLevelXp,
    progressPercent,
  };
}

export function resolveLevelFromXp(xp: number): number {
  let level = 1;

  while (xp >= getXpRequiredForLevel(level + 1)) {
    level += 1;
  }

  return level;
}

export function awardXp(agent: AgentNode, amount: number): AgentNode {
  const nextXp = agent.xp + amount;
  const nextLevel = resolveLevelFromXp(nextXp);

  return {
    ...agent,
    xp: nextXp,
    level: nextLevel,
  };
}

export function canUnlockSkill(agent: AgentNode, skill: SkillNode): boolean {
  const pathAllowed =
    skill.path === 'any' || skill.path === agent.path;

  const levelAllowed = agent.level >= skill.requiredLevel;

  const prereqsMet = skill.requiresSkillIds.every((id) =>
    agent.unlockedSkillIds.includes(id)
  );

  const notAlreadyUnlocked = !agent.unlockedSkillIds.includes(skill.id);

  return pathAllowed && levelAllowed && prereqsMet && notAlreadyUnlocked;
}

export function unlockSkill(agent: AgentNode, skill: SkillNode): AgentNode {
  if (agent.unlockedSkillIds.includes(skill.id)) return agent;

  return {
    ...agent,
    unlockedSkillIds: [...agent.unlockedSkillIds, skill.id],
  };
}

export function setProgressionPath(
  agent: AgentNode,
  path: ProgressionPath
): AgentNode {
  return {
    ...agent,
    path,
  };
}

export function getSkillsForRole(role: string, skills: SkillNode[]): SkillNode[] {
  if (!role || !Array.isArray(skills)) return [];

  const normalizedRole = role.toLowerCase();

  return skills.filter((skill) => {
    if (!skill || typeof skill.role !== 'string') return false;
    return skill.role.toLowerCase() === normalizedRole;
  });
}