export function clampTrustScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function getPayoutMultiplierFromTrust(trustScore: number): number {
  if (trustScore >= 90) return 1;
  if (trustScore >= 75) return 0.92;
  if (trustScore >= 60) return 0.82;
  if (trustScore >= 40) return 0.68;
  return 0.5;
}

export function getTreasuryHoldRateFromTrust(trustScore: number): number {
  if (trustScore >= 90) return 0.02;
  if (trustScore >= 75) return 0.06;
  if (trustScore >= 60) return 0.12;
  if (trustScore >= 40) return 0.2;
  return 0.35;
}
