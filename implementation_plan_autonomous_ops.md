# Phases 18-23: Autonomous Operations & Global Control

This final sequence of upgrades evolves AutoBots into a fully autonomous AI operations platform with a unified safety "kill switch" (Control Plane).

## User Review Required

> [!IMPORTANT]
> **Governed Autonomy**: Autonomous planning (Phase 18) and evolution (Phase 22) are governed. Plans and DAG changes are proposed as drafts for human/governance approval before activation.
> **Safety First**: The Control Plane (Phase 23) provides global overrides to pause or throttle the system in case of runaway behavior.

## Proposed Changes

### 1. Autonomous Intelligence Layer
#### [NEW] [workforce-planner.service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/workforce-planner.service.ts)
- Proposes multi-step workforce plans from goals.
#### [NEW] [cost-intelligence.service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/cost-intelligence.service.ts)
- Analyzes event backbone for capability spend and efficiency.
#### [NEW] [knowledge-graph.service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/knowledge-graph.service.ts)
- Connects artifacts across workflows to find successful patterns.

### 2. Control & Recovery Layer
#### [NEW] [runtime-recovery.service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/runtime-recovery.service.ts)
- Recommends safe fixes (retry, fallback, escalate) for detected failures.
#### [NEW] [control-plane.service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/control-plane.service.ts)
- Provides global pause, throttle, and autonomy level controls.

### 3. Verification & Regression
#### [MODIFY] [run-regression-suite.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/tests/run-regression-suite.ts)
- Expand to include all 17+ verification tests.

---

## Verification Plan

### Automated Tests
- `test-workforce-planner.ts`: Verify plan generation.
- `test-runtime-recovery.ts`: Verify failure mitigation logic.
- `test-cost-intelligence.ts`: Verify cost aggregation from events.
- `test-control-plane.ts`: Verify global pauses and autonomy limits.
- `run-regression-suite.ts`: **Final platform validation**.
