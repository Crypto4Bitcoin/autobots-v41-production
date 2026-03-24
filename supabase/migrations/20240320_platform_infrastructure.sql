-- Phase 8: Platform Enablement Layer
-- Foundation for Capability Registry and Human-in-the-Loop tasks

-- 1. Agent Capabilities Registry
CREATE TABLE IF NOT EXISTS public.agent_capabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capability_key VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'search.web', 'generate.text'
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    runtime_type VARCHAR(50) NOT NULL, -- 'internal_agent', 'tool_adapter', 'api_action', 'human_task'
    input_schema JSONB NOT NULL DEFAULT '{}'::jsonb, -- JSON Schema for input validation
    output_schema JSONB NOT NULL DEFAULT '{}'::jsonb, -- JSON Schema for output validation
    supported_node_types VARCHAR[] DEFAULT '{agent}',
    default_timeout_seconds INTEGER DEFAULT 300,
    cost_profile JSONB NOT NULL DEFAULT '{"type": "fixed", "amount": 0}'::jsonb,
    is_enabled BOOLEAN DEFAULT TRUE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Human Tasks (Pauses and Approvals)
CREATE TABLE IF NOT EXISTS public.human_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_run_id UUID REFERENCES public.workflow_runs(id) ON DELETE CASCADE,
    node_run_id UUID REFERENCES public.node_runs(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    assigned_to UUID, -- Optional user assignment
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'claimed', 'resolved', 'rejected'
    instructions TEXT,
    input_data JSONB, -- The artifact/data needing review
    resolution_payload JSONB, -- The human's decision or edited output
    reviewer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 3. Capability Usage Metrics (For Optimization)
CREATE TABLE IF NOT EXISTS public.capability_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capability_key VARCHAR(100) NOT NULL REFERENCES public.agent_capabilities(capability_key),
    workspace_id UUID NOT NULL,
    success_rate FLOAT DEFAULT 1.0,
    avg_latency_ms INTEGER DEFAULT 0,
    avg_cost FLOAT DEFAULT 0,
    total_runs INTEGER DEFAULT 0,
    last_run_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(workspace_id, capability_key)
);

-- Bridge Node Runs to Capabilities
ALTER TABLE public.workflow_nodes ADD COLUMN IF NOT EXISTS capability_key VARCHAR(100) REFERENCES public.agent_capabilities(capability_key);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_human_tasks_run ON public.human_tasks(workflow_run_id);
CREATE INDEX IF NOT EXISTS idx_human_tasks_status ON public.human_tasks(status);
CREATE INDEX IF NOT EXISTS idx_agent_capabilities_enabled ON public.agent_capabilities(is_enabled);

COMMENT ON TABLE public.agent_capabilities IS 'Registry of reusable AI capabilities and tools.';
COMMENT ON TABLE public.human_tasks IS 'Tracks manual intervention and approval gates in workflows.';
