import { DBService } from "./supabase-service";

export interface CapabilityStats {
  runs: number;
  failures: number;
  latencyTotal: number;
  avgLatency: number;
}

export class PlatformIntelligenceService {
  /**
   * Analyzes capability performance from recent pipeline events.
   */
  async analyzeCapabilityPerformance() {
    console.log("[PlatformIntelligence] Analyzing capability performance from event backbone...");
    
    // In our evented system, 'agent_completed' events contain the latency and capability info
    const events = await DBService.getRecentEvents("agent_completed");

    const stats: Record<string, CapabilityStats> = {};

    events.forEach(e => {
      // Node events usually have the capability in the payload or associated node_run
      const cap = e.payload?.capability || "unknown";

      if (!stats[cap]) {
        stats[cap] = {
          runs: 0,
          failures: 0,
          latencyTotal: 0,
          avgLatency: 0
        };
      }

      stats[cap].runs++;

      if (e.payload?.status === "failed") {
        stats[cap].failures++;
      }

      if (e.payload?.latency_ms) {
        stats[cap].latencyTotal += e.payload.latency_ms;
      }
    });

    Object.keys(stats).forEach(cap => {
      if (stats[cap].runs > 0) {
        stats[cap].avgLatency = stats[cap].latencyTotal / stats[cap].runs;
      }
    });

    // Record insights for future supervision (Phase 15)
    for (const cap of Object.keys(stats)) {
      await DBService.recordInsight({
        insight_type: "capability_latency",
        target: cap,
        value: { avg_ms: stats[cap].avgLatency, failure_rate: stats[cap].failures / stats[cap].runs }
      });
    }

    return stats;
  }
}
