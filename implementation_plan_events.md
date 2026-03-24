# Phase 6: Evented Workflow Backbone Implementation Plan

This phase shifts the AutoBots mental model from "Queue-Centric" to "Event-Centric". By making events first-class citizens, we ensure the pipeline's truth is derived from a verifiable history, making the delivery layer (queue) disposable and workers replaceable.

## User Review Required

> [!IMPORTANT]
> **Audit vs Events**: I will maintain `audit_logs` for human-readable system history and `pipeline_events` for programmatic workflow truth. Over time, these may converge, but for this phase, `pipeline_events` will be the structured driver for state.

## Proposed Changes

### Database Layer
#### [NEW] [20240318_pipeline_events.sql](file:///c:/Users/owner/.gemini/antigravity/scratch/supabase/migrations/20240318_pipeline_events.sql)
- Create `pipeline_events` table:
    - `id` (uuid)
    - `pipeline_item_id` (uuid)
    - `workspace_id` (uuid)
    - `event_type` (string: e.g., `job_claimed`, `agent_completed`, `artifact_created`, `optimization_pivoted`)
    - `from_state` (enum PipelineState)
    - `to_state` (enum PipelineState)
    - `artifact_id` (uuid, optional)
    - `agent_run_id` (uuid, optional)
    - `payload` (jsonb)
    - `created_at` (timestamp)

### Core Services
#### [MODIFY] [supabase-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/supabase-service.ts)
- Add `recordPipelineEvent` method.
- Update `updatePipelineState` to optionally record a `state_transitioned` event.

### Orchestrator Integration
#### [MODIFY] [orchestrator.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/orchestrator/orchestrator.ts)
- Emit `job_claimed` immediately after RPC success.
- Emit `agent_started` and `agent_completed` events.
- Emit `artifact_created` when an artifact is emitted.
- Emit `policy_decision_applied` when the Policy Engine generates a context with flags/reason codes.
- Emit `optimization_pivoted` when the `OptimizationService` triggers a strategy shift.

---

## Verification Plan

### Automated Tests
- Create `test-evented-backbone.ts`:
    - Run a full job cycle.
    - Query the `pipeline_events` table and verify the sequential narrative (Claim -> Policy -> Start -> Artifact -> Complete).
    - Verify that even if a worker "dies" (simulated), the event log remains consistent.

### Manual Verification
- Inspect the Supabase table `pipeline_events` during a run to see the event stream in real-time.
