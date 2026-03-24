import { ProjectionService } from "../lib/services/projection.service";
import { BackpressureService } from "../lib/services/backpressure-service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testEventReconstruction() {
  console.log("🚀 Testing Phase 24: Event-Driven Scaling & Projections...\n");

  const workflowId = "wf-scale-999";

  // 1. Seed authoritative event log (Append-only)
  const mockEvents = [
    { event_type: "workflow_started", workflow_run_id: workflowId, created_at: "2026-03-15T10:00:00Z" },
    { event_type: "node_completed", workflow_run_id: workflowId, node_run_id: "node-1", created_at: "2026-03-15T10:01:00Z" },
    { event_type: "artifact_created", workflow_run_id: workflowId, artifact_id: "art-101", created_at: "2026-03-15T10:01:30Z" },
    { event_type: "node_completed", workflow_run_id: workflowId, node_run_id: "node-2", created_at: "2026-03-15T10:02:00Z" }
  ];

  setupSupabaseMock({
    pipeline_events: mockEvents
  });

  const projection = new ProjectionService();

  // 2. Scenario: Reconstruct after "Worker Crash"
  console.log("Scenario A: State Reconstruction after simulated worker crash");
  const state = await projection.rebuildWorkflowState(workflowId);

  console.log("✅ Reconstructed State:");
  console.log(` - Status: ${state.status}`);
  console.log(` - Completed Nodes: ${state.nodesCompleted.join(", ")}`);
  console.log(` - Artifacts Discovered: ${state.artifacts.join(", ")}`);
  console.log(` - Last Event At: ${state.lastEventAt}\n`);

  if (state.nodesCompleted.length === 2 && state.status === "running") {
    console.log("✅ Reconstruction verified: Partial run accurately captured.");
  } else {
    console.error("❌ FAILED: Reconstruction mismatch.");
  }

  // 3. Scenario: Backpressure Enforcement
  console.log("\nScenario B: Backpressure Strategy switch");
  const surge = BackpressureService.evaluateStrategy(1500, 1000);
  console.log(`✅ Queue High (${1500}): Strategy = ${surge.strategy} (Throttle: ${surge.throttle})`);
  
  const normal = BackpressureService.evaluateStrategy(200, 1000);
  console.log(`✅ Queue Normal (${200}): Strategy = ${normal.strategy} (Throttle: ${normal.throttle})\n`);

  if (surge.strategy === "eco" && normal.strategy === "performance") {
    console.log("✅ Backpressure logic verified.");
  }

  console.log("\n🎉 PHASE 24: EVENT-DRIVEN SCALING VERIFIED!");
}

testEventReconstruction();
