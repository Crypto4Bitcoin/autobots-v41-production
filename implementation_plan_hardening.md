# Phase 26: Production Hardening & Safety Gates

This phase introduces critical safety and lifecycle controls to ensure the AutoBots architecture survives the transition to heavy production load. We focus on preventing resource exhaustion, observability noise, and human bottlenecks.

## User Review Required

> [!IMPORTANT]
> **Data Lifecycle**: Old artifacts are automatically moved to cold storage (simulated) to prevent database and storage bloat.
> **Human Escalation**: Human tasks now have mandatory inactivity timeouts that trigger automated supervisor alerts or re-assignment.

## Proposed Changes

### 1. Data & Resource Hardening
#### [NEW] [artifact-lifecycle-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/artifact-lifecycle-service.ts)
- Manages storage tiering (Hot vs Cold) based on age and access patterns.
#### [MODIFY] [worker-registry-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/worker-registry-service.ts)
- Add software version tracking to detect worker drift.

### 2. Observability & Coordination
#### [NEW] [metric-aggregation-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/metric-aggregation-service.ts)
- Aggregates raw events into high-level health summaries (Workspace/Pack/Capability level).
#### [NEW] [human-escalation-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/human-escalation-service.ts)
- Monitors pending human tasks and triggers escalations for stalled workflows.

### 3. Stability Hooks
#### [MODIFY] [control-plane-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/control-plane-service.ts)
- Define throttling limits for event replay workloads to prevent live runtime interference.

---

## Verification Plan

### Automated Tests
- `test-production-hardening.ts`:
    - Scenario: Archive old artifacts. -> Metadata remains, storage tier updated.
    - Scenario: Aggregate metrics. -> Noise filtered, summary reflects health.
    - Scenario: Stalled human task. -> Trigger escalation alert.
- `run-regression-suite.ts`: **Platform validation at v26.0**.
