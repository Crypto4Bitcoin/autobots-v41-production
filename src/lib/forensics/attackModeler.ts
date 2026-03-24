export function scoreMaliciousIntent(behavior: any[]): number {
  // Phase 226: Malicious intent scoring
  if (behavior.length === 0) return 0;
  const failures = behavior.filter(b => b.result === 'FAILURE').length;
  const trustDrops = behavior.filter(b => b.trustDelta < 0).length;
  return (failures * 10) + (trustDrops * 20);
}
