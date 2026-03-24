# Phase 24: Event-Driven Scaling & Projections

This phase transitions AutoBots into a high-scale, append-only architecture capable of handling millions of workflows. By treating the event log as the source of truth, we ensure resilience, recoverability, and performant operational views.

## User Review Required

> [!IMPORTANT]
> **Source of Truth Shift**: Operational state (status, lineage, reputation) is now a **view** derived from the append-only event log.
> **Idempotency Requirement**: All side-effect-producing operations must now accept and respect idempotency keys to survive retries at scale.

## Proposed Changes

### 1. State Projection & Reconstruction
#### [NEW] [projection.service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/projection.service.ts)
- Rebuilds workflow state by replaying events from the authoritative log.
#### [MODIFY] [supabase-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/supabase-service.ts)
- Add `getWorkflowEvents(workflowId: string)` for replaying history.

### 2. High-Scale Hardening
#### [MODIFY] [capability-registry.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/capability-registry.ts) (or equivalent executor)
- Ensure all execution calls include an idempotency key (e.g., `nodeRunId`).
#### [NEW] [backpressure-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/backpressure-service.ts)
- Monitors queue depth and switches strategies (e.g., to "eco" mode) when thresholds are crossed.

### 3. Data Strategy
#### [MIGRATION] [202408_phase24_partitioning.sql](file:///c:/Users/owner/.gemini/antigravity/scratch/migrations/202408_phase24_partitioning.sql)
- Conceptual migration for partitioning `pipeline_events` by `created_at`.

---

## Verification Plan

### Automated Tests
- `test-event-reconstruction.ts`:
    - Scenario: Emit events -> Crash worker -> `ProjectionService` rebuilds state -> Success.
    - Scenario: Retry idempotent call -> External mock detects duplicate key -> Ignored.
- `test-backpressure.ts`: Simulate high queue depth -> Verify platform slows down via governance.
- `run-regression-suite.ts`: Must pass at 100%.
