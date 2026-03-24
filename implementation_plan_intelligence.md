# Phase 15.1: Platform Intelligence Layer

AutoBots now adds a layer of **observational intelligence** that derives insights from the event backbone (`pipeline_events`) to inform future optimizations and supervision.

## User Review Required

> [!NOTE]
> **Observer Pattern**: This layer does not modify the runtime; it only reads events and persists insights.
> **Source of Truth**: The event backbone remains the single source of truth for platform behavior.

## Proposed Changes

### 1. Intelligence Observation
#### [NEW] [platform-intelligence-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/platform-intelligence-service.ts)
- Consumes `pipeline_events` (specifically `agent_completed` and failure events).
- Calculates capability stats: runs, failure rates, average latency.

### 2. Persistence Layer
#### [NEW] `platform_insights` table
- Stores generated insights for consumption by other services (Recommendation, Supervision).
- Fields: `id`, `insight_type`, `target` (e.g., capability slug), `value` (JSONB), `created_at`.

### 3. Verification
#### [NEW] [test-platform-intelligence.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/tests/test-platform-intelligence.ts)
- Seeds mock events and verifies stats generation.
- Checks persistence of insights.

---

## Verification Plan

### Automated Tests
- `test-platform-intelligence.ts`:
    - Seed mock events (latency 100ms, 200ms). -> Verify average is 150ms.
    - Seed failure event. -> Verify failure rate is calculated correctly.
- `run-regression-suite.ts`: **Mandatory**. Must pass full suite (v1.0 - v14.0).
