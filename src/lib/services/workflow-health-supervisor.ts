import { DBService } from "./supabase-service";
import { PlatformIntelligenceService } from "./platform-intelligence-service";

export interface SupervisionAlert {
  type: string;
  capability: string;
  message: string;
  metadata?: unknown;
}

export class WorkflowHealthSupervisor {
  intel = new PlatformIntelligenceService();

  /**
   * Analyzes platform health based on capability performance metrics.
   * Detects high latency and failure rate violations.
   */
  async analyzePlatformHealth() {
    console.log("[WorkflowHealthSupervisor] Starting platform health analysis...");
    
    // 1. Fetch capability performance stats from intelligence layer
    const capabilityStats = await this.intel.analyzeCapabilityPerformance();

    const alerts: SupervisionAlert[] = [];

    // 2. Performance & Health Threshold Rules
    Object.keys(capabilityStats).forEach(cap => {
      const stat = capabilityStats[cap];

      // Rule: Latency Trigger (Warning > 10s)
      if (stat.avgLatency > 10000) {
        alerts.push({
          type: "latency_warning",
          capability: cap,
          message: `High latency detected for ${cap}. Average: ${Math.round(stat.avgLatency)}ms.`,
          metadata: { avg_latency: stat.avgLatency }
        });
      }

      // Rule: Failure Rate Trigger (Warning > 20%)
      const failureRate = stat.runs > 0 ? stat.failures / stat.runs : 0;
      if (failureRate > 0.2) {
        alerts.push({
          type: "failure_rate_warning",
          capability: cap,
          message: `Failure rate for ${cap} is at ${Math.round(failureRate * 100)}%, exceeding 20% threshold.`,
          metadata: { failure_rate: failureRate, runs: stat.runs, failures: stat.failures }
        });
      }
    });

    // 3. Persist findings for governance/operator review
    if (alerts.length > 0) {
        console.log(`[WorkflowHealthSupervisor] Detected ${alerts.length} health alerts.`);
        await DBService.persistSupervisionAlerts(alerts);
    } else {
        console.log("[WorkflowHealthSupervisor] No health violations detected.");
    }

    return alerts;
  }
}
