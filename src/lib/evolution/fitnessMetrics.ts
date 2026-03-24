export function calculateFitness(performanceLogs: any[]): number {
  // Phase 185/190: Global evolutionary fitness
  if (performanceLogs.length === 0) return 50;
  const successRate = performanceLogs.filter(p => p.result === 'SUCCESS').length / performanceLogs.length;
  return Math.floor(successRate * 100);
}
