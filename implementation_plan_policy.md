# Adaptive Policy Engine Implementation Plan

The **Adaptive Policy Engine** will act as an execution governor for the AutoBots orchestrator. It evaluates workspace policy, job metadata, platform target, and system conditions to decide *how* a pipeline stage should run.

## User Review Required

> [!IMPORTANT]
> **Policy Storage**: I will use strict schema validation (Zod) for policy config stored in workspace metadata. This ensures a clean path to a dedicated `workspace_policies` table later.
> **Reasoning**: Decisions will include `reasonCodes` for explainable observability in logs.

## Proposed Changes

### Core Services
#### [NEW] [policy-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/policy-service.ts)
- Define `WorkspacePolicySchema` with Zod.
- `getExecutionContext(params)`: Evaluates:
    - `workspacePolicy`: The validated config from metadata.
    - `item`: Metadata-driven flags (e.g., `cost_mode: 'eco'`).
    - `systemConditions`: Such as `queue_depth`.
- Returns `AgentExecutionContext` with:
    - `providerStrategy`, `requiresHumanReview`, `skipOptionalStages`, `reasonCodes`, etc.

### Orchestrator Integration
#### [MODIFY] [orchestrator.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/orchestrator/orchestrator.ts)
- Evaluate policy before `agent.process`.
- Enforce mandatory review (reroute to `NEEDS_REVIEW` if flag set).
- Enforce stage skipping at the orchestrator level.
- Log `AgentExecutionContext` in `agent_runs.metadata`.

### Types
#### [MODIFY] [agent-types.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/types/agent-types.ts)
- Define `WorkspacePolicyConfig` and `AgentExecutionContext`.
- Update `Agent.process` or `AgentInput` to include context.

---

## Verification Plan

### Automated Tests
- [NEW] `test-policy-logic.ts`:
    - Verify `eco` routing.
    - Verify forced review for sensitive platforms/keywords.
    - Verify skip-stages logic based on queue depth.

### Manual Verification
- Inspect `agent_runs` table to confirm `reasonCodes` reflect the decision logic.
