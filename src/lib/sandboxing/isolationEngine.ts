export function enforceResourceLimits(usage: number, limit: number): boolean {
  // Phase 205: Sandbox resource limits
  return usage <= limit;
}
export function filterNetworkEgress(origin: string, destination: string): boolean {
  // Phase 204: Network egress filtering
  const allowed = ['kernel.local', 'market.local', 'diplomacy.ext'];
  return allowed.includes(destination);
}
