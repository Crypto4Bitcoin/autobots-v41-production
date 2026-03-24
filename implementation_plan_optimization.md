# Phase 5: Outcome-Driven Optimization Implementation Plan

This final phase enables the system to close the loop. By tracking the "outcomes" (quality scores, engagement, or success rates) of artifacts, the **Policy Engine** can dynamically optimize future runs.

## User Review Required

> [!IMPORTANT]
> **Feedback Source**: For the pilot, I will implement a programmatic "Self-Scoring" mechanism where some agents (like `QualityScoringAgent`) provide scores that the optimization loop consumes. I'll also support manual user feedback via a new `artifact_feedback` table.

## Proposed Changes

### Database Layer
#### [NEW] [20240317_optimization_feedback.sql](file:///c:/Users/owner/.gemini/antigravity/scratch/supabase/migrations/20240317_optimization_feedback.sql)
- Create `artifact_feedback` table:
    - `artifact_id` (uuid)
    - `score` (int, 1-100)
    - `metrics` (jsonb, e.g., readability, alignment)
    - `provided_by` (string: 'agent' or 'user')

### Core Services
#### [NEW] [optimization-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/optimization-service.ts)
- `aggregatePerformance(workspaceId)`: Scans recent artifacts and feedback to generate tuning weights.
- Store results in `memory_records` under the `tuning_metrics` category.

#### [MODIFY] [policy-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/policy-service.ts)
- `getExecutionContext` now optionally considers `tuning_metrics` from memory.
- If a provider (e.g., Ollama) has a consistently low score for a task class, demote it even if `cost_mode` is `eco`.

### Orchestrator Integration
#### [MODIFY] [orchestrator.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/orchestrator/orchestrator.ts)
- After agent completion, check for scoring data in the output.
- Log feedback automatically for "Scoring" agents.

---

## Verification Plan

### Automated Tests
- Create `test-optimization-loop.ts`:
    - Simulate a series of "low score" runs for a specific provider.
    - Verify that the `PolicyService` eventually shifts the `providerStrategy` or provider ordering to a higher-quality alternative.

### Manual Verification
- View the `memory_records` table and confirm that `tuning_metrics` are being updated after runs with scores.
