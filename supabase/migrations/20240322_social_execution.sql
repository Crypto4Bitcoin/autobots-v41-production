-- Phase 9: Social Execution Pack v1
-- Support for Browser automation, Media acquisition, and Multi-platform publishing

-- 1. External Accounts for Platform Integrations
CREATE TABLE IF NOT EXISTS public.external_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    platform VARCHAR(50) NOT NULL, -- 'youtube', 'tiktok', 'facebook', 'instagram', 'x'
    account_name VARCHAR(255) NOT NULL,
    auth_type VARCHAR(50) NOT NULL, -- 'oauth2', 'cookie_session', 'api_key'
    credential_ref TEXT NOT NULL, -- Encrypted reference or key name
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'expired', 'locked'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, platform, account_name)
);

-- 2. Publish Jobs (Social Post Lifecycle)
CREATE TABLE IF NOT EXISTS public.publish_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_run_id UUID REFERENCES public.workflow_runs(id) ON DELETE SET NULL,
    workspace_id UUID NOT NULL,
    platform VARCHAR(50) NOT NULL,
    external_account_id UUID REFERENCES public.external_accounts(id),
    
    asset_artifact_id UUID REFERENCES public.artifacts(id), -- The video/image
    caption_artifact_id UUID REFERENCES public.artifacts(id), -- The text copy
    title_artifact_id UUID REFERENCES public.artifacts(id),
    thumbnail_artifact_id UUID REFERENCES public.artifacts(id),
    
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'scheduled', 'publishing', 'completed', 'failed'
    scheduled_for TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    published_url TEXT,
    platform_post_id TEXT,
    error_log TEXT,
    
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_publish_jobs_status ON public.publish_jobs(status);
CREATE INDEX IF NOT EXISTS idx_publish_jobs_scheduled ON public.publish_jobs(scheduled_for) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_external_accounts_workspace ON public.external_accounts(workspace_id);

COMMENT ON TABLE public.external_accounts IS 'Manages credentials and authentication status for social platforms.';
COMMENT ON TABLE public.publish_jobs IS 'Tracks the distribution and success of content across social networks.';
