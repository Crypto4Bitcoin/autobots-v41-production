export function calculateVelocityMod(idleCount: number): number {
  return idleCount > 0 ? 1 / (1 + idleCount) : 0;
}

export interface MarketVelocity {
  value: number;
  momentum: number;
  equilibriumFactor: number;
}

export function calculateDynamicReward(templateId: string, basePayout: number, velocity: any): number {
  return Math.floor(basePayout * (velocity.value || 1));
}
