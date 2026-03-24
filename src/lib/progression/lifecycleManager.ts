export function applyFatigue(fatigue: number, isWorking: boolean): number {
  // Phase 267: Morale/Fatigue tracking
  if (isWorking) return Math.min(100, fatigue + 2);
  return Math.max(0, fatigue - 5);
}
export function shouldRetire(age: number, performance: number): boolean {
  // Phase 261: Agent retirement
  return age > 1000 && performance < 30;
}
