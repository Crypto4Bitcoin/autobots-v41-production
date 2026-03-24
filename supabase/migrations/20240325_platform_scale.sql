-- Phase 11: Platform Scale, Governance & Ecosystem Layer

-- 1. Capability Trust Tiers
ALTER TABLE public.agent_capabilities ADD COLUMN trust_tier INTEGER DEFAULT 1;
COMMENT ON COLUMN public.agent_capabilities.trust_tier IS '1: Read-only/Low, 2: Moderate, 3: External Side-effects, 4: Privileged';

-- 2. Vertical Pack Registry
CREATE TABLE IF NOT EXISTS public.vertical_packs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    version TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- active, deprecated, retired
    manifest JSONB NOT NULL DEFAULT '{}',
    schema_config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Pack Mapping Tables
CREATE TABLE IF NOT EXISTS public.pack_capability_links (
    pack_id UUID REFERENCES public.vertical_packs(id) ON DELETE CASCADE,
    capability_key TEXT NOT NULL,
    PRIMARY KEY (pack_id, capability_key)
);

CREATE TABLE IF NOT EXISTS public.pack_workflow_templates (
    pack_id UUID REFERENCES public.vertical_packs(id) ON DELETE CASCADE,
    workflow_definition_id UUID REFERENCES public.workflow_definitions(id) ON DELETE CASCADE,
    PRIMARY KEY (pack_id, workflow_definition_id)
);

-- 4. Multi-Workspace Governance Profiles
CREATE TABLE IF NOT EXISTS public.workspace_governance_profiles (
    workspace_id UUID PRIMARY KEY, -- 1:1 with workspace for simplicity
    enabled_pack_slugs TEXT[] DEFAULT '{}',
    allowed_trust_tier INTEGER DEFAULT 2,-- Default allowed tier without human approval
    max_monthly_budget_usd DECIMAL(10, 2) DEFAULT 100.00,
    current_monthly_spend_usd DECIMAL(10, 2) DEFAULT 0.00,
    enforce_human_approval_above_tier INTEGER DEFAULT 3,
    voice_trigger_enabled BOOLEAN DEFAULT true,
    autonomous_execution_enabled BOOLEAN DEFAULT true,
    restricted_capability_keys TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed Initial Packs
INSERT INTO public.vertical_packs (name, slug, version, manifest)
VALUES 
('Media Automation Pack', 'media', '1.0.0', '{"description": "Browser automation, media processing, and social publishing."}'),
('Research Pack', 'research', '1.0.0', '{"description": "Literature search, summarization, and trend discovery."}');

-- Update Capability Trust Tiers
UPDATE public.agent_capabilities SET trust_tier = 1 WHERE capability_key IN ('search.web', 'analyze.trends');
UPDATE public.agent_capabilities SET trust_tier = 2 WHERE capability_key IN ('generate.content', 'video.edit');
UPDATE public.agent_capabilities SET trust_tier = 3 WHERE capability_key IN ('media.acquire', 'social.publish');
