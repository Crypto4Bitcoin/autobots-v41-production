# AutoBots Orchestration Hardening Implementation Plan

This hardening pass addresses the remaining orchestration risks in AutoBots, focusing on queue atomicity, retry correctness, lock lifecycle, telemetry accuracy, and workspace-safe reads.

## User Review Required

> [!IMPORTANT]
> **Atomic Queue Claiming**: Moved fully into PostgreSQL via `claim_next_job(worker_id)`. **Selection and claim** occur in one DB-owned operation.
> **Retry Counting**: Centralized in the failure path only. Attempts increment **exactly once** per failed execution.

## Proposed Changes

### Database Layer (Supabase)

#### [NEW] [claim_next_job.sql](file:///c:/Users/owner/.gemini/antigravity/scratch/supabase/migrations/claim_next_job.sql)
- Postgres function taking `worker_id`.
- Uses CTE with `FOR UPDATE SKIP LOCKED`.
- Returns: `id`, `pipeline_item_id`, `workspace_id`, `target_state`, `payload`, `attempts`, `max_attempts`.
- Does not increment attempts.
- Orders claims by `priority DESC, created_at ASC`.

#### [MODIFY] [supabase-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/supabase-service.ts)
- **`fetchPendingJob`**: Use `rpc('claim_next_job')`.
- **`updateJobStatus`**: Hard rule: `processing` sets lock metadata; `pending`, `completed`, `failed`, `dead_letter` **must** clear it.
- **`failJobWithRetry`**: Increment attempts exactly once; clear lock metadata.
- **`getMemoryRecords`**: Enforce `workspaceId` scoping.
- **`logAgentRun`**: Store `started_at` and `completed_at` as source-of-truth; derive `latency_ms`.
- **Audit Vocabulary**: Standardize on `queue_claimed`, `queue_claim_conflict`, `queue_retried`, `queue_dead_lettered`, `queue_completed`, `lock_acquired`, `lock_released`, `lock_stale_cleared`, `agent_started`, `agent_completed`, `agent_failed`.

---

### Orchestrator & Services

#### [MODIFY] [agent-types.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/types/agent-types.ts)
- Update `AgentInput` (include `inputState` and `targetState`).
- Define `JobResult` explicitly.

#### [MODIFY] [orchestrator.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/orchestrator/orchestrator.ts)
- Capture real timestamps; calculate latency.

---

### Testing

#### [NEW] [verify-hardening.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/tests/verify-hardening.ts)
- Adversarial scenarios:
    - **Concurrent Claim**: Race condition check.
    - **Retry Threshold**: Count consistency check.
    - **Lock Cleanup**: Terminal state verification.
    - **Stale Lock Recovery**: Expired lock reclaiming.
    - **Queue Ownership**: Claimed job stays owned until terminal/retry.
    - **Empty Queue**: Null return without mutation check.

---

## Verification Plan

### Automated Tests
- `npm run test:hardening` (calls `verify-hardening.ts`).
- TypeScript compile check.

### Manual Verification
- Inspect DB rows for lock metadata correctness.
- Verify audit event consistency.
- Verify dead-letter rows stop exactly at `max_attempts`.
