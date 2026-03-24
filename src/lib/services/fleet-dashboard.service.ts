import { supabase } from "./supabase-service";

export interface FleetMetrics {
  total_workers: number;
  active_workers: number;
  pool_distribution: Record<string, number>;
  region_health: Record<string, "healthy" | "degraded" | "down">;
  version_drift_detected: boolean;
}

export class FleetDashboardService {
  /**
   * Aggregates real-time metrics for the distributed worker fleet.
   */
  async getFleetMetrics(): Promise<FleetMetrics> {
    console.log("[FleetDashboard] Aggregating distributed fleet metrics...");

    const { data: nodes, error } = await supabase
      .from("cluster_nodes")
      .select("*");

    if (error || !nodes) throw new Error("[FleetDashboard] Failed to fetch cluster nodes.");

    const metrics: FleetMetrics = {
      total_workers: nodes.length,
      active_workers: nodes.filter(n => n.status === "active").length,
      pool_distribution: {},
      region_health: {},
      version_drift_detected: false
    };

    // Calculate distributions
    nodes.forEach(node => {
      metrics.pool_distribution[node.pool] = (metrics.pool_distribution[node.pool] || 0) + 1;
      
      // Simplistic region health logic
      if (!metrics.region_health[node.region]) {
          metrics.region_health[node.region] = "healthy";
      }
    });

    return metrics;
  }
}
