import { Orchestrator } from "../lib/orchestrator/orchestrator";
import { supabase } from "../lib/services/supabase-service";
import { BrowserControlAgent, MediaAcquisitionAgent, VideoEditAgent, PublisherAgent } from "../lib/agents/social-agents";
import { PipelineState } from "../lib/types/enums";

async function testSocialPack() {
  console.log("🚀 Testing Phase 9: Social Execution Pack v1...\n");

  const workspaceId = "00000000-0000-0000-0000-000000000001";
  const pipelineItemId = "00000000-0000-0000-0000-111111111111";
  const workerId = "test-social-worker";

  // 1. Setup Registry
  Orchestrator.registerAgent(PipelineState.RESEARCHING, new BrowserControlAgent());
  Orchestrator.registerAgent(PipelineState.ASSET_BRIEFING, new MediaAcquisitionAgent());
  Orchestrator.registerAgent(PipelineState.VISUAL_GENERATION, new VideoEditAgent());
  Orchestrator.registerAgent(PipelineState.POSTING, new PublisherAgent());

  // 2. MOCK Setup (Mega-Mock)
  const megaChain: unknown = {};
  megaChain.select = () => megaChain;
  megaChain.insert = () => ({ ...megaChain, single: () => ({ data: { id: "new-id" } }) });
  megaChain.update = () => megaChain;
  megaChain.delete = () => megaChain;
  megaChain.eq = (col: string, val: unknown) => {
      megaChain.single = () => {
          if (val === 'search.web' || val === 'node-browse') return { data: { capability_key: 'search.web', runtime_type: 'internal_agent' } };
          if (val === 'media.acquire' || val === 'node-down') return { data: { capability_key: 'media.acquire', runtime_type: 'internal_agent' } };
          if (val === 'social.publish' || val === 'node-pub') return { data: { capability_key: 'social.publish', runtime_type: 'tool_adapter' } };
          if (table === 'pipeline_items') return { data: { title: 'Viral Video Project', last_artifact_id: 'art-1' } };
          return { data: {} };
      };
      return megaChain;
  };
  megaChain.single = () => ({ data: {} });

  let table = "";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase as any).from = (t: string) => { table = t; return megaChain; };

  try {
    // 3. Test Browser Execution
    console.log("Test: Running BrowserControlAgent node...");
    const nodeBrowse = { id: "node-browse", workflow_node_id: "n-browse", pipeline_item_id: pipelineItemId, workspace_id: workspaceId };
    await Orchestrator.processNodeRun(nodeBrowse, workerId);
    console.log("✅ Passed: Browser agent executed.");

    // 4. Test Media Acquisition
    console.log("\nTest: Running MediaAcquisitionAgent node...");
    const nodeDown = { id: "node-down", workflow_node_id: "n-down", pipeline_item_id: pipelineItemId, workspace_id: workspaceId };
    await Orchestrator.processNodeRun(nodeDown, workerId);
    console.log("✅ Passed: Media agent executed.");

    // 5. Test Social Publishing (Tool Adapter path)
    console.log("\nTest: Running PublisherAgent (as tool adapter)...");
    const nodePub = { id: "node-pub", workflow_node_id: "n-pub", pipeline_item_id: pipelineItemId, workspace_id: workspaceId };
    await Orchestrator.processNodeRun(nodePub, workerId);
    console.log("✅ Passed: Social publishing executed.");

    console.log("\n🎉 SOCIAL EXECUTION PACK VERIFIED!");

  } catch (err) {
    console.error("\n❌ TESTS FAILED:");
    console.error(err);
    process.exit(1);
  }
}

// Set dummy envs
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://dummy.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "dummy";

testSocialPack();
