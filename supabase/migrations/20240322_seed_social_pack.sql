-- Phase 9: Social Execution Pack Seeding
-- Adding specific social media agents and capabilities

INSERT INTO public.agent_capabilities (capability_key, display_name, description, runtime_type, supported_node_types)
VALUES 
('media.acquire', 'Media Acquisition', 'Download video and audio assets from source URLs.', 'internal_agent', '{agent}'),
('video.edit', 'Video Editing', 'Render and clip video assets for specific platforms.', 'internal_agent', '{agent}'),
('social.publish', 'Social Publishing', 'Post content to YouTube, TikTok, X, etc.', 'tool_adapter', '{agent}');

-- Mapping Agents to Capabilities
-- Note: In Phase 8/9, we shift to Capability keys as the primary routing mechanism.

INSERT INTO public.workflow_definitions (name, slug, description)
VALUES ('Social-Source-to-Publish', 'social-source-to-publish', 'End-to-end autonomous social media content pipeline.');

DO $$
DECLARE
    v_def_id UUID;
    v_n_disc UUID;
    v_n_brow UUID;
    v_n_down UUID;
    v_n_anal UUID;
    v_n_plan UUID;
    v_n_edit UUID;
    v_n_prev UUID;
    v_n_pub  UUID;
BEGIN
    SELECT id INTO v_def_id FROM public.workflow_definitions WHERE slug = 'social-source-to-publish';

    -- Nodes
    INSERT INTO public.workflow_nodes (workflow_definition_id, node_key, capability_key)
    VALUES (v_def_id, 'DISCOVER', 'search.web') RETURNING id INTO v_n_disc;

    INSERT INTO public.workflow_nodes (workflow_definition_id, node_key, capability_key)
    VALUES (v_def_id, 'BROWSE', 'search.web') RETURNING id INTO v_n_brow;

    INSERT INTO public.workflow_nodes (workflow_definition_id, node_key, capability_key)
    VALUES (v_def_id, 'DOWNLOAD', 'media.acquire') RETURNING id INTO v_n_down;

    INSERT INTO public.workflow_nodes (workflow_definition_id, node_key, capability_key)
    VALUES (v_def_id, 'ANALYZE', 'analyze.trends') RETURNING id INTO v_n_anal;

    INSERT INTO public.workflow_nodes (workflow_definition_id, node_key, capability_key)
    VALUES (v_def_id, 'EDIT_PLAN', 'generate.content') RETURNING id INTO v_n_plan;

    INSERT INTO public.workflow_nodes (workflow_definition_id, node_key, capability_key)
    VALUES (v_def_id, 'RENDER', 'video.edit') RETURNING id INTO v_n_edit;

    INSERT INTO public.workflow_nodes (workflow_definition_id, node_key, capability_key)
    VALUES (v_def_id, 'REVIEW', 'human.review') RETURNING id INTO v_n_prev;

    INSERT INTO public.workflow_nodes (workflow_definition_id, node_key, capability_key)
    VALUES (v_def_id, 'PUBLISH', 'social.publish') RETURNING id INTO v_n_pub;

    -- Edges
    INSERT INTO public.workflow_edges (workflow_definition_id, from_node_id, to_node_id) VALUES (v_def_id, v_n_disc, v_n_brow);
    INSERT INTO public.workflow_edges (workflow_definition_id, from_node_id, to_node_id) VALUES (v_def_id, v_n_brow, v_n_down);
    INSERT INTO public.workflow_edges (workflow_definition_id, from_node_id, to_node_id) VALUES (v_def_id, v_n_down, v_n_anal);
    INSERT INTO public.workflow_edges (workflow_definition_id, from_node_id, to_node_id) VALUES (v_def_id, v_n_anal, v_n_plan);
    INSERT INTO public.workflow_edges (workflow_definition_id, from_node_id, to_node_id) VALUES (v_def_id, v_n_plan, v_n_edit);
    INSERT INTO public.workflow_edges (workflow_definition_id, from_node_id, to_node_id) VALUES (v_def_id, v_n_edit, v_n_prev);
    INSERT INTO public.workflow_edges (workflow_definition_id, from_node_id, to_node_id) VALUES (v_def_id, v_n_prev, v_n_pub);

END $$;
