# Phase 14: Visual Autonomous Workflow Builder

AutoBots now transitions from draft workflow proposal into **visual workflow refinement**. This allows operators to inspect, edit, and approve autonomously assembled DAGs before they are activated.

## User Review Required

> [!IMPORTANT]
> **Governance-First Editing**: Every visual edit (adding/removing nodes, changing deps) must pass the exact same validation pipeline (cycle detection, trust-tiers, workspace policies) as hand-coded workflows.
> **Draft-Only**: Edits are versioned and stored in `workflow_proposal_versions`. Activation is a separate, explicit operator action.

## Proposed Changes

### 1. Visual Assembly Layer
#### [NEW] [workflow-builder-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/workflow-builder-service.ts)
- Handles visual edit operations: `add_node`, `remove_node`, `update_edge`, `toggle_optional`.
- Enforces structural validation (cycle detection, reachability).
- Enforces policy validation (trust-tiers, capability checks).

#### [MODIFY] [workflow-proposal-viewer.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/workflow-proposal-viewer.ts)
- Updates `render` logic to provide a clean JSON representation for frontend/visual consumption.

### 2. Persistence & Versioning
#### [NEW] `workflow_proposal_versions` table
- Tracks the history of edits for a single proposal.
- Fields: `id`, `proposal_id`, `version`, `draft_dag` (JSONB), `created_at`.

### 3. Activation Layer
#### [NEW] [proposal-activation-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/proposal-activation-service.ts)
- Finalizes a draft proposal.
- Converts the approved `draft_dag` into a production-ready `workflow_definition`.

---

## Verification Plan

### Automated Tests
- `test-visual-builder.ts`:
    - Scenario: Add a node -> Success.
    - Scenario: Create a cycle -> Rejected with Error.
    - Scenario: Invalid capability -> Rejected.
    - Scenario: Activate version 2 -> Workflow definition created.
- `run-regression-suite.ts`: **Mandatory**. Must pass full suite (v1.0 - v14.0).
