# Phase 8: Platform Enablement Layer

This phase transforms the AutoBots DAG engine into a general-purpose, visually composable **AI Workflow Platform**. 

## User Review Required

> [!IMPORTANT]
> **Human-in-the-Loop Integration**: Implementing human task nodes requires a stateful "paused" mechanism in the Orchestrator. The orchestrator will emit a `human_task_created` event and suspend execution of that branch until the task is marked as `resolved`.

## Proposed Changes

### 1. Agent Capability Registry (Foundation)
#### [NEW] [20240320_capability_registry.sql](file:///c:/Users/owner/.gemini/antigravity/scratch/supabase/migrations/20240320_capability_registry.sql)
- `agent_capabilities`: Stores schemas, cost profiles, and security flags for tools/agents.
#### [NEW] [capability-registry-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/capability-registry-service.ts)
- Service to resolve "Capabilities" into executable agent code or API calls.

### 2. Human Task Nodes
#### [NEW] [20240321_human_tasks.sql](file:///c:/Users/owner/.gemini/antigravity/scratch/supabase/migrations/20240321_human_tasks.sql)
- `human_tasks`: Table to track approval requests and manual edits.
#### [MODIFY] [orchestrator.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/orchestrator/orchestrator.ts)
- Support nodes of type `human_gate`. Automically creates a `human_task` and waits.

### 3. External Tool Integration
#### [NEW] [tool-adapter-service.ts](file:///c:/Users/owner/.gemini/antigravity/scratch/src/lib/services/tool-adapter-service.ts)
- Standardized execution for HTTP actions, webhooks, and third-party API nodes (e.g., Slack, Notion).

### 4. Visual Workflow Builder (UI Layer)
#### [NEW] [Workflow Builder Components]
- Next.js pages and React components for a node-based graph editor.

---

## Verification Plan

### Automated Tests
- `test-capability-registry.ts`: Verify that nodes can resolve capabilities and skip execution if unauthorized.
- `test-human-workflow.ts`: Mock a workflow that pauses at a human node and resumes only after approval.

### Manual Verification
- Deploy the visual builder and create a simple "Research -> Approve -> Slack" workflow.
