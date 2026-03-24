export interface RealityState { anchorId: string; driftValue: number; isActive: boolean }
export function calculateRealityDrift(groundTruth: number, shadowResults: number[]): number {
  // Phase 194: Reality drift detection
  if (shadowResults.length === 0) return 0;
  const avg = shadowResults.reduce((a, b) => a + b, 0) / shadowResults.length;
  return Math.abs(groundTruth - avg);
}
