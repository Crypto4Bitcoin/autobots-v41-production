-- AutoBots: Phase 1-2 Schema Foundation (Hardened)
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Enums for State Integrity (Unified with TypeScript)
DO $$ BEGIN
    CREATE TYPE pipeline_state AS ENUM (
        'INPUT_RECEIVED', 'CLASSIFYING_INPUT', 
        'EXTRACTING_MEDIA', 'TRANSCRIBING', 'RESEARCHING', 'FACT_CHECKING', 'TREND_ANALYSIS',
        'ANGLE_GENERATION', 'CONTENT_STRATEGY', 'PERSONA_MODELING',
        'CONTENT_COMPOSITION', 'REPURPOSING', 'ASSET_BRIEFING', 'VISUAL_GENERATION', 'CLIP_GENERATION',
        'QUALITY_SCORING', 'VIRALITY_SCORING', 'COMPLIANCE_CHECK', 'PLATFORM_REVIEW',
        'READY_TO_POST', 'SCHEDULING', 'POSTING', 'ANALYTICS', 'EXPANSION', 'MEMORY_UPDATE',
        'COMPLETED', 'FAILED', 'DEAD_LETTER', 'NEEDS_REVIEW'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'dead_letter');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE agent_run_status AS ENUM ('success', 'failed', 'retry');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE source_input_type AS ENUM ('URL', 'FILE', 'TEXT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE memory_category AS ENUM ('content', 'audience', 'prompt', 'strategy');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Utility Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. Core Pipeline Tables
CREATE TABLE IF NOT EXISTS pipeline_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL,
    current_state pipeline_state NOT NULL DEFAULT 'INPUT_RECEIVED',
    title TEXT,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_agent_run_id UUID,
    metadata JSONB DEFAULT '{}'
);

CREATE TRIGGER update_pipeline_items_modtime 
BEFORE UPDATE ON pipeline_items 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_pipeline_workspace ON pipeline_items (workspace_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_workspace_state ON pipeline_items (workspace_id, current_state, updated_at DESC);

CREATE TABLE IF NOT EXISTS source_inputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_item_id UUID NOT NULL REFERENCES pipeline_items(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    source_type source_input_type NOT NULL,
    url TEXT,
    raw_text TEXT,
    file_path TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Agent Execution Tracking
CREATE TABLE IF NOT EXISTS agent_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_item_id UUID NOT NULL REFERENCES pipeline_items(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    agent_name TEXT NOT NULL,
    input_state pipeline_state NOT NULL,
    output_state pipeline_state,
    status agent_run_status NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    provider_used TEXT,
    latency_ms INTEGER,
    tokens_used INTEGER,
    error_message TEXT,
    input_data JSONB,
    output_data JSONB,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_agent_runs_pipeline_started ON agent_runs (pipeline_item_id, started_at DESC);

-- Link last_agent_run_id back with safe guard
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_last_agent_run') THEN
        ALTER TABLE pipeline_items ADD CONSTRAINT fk_last_agent_run FOREIGN KEY (last_agent_run_id) REFERENCES agent_runs(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 5. Stage Output Tables (Foundation Set)
CREATE TABLE IF NOT EXISTS research_packs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_item_id UUID NOT NULL REFERENCES pipeline_items(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    summary TEXT,
    key_claims JSONB DEFAULT '[]',
    facts JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_item_id UUID NOT NULL REFERENCES pipeline_items(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    master_content JSONB NOT NULL,
    platform_variants JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Quality & Review
CREATE TABLE IF NOT EXISTS review_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_item_id UUID NOT NULL REFERENCES pipeline_items(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    agent_name TEXT NOT NULL,
    score_quality FLOAT,
    score_virality FLOAT,
    feedback TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    reviewer_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Durable Queue System
CREATE TABLE IF NOT EXISTS job_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_item_id UUID NOT NULL REFERENCES pipeline_items(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    target_state pipeline_state NOT NULL,
    payload JSONB DEFAULT '{}',
    status job_status NOT NULL DEFAULT 'pending',
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    locked_at TIMESTAMP WITH TIME ZONE,
    locked_by TEXT,
    error_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_job_queue_modtime 
BEFORE UPDATE ON job_queue 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for efficient worker polling
CREATE INDEX IF NOT EXISTS idx_job_queue_workspace_status ON job_queue (workspace_id, status, created_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_job_queue_locked_at ON job_queue (locked_at) WHERE status = 'processing';
CREATE INDEX IF NOT EXISTS idx_job_queue_pipeline_item ON job_queue (pipeline_item_id);

-- 8. Concurrency Locking
CREATE TABLE IF NOT EXISTS pipeline_locks (
    pipeline_item_id UUID PRIMARY KEY REFERENCES pipeline_items(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    worker_id TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pipeline_locks_expires ON pipeline_locks (expires_at);

-- 9. Memory Patterns
CREATE TABLE IF NOT EXISTS memory_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL,
    category memory_category NOT NULL,
    pattern_key TEXT NOT NULL,
    pattern_data JSONB NOT NULL,
    performance_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (workspace_id, category, pattern_key)
);

CREATE TRIGGER update_memory_modtime 
BEFORE UPDATE ON memory_records 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_memory_workspace_category ON memory_records (workspace_id, category);

-- 10. Operational Metrics
CREATE TABLE IF NOT EXISTS pipeline_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_item_id UUID NOT NULL REFERENCES pipeline_items(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    agent_name TEXT NOT NULL,
    stage_duration_ms INTEGER,
    tokens_used INTEGER,
    provider TEXT,
    status agent_run_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Audit Logs (Tracing)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_item_id UUID REFERENCES pipeline_items(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL,
    action TEXT NOT NULL,
    actor TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_pipeline_item ON audit_logs (pipeline_item_id);
