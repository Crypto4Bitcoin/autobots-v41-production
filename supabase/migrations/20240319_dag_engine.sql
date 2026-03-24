-- Phase 7: DAG Workflow Engine Migration
-- This migration introduces the core infrastructure for generic, dependency-driven AI workflows.

-- 1. Workflow Definitions (Templates)
CREATE TABLE IF NOT EXISTS public.workflow_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id), -- Null for global/system templates
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    version INTEGER DEFAULT 1,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Workflow Nodes (The "Tasks")
CREATE TABLE IF NOT EXISTS public.workflow_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_definition_id UUID NOT NULL REFERENCES public.workflow_definitions(id) ON DELETE CASCADE,
    node_key VARCHAR(100) NOT NULL, -- Logical key e.g., 'research_node'
    node_type VARCHAR(50) NOT NULL, -- 'agent', 'condition', 'human_gate', 'system'
    agent_name VARCHAR(255), -- Name of the agent in registry
    is_optional BOOLEAN DEFAULT FALSE,
    retry_policy JSONB NOT NULL DEFAULT '{"max_attempts": 3}'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    UNIQUE(workflow_definition_id, node_key)
);

-- 3. Workflow Edges (Dependencies)
CREATE TABLE IF NOT EXISTS public.workflow_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_definition_id UUID NOT NULL REFERENCES public.workflow_definitions(id) ON DELETE CASCADE,
    from_node_id UUID NOT NULL REFERENCES public.workflow_nodes(id) ON DELETE CASCADE,
    to_node_id UUID NOT NULL REFERENCES public.workflow_nodes(id) ON DELETE CASCADE,
    condition_config JSONB, -- Optional rules for conditional traversal
    UNIQUE(workflow_definition_id, from_node_id, to_node_id)
);

-- 4. Workflow Runs (Execution Instances)
CREATE TABLE IF NOT EXISTS public.workflow_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_definition_id UUID NOT NULL REFERENCES public.workflow_definitions(id),
    pipeline_item_id UUID NOT NULL REFERENCES public.pipeline_items(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed', 'dead_letter'
    current_projection JSONB NOT NULL DEFAULT '{}'::jsonb, -- Summary of progress
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Node Runs (Execution Instances of Tasks)
CREATE TABLE IF NOT EXISTS public.node_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_run_id UUID NOT NULL REFERENCES public.workflow_runs(id) ON DELETE CASCADE,
    workflow_node_id UUID NOT NULL REFERENCES public.workflow_nodes(id),
    pipeline_item_id UUID NOT NULL,
    workspace_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'runnable', 'processing', 'completed', 'failed', 'skipped'
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    worker_id VARCHAR(255),
    input_artifact_id UUID REFERENCES public.artifacts(id), -- For now, single input artifact
    output_artifact_id UUID REFERENCES public.artifacts(id),
    execution_context JSONB NOT NULL DEFAULT '{}'::jsonb, -- Policy decisions per node
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Workflow Events (Extended structured events)
ALTER TABLE public.pipeline_events ADD COLUMN IF NOT EXISTS workflow_run_id UUID REFERENCES public.workflow_runs(id);
ALTER TABLE public.pipeline_events ADD COLUMN IF NOT EXISTS node_run_id UUID REFERENCES public.node_runs(id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workflow_nodes_def ON public.workflow_nodes(workflow_definition_id);
CREATE INDEX IF NOT EXISTS idx_workflow_edges_def ON public.workflow_edges(workflow_definition_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_item ON public.workflow_runs(pipeline_item_id);
CREATE INDEX IF NOT EXISTS idx_node_runs_workflow ON public.node_runs(workflow_run_id);
CREATE INDEX IF NOT EXISTS idx_node_runs_status ON public.node_runs(status);

COMMENT ON TABLE public.workflow_definitions IS 'Templates for generic DAG-based AI workflows.';
COMMENT ON TABLE public.node_runs IS 'Tracks individual task executions within a DAG workflow run.';
