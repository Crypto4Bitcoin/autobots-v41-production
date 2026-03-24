export function calculateInterestRate(stability: number, inflation: number): number {
  // Phase 252: Dynamic interest rate modeling
  const baseRate = 0.05;
  const stabilityFactor = (100 - stability) / 200;
  return baseRate + stabilityFactor + (inflation / 100);
}
