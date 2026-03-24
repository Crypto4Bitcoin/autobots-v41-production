export function calculateAutoRepair(health: number, treasury: number): { repairedHealth: number; repairCost: number } {
  // Phase 151: Infrastructure health auto-scaling
  if (health > 90 || treasury < 1000) return { repairedHealth: health, repairCost: 0 };
  const target = 95;
  const delta = target - health;
  const costPerUnit = 20;
  const maxPossible = Math.floor(treasury / costPerUnit);
  const finalDelta = Math.min(delta, maxPossible);
  return { repairedHealth: health + finalDelta, repairCost: finalDelta * costPerUnit };
}
