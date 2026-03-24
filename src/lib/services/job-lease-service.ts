import { DBService } from "./supabase-service";
import { GuardrailEnforcementService } from "./guardrail-enforcement-service";

export class JobLeaseService {
  /**
   * Claims a lease for a node run.
   * Requires an idempotency key to prevent duplicate side effects (Rule 4).
   */
  async claimLease(nodeRunId: string, workerId: string, idempotencyKey: string, leaseDurationMs: number) {
    console.log(`[JobLease] Worker ${workerId} attempting to claim ${nodeRunId}...`);

    // Rule 4 Enforcement
    GuardrailEnforcementService.validateOperation({
        type: "artifact_creation", // Assuming node runs produce artifacts/side-effects
        idempotencyKey
    });
    
    // 1. Attempt Atomic Claim
    const success = await DBService.claimNodeRunLock({
      node_run_id: nodeRunId,
      worker_id: workerId,
      expires_at: new Date(Date.now() + leaseDurationMs).toISOString()
    });

    if (!success) {
      throw new Error(`Failed to claim job: ${nodeRunId} - Lock already held.`);
    }

    console.log(`[JobLease] Successfully claimed job: ${nodeRunId}`);
    return { status: "claimed", expiresAt: new Date(Date.now() + leaseDurationMs).toISOString() };
  }

  /**
   * Renews an existing lease heartbeat.
   */
  async renewHeartbeat(nodeRunId: string, workerId: string, extensionMs: number) {
    console.log(`[JobLease] Renewing heartbeat for ${nodeRunId} by worker ${workerId}`);
    
    return DBService.renewNodeRunLock(nodeRunId, {
      worker_id: workerId,
      expires_at: new Date(Date.now() + extensionMs).toISOString()
    });
  }

  /**
   * Releases a lease upon job completion or failure.
   */
  async releaseLease(nodeRunId: string) {
    console.log(`[JobLease] Releasing lease for job: ${nodeRunId}`);
    return DBService.releaseNodeRunLock(nodeRunId);
  }
}
