# Phase 7: DAG Workflow Engine Migration

AutoBots is evolving from a fixed content-pipeline into a general-purpose **DAG-based AI Orchestration Platform**. This phase introduces a dependency-driven execution model where the orchestrator schedules runnable nodes from a workflow graph.

## User Review Required

> [!IMPORTANT]
> **Hybrid Migration Strategy**: I will preserve the existing `pipeline_items` current state as a projected status layer while introducing new `workflow_runs` and `node_runs` as the underlying execution truth. This ensures zero-downtime compatibility for existing tools/UIs.

## Proposed Changes

### Database Layer (Core DAG Infrastructure)
#### [NEW] [20240319_dag_engine.sql](file:///c:/Users/owner/.gemini/antigravity/scratch/supabase/migrations/20240319_dag_engine.sql)
- **Workflow Definitions**: Reusable DAG templates (`workflow_definitions`, `workflow_nodes`, `workflow_edges`).
- **Workflow Execution**: Live instances of runs (`workflow_runs`, `node_runs`, `node_artifact_links`).
- **Workflow Events**: Rebranded event stream for node-level auditing.

### Services Layer
#### [NEW] [workflow-engine.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/workflow-engine.ts)
- `WorkflowDefinitionService`: Loading and validating DAGs (no-cycle checks).
- `WorkflowRunService`: Tracking run progress and identifying "runnable" nodes.
- `NodeRunService`: Managing the lifecycle of individual task executions.

#### [MODIFY] [projection-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/projection-service.ts)
- Update to project overall workflow health and legacy pipeline state from node outcomes.

### Orchestrator Evolution
#### [MODIFY] [orchestrator.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/orchestrator/orchestrator.ts)
- Refactor to pull "runnable nodes" from the `WorkflowRunService`.
- Enqueue jobs targeting specific `node_run_id` instead of a static `targetState`.
- Pass `AgentExecutionContext` (Provider strategy, review flags) at the node level.

### Agent Contracts
#### [MODIFY] [agent-types.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/types/agent-types.ts)
- Transition `AgentInput` to include `nodeRunId` and `inputArtifacts[]`.
- Update `AgentOutput` to emit multiple artifacts if assigned by the node type.

---

## Verification Plan

### Automated Tests
- `test-dag-scheduler.ts`:
    - Define a branching DAG (1 root -> 2 parallel nodes -> 1 merge node).
    - Verify that the merge node *only* becomes runnable after both parents complete.
    - Verify projection of "Overall Success" when the DAG completes.

### Manual Verification
- Visual inspection of `node_runs` table during a fan-out execution.
