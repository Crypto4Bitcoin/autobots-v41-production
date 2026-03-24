-- Add Artifacts Table for Lineage Tracking
CREATE TABLE IF NOT EXISTS public.artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    pipeline_item_id UUID NOT NULL REFERENCES public.pipeline_items(id) ON DELETE CASCADE,
    agent_run_id UUID REFERENCES public.agent_runs(id) ON DELETE SET NULL,
    parent_artifact_id UUID REFERENCES public.artifacts(id) ON DELETE SET NULL,
    type VARCHAR(255) NOT NULL, -- e.g., 'research_summary', 'composition_draft', 'compliance_report'
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for lineage queries
CREATE INDEX IF NOT EXISTS idx_artifacts_pipeline_item ON public.artifacts(pipeline_item_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_parent ON public.artifacts(parent_artifact_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_workspace ON public.artifacts(workspace_id);

-- Add last_artifact_id to pipeline_items for easy retrieval of the latest state
ALTER TABLE public.pipeline_items 
ADD COLUMN IF NOT EXISTS last_artifact_id UUID REFERENCES public.artifacts(id) ON DELETE SET NULL;

COMMENT ON TABLE public.artifacts IS 'Stores versioned outputs from agents with parent-child lineage for traceability.';
