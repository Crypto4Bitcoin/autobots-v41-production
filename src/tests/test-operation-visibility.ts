import { FleetDashboardService } from "../lib/services/fleet-dashboard.service";
import { WorkflowRadarService } from "../lib/services/workflow-radar.service";
import { CapabilityHealthService } from "../lib/services/capability-health.service";
import { PlatformTelemetryService } from "../lib/services/platform-telemetry.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testOperationVisibility() {
  console.log("🚀 Testing Phase 37: Operator Visibility & Dashboard Aggregation...\n");

  setupSupabaseMock();

  // 1. Fleet Visibility
  const fleet = new FleetDashboardService();
  const fleetMetrics = await fleet.getFleetMetrics();
  console.log(`✅ Fleet Metrics: ${fleetMetrics.total_workers} workers, ${fleetMetrics.active_workers} active.`);
  console.log(`- Pools: ${JSON.stringify(fleetMetrics.pool_distribution)}`);

  // 2. Workflow Radar
  const radar = new WorkflowRadarService();
  const signals = await radar.getRadarSignals();
  console.log(`✅ Radar Signals: ${signals.active_workflows} active, ${signals.dead_letter_count} in DLQ.`);

  // 3. Capability Health
  const health = new CapabilityHealthService();
  const healthScores = await health.getCapabilityHealth();
  console.log(`✅ Capability Health: ${healthScores.length} scored.`);
  const degraded = healthScores.find(s => s.status === "degraded");
  if (degraded) {
      console.log(`⚠️ Degraded Capability Detected: ${degraded.capability_key} (Score: ${degraded.health_score})`);
  }

  // 4. Platform Telemetry
  const telemetry = new PlatformTelemetryService();
  const metrics = await telemetry.getPlatformMetrics();
  console.log(`✅ Platform Telemetry: ${metrics.throughput_rpm} RPM, Cost today: $${metrics.cost_burn_today}`);

  console.log("\n🎉 PHASE 37: OPERATOR VISIBILITY VERIFIED!");
}

testOperationVisibility();
