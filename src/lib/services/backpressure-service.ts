export class BackpressureService {
  /**
   * Monitors queue depth and recommends strategy adjustments.
   * Prevents platform crashes under extreme surge conditions.
   */
  static evaluateStrategy(queueDepth: number, maxDepth: number = 1000) {
    if (queueDepth > maxDepth) {
      console.warn(`[Backpressure] CRITICAL: Queue depth (${queueDepth}) exceeds threshold! Enforcing 'ECO' mode.`);
      return { strategy: "eco", throttle: true, message: "Maximum backlog reached." };
    }

    if (queueDepth > maxDepth * 0.7) {
      console.warn(`[Backpressure] WARNING: High queue depth (${queueDepth}). Switching to 'STABLE' mode.`);
      return { strategy: "stable", throttle: false, message: "Backpressure builds." };
    }

    return { strategy: "performance", throttle: false, message: "Optimal throughput." };
  }
}
