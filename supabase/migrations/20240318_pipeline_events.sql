-- Phase 6: Evented Workflow Backbone
-- This table demotes the queue to a transport layer and makes structured events the source of truth.

CREATE TABLE IF NOT EXISTS public.pipeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_item_id UUID NOT NULL REFERENCES public.pipeline_items(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    event_type VARCHAR(255) NOT NULL, -- e.g., 'job_claimed', 'agent_started', 'agent_completed', 'artifact_created', 'policy_decision_applied'
    from_state VARCHAR(50),
    to_state VARCHAR(50),
    artifact_id UUID REFERENCES public.artifacts(id),
    agent_run_id UUID REFERENCES public.agent_runs(id),
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    actor VARCHAR(255), -- worker_id or 'system'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for timeline retrieval
CREATE INDEX IF NOT EXISTS idx_pipeline_events_item_time ON public.pipeline_events(pipeline_item_id, created_at);
CREATE INDEX IF NOT EXISTS idx_pipeline_events_type ON public.pipeline_events(event_type);

COMMENT ON TABLE public.pipeline_events IS 'The source-of-truth event log for all pipeline activities, enabling machine-readable workflow history.';
