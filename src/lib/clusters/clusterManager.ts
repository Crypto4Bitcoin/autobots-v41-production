export interface Cluster { id: string; region: string; status: 'online' | 'offline' | 'degraded'; load: number }
export function calculateShardIndex(agentId: string, clusterCount: number): number {
  // Phase 212: Multi-region state sharding
  let hash = 0;
  for (let i = 0; i < agentId.length; i++) hash = (hash << 5) - hash + agentId.charCodeAt(i);
  return Math.abs(hash % clusterCount);
}
