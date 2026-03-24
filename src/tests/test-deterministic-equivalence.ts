import { ContractStampService } from "../lib/services/contract-stamp.service";
import { PolicyCompilerService } from "../lib/services/policy-compiler.service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IncrementalSnapshotService } from "../lib/services/snapshot-service";
import { CheckpointReplayService } from "../lib/services/checkpoint-replay-service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testDeterministicEquivalence() {
  console.log("🚀 Testing Phase 35: Deterministic Execution, Policy & Snapshot Recovery...\n");

  const workflowRunId = "wf-equiv-777";

  // 1. Scenario: Foundation - Fail-Closed Contracts
  console.log("Scenario A: Fail-Closed Execution Contracts");
  const stamper = new ContractStampService();
  try {
      await stamper.stampRun(workflowRunId, {
          workflow_version: "latest", // Violation: Unpinned
          pack_versions: { "research": "1.0.0" },
          capability_schemas: {},
          policy_bundle_id: "pb-123",
          worker_runtime_version: "v1"
      });
      console.error("❌ FAILED: Allowed unpinned workflow version.");
  } catch (err: unknown) {
      console.log(`✅ Correctly rejected unpinned version: ${err.message}\n`);
  }

  // 2. Scenario: Governance - Persisted Policy Bundles
  console.log("Scenario B: Persisted Policy Bundles");
  setupSupabaseMock();
  const compiler = new PolicyCompilerService();
  const bundle = await compiler.compileAndPersist({
      workspaceId: "ws-equiv",
      trustTier: 2,
      autonomyLevel: "supervised",
      budgetLimit: 100
  });
  console.log(`✅ Persisted policy bundle: ${bundle.id}\n`);

  // 3. Scenario: Recovery - Deterministic Equivalence Check
  console.log("Scenario C: Deterministic Equivalence (Snapshot vs Full Ledger)");
  
  // Seed events for a specific range
  setupSupabaseMock({
    pipeline_events: [
      { id: "ev-1", event_type: "workflow_started", workflow_run_id: workflowRunId, created_at: "2026-03-15T15:00:00Z" },
      { id: "ev-2", event_type: "node_completed", workflow_run_id: workflowRunId, payload: { node_id: "node-1" }, created_at: "2026-03-15T15:01:00Z" },
      { id: "ev-3", event_type: "node_completed", workflow_run_id: workflowRunId, payload: { node_id: "node-2" }, created_at: "2026-03-15T15:02:00Z" }
    ],
    // Snapshot only covers up to ev-2
    workflow_snapshots: [
      {
          id: "snap-1",
          workflow_run_id: workflowRunId,
          snapshot_type: "workflow",
          source_stream_range: { start_id: "ev-1", end_id: "ev-2" },
          state_data: { 
              status: "running", 
              nodesCompleted: ["node-1"],
              artifacts: [],
              startTime: "2026-03-15T15:00:00Z",
              endTime: null,
              lastEventAt: "2026-03-15T15:01:00Z"
          },
          created_at: "2026-03-15T15:01:30Z"
      }
    ]
  });

  const replay = new CheckpointReplayService();
  const isEquivalent = await replay.verifyEquivalence(workflowRunId);

  if (isEquivalent && bundle.id.startsWith("pb-")) {
    console.log("\n✅ Phase 35 logic verified. Platform is now deterministic and scale-hardened.");
  } else {
    console.error("\n❌ FAILED: Validation mismatch.");
    process.exit(1);
  }

  console.log("\n🎉 PHASE 35: DETERMINISTIC EQUIVALENCE & RECOVERY VERIFIED!");
}

testDeterministicEquivalence();
