# Phase 4: Versioned Artifact Lineage Implementation Plan

This phase introduces **Artifacts** as first-class entities. Instead of just passing a "payload" from state to state, we will track every major output as a versioned artifact with a clear lineage (who its parent was).

## User Review Required

> [!IMPORTANT]
> **Lineage Chain**: Every agent run will now "emit" one or more artifacts. The orchestrator will ensure that the `id` of the primary output artifact from the *previous* stage is passed to the *next* agent as the `parent_artifact_id`.

## Proposed Changes

### Database Layer
#### [NEW] [20240316_artifact_lineage.sql](file:///c:/Users/owner/.gemini/antigravity/scratch/supabase/migrations/20240316_artifact_lineage.sql)
- Create `artifacts` table:
    - `id` (uuid)
    - `workspace_id` (uuid)
    - `pipeline_item_id` (uuid)
    - `agent_run_id` (uuid)
    - `parent_artifact_id` (uuid, nullable)
    - `type` (string, e.g., 'research_summary', 'composition_draft')
    - `data` (jsonb)
    - `created_at` (timestamp)

### Core Services
#### [MODIFY] [supabase-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/supabase-service.ts)
- Add `createArtifact(artifact)` method.
- Add `getArtifactLineage(pipelineItemId)` for debugging/visualizers.

### Orchestrator Integration
#### [MODIFY] [orchestrator.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/orchestrator/orchestrator.ts)
- Track the "Last Artifact ID" for each `pipelineItemId` during the workflow.
- Pass the `parent_artifact_id` into the `AgentInput`.

### Agent Implementation
#### [MODIFY] [base-agent.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/agents/base-agent.ts)
- Add `emitArtifact(type, data, parentId)` method.
- Standardize agent `success` returns to include an artifact reference.

---

## Verification Plan

### Automated Tests
- Create `test-artifact-lineage.ts`:
    - Chain two agents (e.g., Trend -> Angle).
    - Verify that the second agent's artifact has the first agent's artifact as `parent_artifact_id`.
    - Verify data persistence in the `artifacts` table.

### Manual Verification
- Query the `artifacts` table for a specific `pipeline_item_id` and confirm the parent-child chain is complete.
