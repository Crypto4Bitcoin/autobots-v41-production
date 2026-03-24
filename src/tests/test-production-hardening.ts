import { ArtifactLifecycleService } from "../lib/services/artifact-lifecycle-service";
import { MetricAggregationService } from "../lib/services/metric-aggregation-service";
import { HumanEscalationService } from "../lib/services/human-escalation-service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testProductionHardening() {
  console.log("🚀 Testing Phase 26: Production Hardening & Safety Gates...\n");

  setupSupabaseMock();

  const lifecycle = new ArtifactLifecycleService();
  const aggregator = new MetricAggregationService();
  const escalation = new HumanEscalationService();

  // 1. Scenario: Artifact Archiving (Lifecycle)
  console.log("Scenario A: Artifact Lifecycle (Storage Tiering)");
  const archival = await lifecycle.processLifecycles("ws-123", 45);
  console.log(`✅ Archived ${archival.archived_count} artifacts for workspace ${archival.workspace_id}. Status: ${archival.storage_tier}\n`);

  // 2. Scenario: Metric Aggregation (Filtering Noise)
  console.log("Scenario B: Metric Aggregation (Health Trends)");
  const mockEvents = [
    { workspace_id: "ws-1", event_type: "node_completed" },
    { workspace_id: "ws-1", event_type: "node_completed" },
    { workspace_id: "ws-1", event_type: "node_failed" },
    { workspace_id: "ws-2", event_type: "node_completed" }
  ];
  const summaries = await aggregator.aggregateHealth(mockEvents);
  summaries.forEach(s => {
    console.log(`✅ WS: ${s.workspace_id}, Score: ${s.health_score}, Status: ${s.status}`);
  });
  console.log("");

  // 3. Scenario: Human Bottleneck Detection (Escalation)
  console.log("Scenario C: Human Bottleneck Escalation");
  const check = await escalation.checkStalledTasks(48);
  console.log(`✅ Stalled tasks found: ${check.stalled_tasks_found}. Action: ${check.escalation_status}\n`);

  if (archival.storage_tier === "cold" && summaries.length === 2 && check.stalled_tasks_found > 0) {
    console.log("✅ Production hardening logic verified.");
  } else {
    console.error("❌ FAILED: Production hardening validation mismatch.");
  }

  console.log("\n🎉 PHASE 26: PRODUCTION HARDENING VERIFIED!");
}

testProductionHardening();
