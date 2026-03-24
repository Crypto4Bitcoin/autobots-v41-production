# Phase 25: Distributed Worker Clustering & Registry

AutoBots now transitions to a **production-grade clustered architecture**. This phase formalizes the separation between the Control Plane (administration), Execution Plane (specialized workers), and Intelligence Plane (observers), enabling horizontal scale across millions of workflows.

## User Review Required

> [!IMPORTANT]
> **Plane Separation**: Workers no longer make global decisions; they execute tasks and emit events. Decision-making is centralized in the Control/Intelligence planes.
> **Specialized Pools**: Execution is partitioned into pools (General, Browser, Media, Tool) to prevent resource starvation.

## Proposed Changes

### 1. Worker & Queue Coordination
#### [NEW] [worker-registry-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/worker-registry-service.ts)
- Tracks worker health, type (class), and current load.
#### [NEW] [queue-router-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/queue-router-service.ts)
- Routes node jobs to specialized queues (e.g., `queue_browser`, `queue_media`) based on capability metadata.

### 2. State & Projection Scaling
#### [NEW] [projection-worker.service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/projection-worker.service.ts)
- Asynchronous worker that consumes events to update optimized state views (projections).
#### [MODIFY] [supabase-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/supabase-service.ts)
- Add `worker_registry` and `queue_metadata` persistence methods.

### 3. Distributed Resilience
#### [MODIFY] [pipeline-state-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/pipeline-state-service.ts)
- Implement lease-based locking with periodic heartbeat renewal for node runs.

---

## Verification Plan

### Automated Tests
- `test-worker-clustering.ts`:
    - Scenario: Register multiple workers (General vs Media). -> Success.
    - Scenario: Enqueue job for 'media.render'. -> Routed to 'media_queue'.
    - Scenario: Simulate heartbeat failure. -> Lease expires and job is reclaimed by another worker.
- `test-async-projections.ts`:
    - Scenario: Emit events. -> Projection worker updates view asynchronously.
- `run-regression-suite.ts`: **Final platform validation**.
