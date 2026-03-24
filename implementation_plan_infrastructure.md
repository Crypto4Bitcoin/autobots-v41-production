# Phase 36: Production Infrastructure, Load & Failover Validation

This phase proves the survivability of AutoBots under extreme production stress. We move from deterministic correctness to hardened infrastructure reality.

## User Review Required

> [!IMPORTANT]
> **Load Harness Risks**: The `LoadSimulationService` will generate massive volumes of synthetic events. In local environments, this may saturate mock storage or CPU.
> **Failover Testing**: Chaos validation will intentionally terminate workers mid-execution. Ensure all side-effectful nodes are idempotent as per Rule 4.

## Proposed Changes

### 1. Infrastructure Runtime (Cluster Awareness)
#### [NEW] [cluster-orchestrator.service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/cluster-orchestrator.service.ts)
- Manages region-aware scheduling and worker pool isolation (CPU/GPU).
#### [NEW] [worker-autoscaler.service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/worker-autoscaler.service.ts)
- Monitors backlog density and signals for pool expansion/contraction.

### 2. Runtime Security & Config
#### [NEW] [secret-vault.service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/secret-vault.service.ts)
- Implements workspace-scoped secret injection and environment validation.
#### [NEW] [runtime-config.service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/runtime-config.service.ts)
- Manages versioned runtime configurations for workers.

### 3. Distributed Observability
#### [NEW] [trace-correlation.service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/trace-correlation.service.ts)
- Unified tracing across Control, Execution, and Intelligence planes.

### 4. Load & Chaos Harness
#### [NEW] [load-simulation.service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/load-simulation.service.ts)
- Simulates 100k+ concurrent runs and 1M+ events/min.
#### [NEW] [chaos-harness.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/tests/chaos-harness.ts)
- Failure injection: worker crashes, queue outages, lease timeouts.

---

## Verification Plan

### Automated Tests
- `test-infrastructure-resilience.ts`:
    - Scenario: Simulated region failover and projection recovery.
    - Scenario: Concurrent worker pool autoscaling under spike load.
    - Scenario: End-to-end trace correlation check.
- `test-extreme-load-backpressure.ts`:
    - Scenario: 1M event storm with backpressure throttling and Eco-mode activation.
- `run-regression-suite.ts`: **Confirm 32/32 PASSED record.**
