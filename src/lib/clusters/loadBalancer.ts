import { Cluster } from './clusterManager';
export function balanceLoad(clusters: Cluster[]): string {
  // Phase 213: Dynamic cluster load balancing
  return [...clusters].sort((a,b) => a.load - b.load)[0]?.id;
}
