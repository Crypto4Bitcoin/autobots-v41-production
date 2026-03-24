import { MemoryEntry } from './globalMemory';
export function recognizeStabilityTrend(history: MemoryEntry[]): 'STABLE' | 'DEGRADING' | 'IMPROVING' {
  // Phase 144: Distributed pattern recognition
  if (history.length < 5) return 'STABLE';
  const recent = history.slice(-5).map(m => m.sentimentScore);
  const first = recent[0];
  const last = recent[recent.length - 1];
  if (last > first + 10) return 'IMPROVING';
  if (last < first - 10) return 'DEGRADING';
  return 'STABLE';
}
