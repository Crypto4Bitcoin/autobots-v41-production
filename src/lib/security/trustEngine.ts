export function calculateTrustDecay(currentTrust: number, failureCount: number, riskLevel: number): number {
  // item 123: Trust decay/recovery engine
  const decayBase = 2;
  const multiplier = 1 + (riskLevel / 10);
  const totalDecay = failureCount * decayBase * multiplier;
  return Math.max(0, currentTrust - totalDecay);
}
export function calculateTrustRecovery(currentTrust: number, successStreak: number): number {
  const recoveryBase = 0.5;
  const totalRecovery = Math.log2(successStreak + 1) * recoveryBase;
  return Math.min(100, currentTrust + totalRecovery);
}
