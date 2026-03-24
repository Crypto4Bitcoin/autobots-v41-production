-- Add Artifact Feedback for Optimization Loops
CREATE TABLE IF NOT EXISTS public.artifact_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artifact_id UUID NOT NULL REFERENCES public.artifacts(id) ON DELETE CASCADE,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    metrics JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g., {"clarity": 80, "alignment": 90}
    provided_by VARCHAR(255) NOT NULL, -- 'agent', 'user', 'evaluator'
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for optimization queries
CREATE INDEX IF NOT EXISTS idx_feedback_artifact ON public.artifact_feedback(artifact_id);

COMMENT ON TABLE public.artifact_feedback IS 'Stores evaluation scores for artifacts to drive the outcome-based optimization engine.';
