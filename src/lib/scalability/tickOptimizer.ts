export function calculateTargetTickRate(taskCount: number): number {
  // Phase 316: Dynamic tick rate
  if (taskCount > 50) return 2000;
  if (taskCount > 20) return 1000;
  return 500;
}
