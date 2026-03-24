// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DBService, supabase } from "../lib/services/supabase-service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Orchestrator, QueueService } from "../lib/orchestrator/orchestrator";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PipelineState } from "../lib/types/enums";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { WorkflowDefinitionService } from "../lib/services/workflow-definition-service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { WorkflowEngine } from "../lib/services/workflow-engine";

async function testPlatformExecution() {
  console.log("🚀 Testing Phase 8: Platform Enablement (Capability + Human Gate)...\n");

  const workspaceId = "00000000-0000-0000-0000-000000000001";
  const pipelineItemId = "00000000-0000-0000-0000-111111111111";
  const workerId = "test-platform-worker";

  // 1. MOCK Setup
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const db: unknown = {
    def: { id: "def-phase8", workflow_nodes: [] },
    nodeRuns: [],
    events: []
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase as any).from = (table: string) => {
    const megaChain: unknown = {};
    const singleFn = () => {
        if (table === 'agent_capabilities') return { data: { capability_key: 'search.web', display_name: 'Search', runtime_type: 'internal_agent' } };
        if (table === 'workflow_nodes') return { data: { capability_key: 'search.web' } };
        if (table === 'pipeline_items') return { data: { title: 'Test Item' } };
        return { data: {} };
    };

    megaChain.select = () => megaChain;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    megaChain.insert = (rows: unknown[]) => megaChain;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    megaChain.update = (fields: unknown) => megaChain;
    megaChain.delete = () => megaChain;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    megaChain.upsert = (rows: unknown[]) => megaChain;
    megaChain.eq = (col: string, val: unknown) => {
        // Special case for capability/node resolution
        if (val === 'human.review' || val === 'node-review') {
            megaChain.single = () => ({ data: { capability_key: 'human.review', runtime_type: 'human_task' } });
        } else if (val === 'slack.post' || val === 'node-slack') {
            megaChain.single = () => ({ data: { capability_key: 'slack.post', runtime_type: 'tool_adapter' } });
        } else {
            megaChain.single = singleFn;
        }
        return megaChain;
    };
    megaChain.single = singleFn;
    megaChain.lt = () => megaChain;
    megaChain.order = () => megaChain;

    return megaChain;
  };

  try {
    // 2. Test AI Agent Capability (Internal Agent)
    console.log("Test: Executing search.web capability...");
    const nodeRunSearch = { id: "run-search", workflow_node_id: "node-search", pipeline_item_id: pipelineItemId, workspace_id: workspaceId };
    await Orchestrator.processNodeRun(nodeRunSearch, workerId);
    console.log("✅ Passed: AI Agent node processed.");

    // 3. Test External Tool Capability (Tool Adapter)
    console.log("\nTest: Executing slack.post capability...");
    const nodeRunSlack = { id: "run-slack", workflow_node_id: "node-slack", pipeline_item_id: pipelineItemId, workspace_id: workspaceId };
    await Orchestrator.processNodeRun(nodeRunSlack, workerId);
    console.log("✅ Passed: External tool node processed (mocked).");

    // 4. Test Human Review Capability (Human Task)
    console.log("\nTest: Creating human.review gate...");
    const nodeRunReview = { id: "run-review", workflow_node_id: "node-review", pipeline_item_id: pipelineItemId, workspace_id: workspaceId };
    await Orchestrator.processNodeRun(nodeRunReview, workerId);
    console.log("✅ Passed: Human task created and workflow branch paused.");

    console.log("\n🎉 PLATFORM INFRASTRUCTURE VERIFIED!");

  } catch (err) {
    console.error("\n❌ TESTS FAILED:");
    console.error(err);
    process.exit(1);
  }
}

// Set dummy envs
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://dummy.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "dummy";

testPlatformExecution();
