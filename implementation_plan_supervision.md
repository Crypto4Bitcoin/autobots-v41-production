# Phase 15: Platform Health Supervision

AutoBots now layers **supervisory intelligence** on top of its observational data. The supervisor detects anomalies (latency, failures, bottlenecks) and generates governed alerts to ensure platform stability.

## User Review Required

> [!IMPORTANT]
> **Non-Destructive**: Supervision alerts do not mutate the runtime. They provide structured data for the governance layer to recommend actions (e.g., provider swaps or human review).

## Proposed Changes

### 1. Supervision Layer
#### [NEW] [workflow-health-supervisor.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/workflow-health-supervisor.ts)
- Analyzes capability performance via `PlatformIntelligenceService`.
- Detects latency warnings (>10s) and failure rate alerts (>20%).
- Persists findings to `supervision_alerts`.

### 2. DB Updates
#### [MODIFY] [supabase-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/supabase-service.ts)
- Add `persistSupervisionAlerts` method.

### 3. Verification
#### [NEW] [test-workflow-supervisor.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/tests/test-workflow-supervisor.ts) (Updating stub)
- Mocks high-latency and high-failure scenarios.
- Verifies that the supervisor generates the correct alerts.

---

## Verification Plan

### Automated Tests
- `test-workflow-supervisor.ts`:
    - Scenario: Capability with 15s latency. -> Verify `latency_warning`.
    - Scenario: Capability with 30% failure. -> Verify `failure_rate_warning`.
- `run-regression-suite.ts`: **Mandatory**. Must pass full suite (v1.0 - v15.0).
