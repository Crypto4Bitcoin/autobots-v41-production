export function calculateFirewallScaling(currentResilience: number, stability: number): number {
  // Phase 161: Automated firewall scaling
  const multiplier = 1 + ((100 - stability) / 200); // increase defense by up to 50% as stability drops
  return Math.min(100, currentResilience * multiplier);
}
export function shouldIsolateAgent(trustScore: number): boolean {
  // Phase 163: Intrusion response automation
  return trustScore < 30; // isolate agents with extremely low trust
}
