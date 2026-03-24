export interface PerformanceMetric {
  agentId: string;
  avgDuration: number;
  successRate: number;
}
export function detectBehavioralAnomaly(metric: PerformanceMetric, baseline: PerformanceMetric): boolean {
  // item 121: Behavioral anomaly detection
  const durationDev = Math.abs(metric.avgDuration - baseline.avgDuration) / baseline.avgDuration;
  const rateDev = Math.abs(metric.successRate - baseline.successRate);
  
  // if duration is 50% faster/slower or success rate drops 20%
  return durationDev > 0.5 || rateDev > 0.2;
}
