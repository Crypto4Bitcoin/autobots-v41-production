# Phase 17: Multi-Agent Workforce Layer

AutoBots now evolves from a workflow engine into a **governed digital workforce**. This layer allows the platform to assign work to specialized agent identities based on roles, enabling delegation, consensus, and reputation-based optimization.

## User Review Required

> [!IMPORTANT]
> **Identity-Based Execution**: Execution shifts from anonymous node runs to assigned agent profiles.
> **Reputation-Aware Routing**: Future phases can use the reputation metrics (Phase 17) to prioritize higher-performing agents for critical tasks.

## Proposed Changes

### 1. Workforce Coordination
#### [NEW] [agent-coordinator-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/agent-coordinator-service.ts)
- Handles role-based agent selection and assignment.
#### [NEW] [delegation-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/delegation-service.ts)
- Manages subtask creation and completion for inter-agent delegation.
#### [NEW] [consensus-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/consensus-service.ts)
- Resolves outputs from multiple agents and flags need for human escalation.

### 2. Reputation & Supervision
#### [NEW] [agent-reputation-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/agent-reputation-service.ts)
- Tracks success rates, latency, and review scores for agent identities.
#### [NEW] [supervisor-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/supervisor-service.ts)
- Escalates to humans when consensus fails or roles are unavailable.

### 3. Persistence Layer
#### [MODIFY] [supabase-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/supabase-service.ts)
- Add workforce methods: `listActiveAgentsByRole`, `createAgentAssignment`, `createSubtask`, `updateSubtask`, `getAgentReputation`, `upsertAgentReputation`.

---

## Verification Plan

### Automated Tests
- `test-agent-workforce.ts`:
    - Scenario: Assign researcher. -> Success.
    - Scenario: Create/Complete subtask. -> Success.
    - Scenario: Resolve consensus with high disagreement. -> Flags escalation.
    - Scenario: Update agent reputation. -> Metrics correctly recalculated.
- `run-regression-suite.ts`: **Mandatory**. Must pass full suite (v1.0 - v17.0).
