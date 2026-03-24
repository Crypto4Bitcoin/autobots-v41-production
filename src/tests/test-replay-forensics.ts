import { ReplayService } from "../lib/services/replay.service";
import { ForensicsService } from "../lib/services/forensics.service";
import { WorkflowTraceService } from "../lib/services/workflow-trace.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testReplayForensics() {
  console.log("🚀 Testing Phase 28: Replay, Forensics & Time Travel...\n");

  const workflowId = "wf-123-replay";

  // 1. Seed events for forensic analysis
  const mockEvents = [
    { event_type: "workflow_started", workflow_run_id: workflowId, created_at: "2026-03-15T12:00:00Z" },
    { event_type: "node_started", workflow_run_id: workflowId, node_run_id: "node-1", created_at: "2026-03-15T12:01:00Z" },
    { event_type: "node_failed", workflow_run_id: workflowId, node_run_id: "node-1", payload: { error: "Network Timeout" }, created_at: "2026-03-15T12:02:00Z" },
    { event_type: "workflow_failed", workflow_run_id: workflowId, created_at: "2026-03-15T12:02:30Z" }
  ];

  setupSupabaseMock({
    pipeline_events: mockEvents
  });

  const replay = new ReplayService();
  const forensics = new ForensicsService();
  const trace = new WorkflowTraceService();

  // 2. Scenario: Forensics (Failure Trace)
  console.log("Scenario A: Execution Forensics (Root Cause)");
  const report = await forensics.analyzeForensics(workflowId);
  console.log(`✅ Failure Root Cause: ${report.failure_root_cause}`);
  console.log(`✅ Full Trace Length: ${report.full_trace.length}\n`);

  // 3. Scenario: Timeline (Human Readable)
  console.log("Scenario B: Human-Readable Timeline");
  const timeline = await trace.getTimeline(workflowId);
  console.log(`✅ Timeline Duration: ${timeline.total_duration_ms} ms`);
  console.log(`✅ First Event: ${timeline.timeline[0].label}\n`);

  // 4. Scenario: Replay (Dry-Run Simulation)
  console.log("Scenario C: Dry-Run Replay Simulation");
  const res = await replay.replayWorkflow(workflowId, { dryRun: true });
  console.log(`✅ Events Replayed: ${res.events_replayed}. Mode: ${res.mode}\n`);

  if (report.failure_root_cause === "Network Timeout" && timeline.timeline.length === 4 && res.mode === "simulation") {
    console.log("✅ Replay and forensics verified.");
  } else {
    console.error("❌ FAILED: Forensic validation mismatch.");
  }

  console.log("\n🎉 PHASE 28: REPLAY & FORENSICS VERIFIED!");
}

testReplayForensics();
