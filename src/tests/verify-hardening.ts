import { DBService } from "../lib/services/supabase-service";
import { PipelineState } from "../lib/types/enums";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { QueueService, Orchestrator } from "../lib/orchestrator/orchestrator";

async function runTests() {
  console.log("🚀 Starting AutoBots Orchestration Hardening Tests...\n");

  const workspaceId = "00000000-0000-0000-0000-000000000001";
  const pipelineItemId = "00000000-0000-0000-0000-000000000002";

  try {
    // --- Test 1: Empty Queue ---
    console.log("Test 1: Empty Queue Claim...");
    const emptyJob = await DBService.fetchPendingJob("worker-empty");
    if (emptyJob === null) {
      console.log("✅ Passed: Returns null on empty queue.\n");
    } else {
      throw new Error("Failed: Expected null on empty queue");
    }

    // --- Setup: Seed a job ---
    console.log("Seeding test job...");
    await DBService.enqueueJob({
      pipeline_item_id: pipelineItemId,
      workspace_id: workspaceId,
      target_state: PipelineState.CLASSIFYING_INPUT,
      payload: { test: true }
    });

    // --- Test 2: Queue Ownership & Concurrent Claim ---
    console.log("Test 2: Concurrent Claim (Adversarial)...");
    const [claimA, claimB] = await Promise.all([
      DBService.fetchPendingJob("worker-A"),
      DBService.fetchPendingJob("worker-B")
    ]);

    if (claimA && !claimB) {
      console.log("✅ Passed: Only one worker claimed the job.");
      console.log(`   Worker A owned ID: ${claimA.id}\n`);
    } else if (!claimA && claimB) {
      console.log("✅ Passed: Only one worker claimed the job.");
      console.log(`   Worker B owned ID: ${claimB.id}\n`);
    } else {
      throw new Error(`Failed: Double claim or zero claim! A: ${!!claimA}, B: ${!!claimB}`);
    }

    const activeJob = claimA || claimB;

    // --- Test 3: Lock Cleanup on Terminal Update ---
    console.log("Test 3: Lock Cleanup on Completion...");
    await DBService.updateJobStatus(activeJob.id, "completed", undefined, "worker-A");
    
    // Check DB row
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: jobAfterCompletion } = await (DBService as any).supabase
      .from("job_queue")
      .select("locked_at, locked_by")
      .eq("id", activeJob.id)
      .single();

    if (jobAfterCompletion.locked_at === null && jobAfterCompletion.locked_by === null) {
      console.log("✅ Passed: Lock metadata cleared on completion.\n");
    } else {
      throw new Error("Failed: Lock metadata persisted after completion");
    }

    // --- Test 4: Retry Threshold (Off-by-one check) ---
    console.log("Test 4: Retry Threshold (0 -> 1 -> 2 -> Dead Letter)...");
    
    // Seed another one
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: retryJob } = await (DBService as any).supabase
      .from("job_queue")
      .insert({
        pipeline_item_id: pipelineItemId,
        workspace_id: workspaceId,
        target_state: PipelineState.RESEARCHING,
        max_attempts: 2
      })
      .select()
      .single();

    console.log(`   Initial attempts: ${retryJob.attempts}`);
    
    await DBService.failJobWithRetry(retryJob.id, "Fail 1", "worker-retry");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: j1 } = await (DBService as any).supabase.from("job_queue").select("status, attempts").eq("id", retryJob.id).single();
    console.log(`   After Fail 1: status=${j1.status}, attempts=${j1.attempts}`);
    if (j1.status !== "pending" || j1.attempts !== 1) throw new Error("Retry 1 failed");

    await DBService.failJobWithRetry(retryJob.id, "Fail 2", "worker-retry");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: j2 } = await (DBService as any).supabase.from("job_queue").select("status, attempts").eq("id", retryJob.id).single();
    console.log(`   After Fail 2: status=${j2.status}, attempts=${j2.attempts}`);
    if (j2.status !== "dead_letter" || j2.attempts !== 2) throw new Error("Dead letter threshold failed");

    console.log("✅ Passed: Retry count and dead-letter threshold exact.\n");

    // --- Test 5: Stale Lock Recovery ---
    console.log("Test 5: Stale Lock Recovery...");
    const stallItemId = "00000000-0000-0000-0000-000000000003";
    
    // Create an expired lock
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (DBService as any).supabase.from("pipeline_locks").insert({
        pipeline_item_id: stallItemId,
        workspace_id: workspaceId,
        worker_id: "dead-worker",
        expires_at: new Date(Date.now() - 10000).toISOString()
    });

    const canClaim = await DBService.acquireLock(stallItemId, workspaceId, "live-worker");
    if (canClaim) {
      console.log("✅ Passed: Stale lock successfully reclaimed.\n");
    } else {
      throw new Error("Failed: Could not reclaim stale lock");
    }

    console.log("🎉 ALL HARDENING TESTS PASSED!");

  } catch (err) {
    console.error("\n❌ TESTS FAILED:");
    console.error(err);
    process.exit(1);
  }
}

runTests();
