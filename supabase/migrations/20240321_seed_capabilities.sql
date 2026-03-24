-- Seeding core capabilities for AutoBots Platform
-- Mapping role-based agents to domain-agnostic capabilities

INSERT INTO public.agent_capabilities (capability_key, display_name, description, runtime_type, supported_node_types)
VALUES 
('search.web', 'Web Search', 'Search the web for real-time information and sources.', 'internal_agent', '{agent}'),
('analyze.trends', 'Trend Analysis', 'Extract and analyze content trends from social or news data.', 'internal_agent', '{agent}'),
('generate.content', 'Content Generation', 'Generate articles, scripts, or reports from research data.', 'internal_agent', '{agent}'),
('score.quality', 'Quality Scoring', 'Evaluate content against quality and virality benchmarks.', 'internal_agent', '{agent}'),
('human.review', 'Human Approval', 'Pause workflow for manual sign-off or editing.', 'human_task', '{human_gate}'),
('slack.post', 'Slack Post', 'Publish a message to a Slack channel.', 'tool_adapter', '{agent, system}');

-- Link seed workflow nodes to capabilities
UPDATE public.workflow_nodes SET capability_key = 'analyze.trends' WHERE node_key = 'DISCOVER';
UPDATE public.workflow_nodes SET capability_key = 'search.web' WHERE node_key = 'RESEARCH';
UPDATE public.workflow_nodes SET capability_key = 'analyze.trends' WHERE node_key = 'TREND_ANALYSIS';
UPDATE public.workflow_nodes SET capability_key = 'generate.content' WHERE node_key = 'COMPOSE';
UPDATE public.workflow_nodes SET capability_key = 'human.review' WHERE node_key = 'REVIEW';
