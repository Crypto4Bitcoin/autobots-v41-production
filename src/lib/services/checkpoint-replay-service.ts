// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IncrementalSnapshot, IncrementalSnapshotService } from "./snapshot-service";
import { DBService } from "./supabase-service";
import { ProjectionService } from "./projection.service";

export class CheckpointReplayService {
  private snapshots = new IncrementalSnapshotService();
  private projection = new ProjectionService();

  /**
   * Reconstructs state using the Hybrid Replay pattern: Range-aware Snapshot + Delta Events.
   */
  async reconstructState(workflowRunId: string, type: "workflow" | "projection" | "task_graph" = "workflow") {
    console.log(`[CheckpointReplay] Reconstructing ${type} state for ${workflowRunId}...`);
    
    // 1. Load latest range-aware snapshot
    const snapshot = await this.snapshots.getLatestSnapshot(workflowRunId, type);
    
    if (!snapshot) {
      console.log("[CheckpointReplay] No snapshot found. Falling back to full event replay.");
      return this.projection.rebuildWorkflowState(workflowRunId);
    }

    // Rule: Snapshot covers a specific range. We only need events AFTER that range.
    const lastEventId = snapshot.source_stream_range.end_id;
    console.log(`[CheckpointReplay] Resuming from ${type} snapshot at event ${lastEventId}`);

    // 2. Fetch delta events (those after the snapshot's end range)
    const deltaEvents = await DBService.getWorkflowEvents(workflowRunId, lastEventId);
    
    // 3. Apply delta to snapshot state
    let state = snapshot.state_data;
    for (const event of deltaEvents) {
      state = this.projection.applyEvent(state, event);
    }

    console.log(`[CheckpointReplay] Reconstruction complete. Applied ${deltaEvents.length} delta events.`);
    return state;
  }

  /**
   * Rule: Deterministic Equivalence Test.
   * Verifies that hybrid replay matches full ledger reconstruction.
   */
  async verifyEquivalence(workflowRunId: string) {
    console.log(`[CheckpointReplay] Verifying deterministic equivalence for ${workflowRunId}...`);
    
    const [fullLedgerState, hybridState] = await Promise.all([
        this.projection.rebuildWorkflowState(workflowRunId),
        this.reconstructState(workflowRunId)
    ]);

    // Simplified deep equality check
    const isEqual = JSON.stringify(fullLedgerState) === JSON.stringify(hybridState);
    
    if (isEqual) {
        console.log("✅ Deterministic Equivalence PASSED: Hybrid state matches full ledger.");
    } else {
        console.error("❌ Deterministic Equivalence FAILED: Hybrid state has drifted from truth.");
        console.log("Full Ledger State:", JSON.stringify(fullLedgerState, null, 2));
        console.log("Hybrid State:", JSON.stringify(hybridState, null, 2));
    }

    return isEqual;
  }
}
