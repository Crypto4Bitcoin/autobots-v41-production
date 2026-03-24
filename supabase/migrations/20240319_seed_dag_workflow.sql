-- Seeding a generic DAG workflow for Phase 7
-- Workflow: Research-to-Report
-- A (Discover) -> B (Research), C (Analyze Trends) -> D (Compose Report) -> E (Review)

DO $$
DECLARE
    v_def_id UUID;
    v_node_a UUID;
    v_node_b UUID;
    v_node_c UUID;
    v_node_d UUID;
    v_node_e UUID;
BEGIN
    -- 1. Create Definition
    INSERT INTO public.workflow_definitions (name, slug, description)
    VALUES ('Research-to-Report', 'research-to-report', 'Generic workflow for automated research and reporting.')
    RETURNING id INTO v_def_id;

    -- 2. Create Nodes
    INSERT INTO public.workflow_nodes (workflow_definition_id, node_key, node_type, agent_name)
    VALUES (v_def_id, 'DISCOVER', 'agent', 'TrendDiscoveryAgent') RETURNING id INTO v_node_a;

    INSERT INTO public.workflow_nodes (workflow_definition_id, node_key, node_type, agent_name)
    VALUES (v_def_id, 'RESEARCH', 'agent', 'ResearchAgent') RETURNING id INTO v_node_b;

    INSERT INTO public.workflow_nodes (workflow_definition_id, node_key, node_type, agent_name)
    VALUES (v_def_id, 'TREND_ANALYSIS', 'agent', 'TrendDiscoveryAgent') RETURNING id INTO v_node_c;

    INSERT INTO public.workflow_nodes (workflow_definition_id, node_key, node_type, agent_name)
    VALUES (v_def_id, 'COMPOSE', 'agent', 'CompositionAgent') RETURNING id INTO v_node_d;

    INSERT INTO public.workflow_nodes (workflow_definition_id, node_key, node_type, agent_name)
    VALUES (v_def_id, 'REVIEW', 'human_gate', NULL) RETURNING id INTO v_node_e;

    -- 3. Create Edges
    -- A -> B
    -- A -> C
    -- B -> D
    -- C -> D
    -- D -> E
    INSERT INTO public.workflow_edges (workflow_definition_id, from_node_id, to_node_id) VALUES (v_def_id, v_node_a, v_node_b);
    INSERT INTO public.workflow_edges (workflow_definition_id, from_node_id, to_node_id) VALUES (v_def_id, v_node_a, v_node_c);
    INSERT INTO public.workflow_edges (workflow_definition_id, from_node_id, to_node_id) VALUES (v_def_id, v_node_b, v_node_d);
    INSERT INTO public.workflow_edges (workflow_definition_id, from_node_id, to_node_id) VALUES (v_def_id, v_node_c, v_node_d);
    INSERT INTO public.workflow_edges (workflow_definition_id, from_node_id, to_node_id) VALUES (v_def_id, v_node_d, v_node_e);

END $$;
