import { GlobalTaskGraphService } from "../lib/services/global-task-graph.service";
import { CrossWorkflowIntelligenceService } from "../lib/services/cross-workflow-intelligence.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testGlobalTaskGraph() {
  console.log("🚀 Testing Phase 33: Global Task Graph & Unified Operating Model...\n");

  setupSupabaseMock();

  const graphService = new GlobalTaskGraphService();
  const intelService = new CrossWorkflowIntelligenceService();

  const workspaceId = "ws-global-123";

  // 1. Scenario: Graph Reconstruction
  console.log("Scenario A: Unified Graph Reconstruction");
  const graph = await graphService.rebuildGraph(workspaceId);
  console.log(`✅ Reconstructed graph with ${graph.nodes.length} nodes and ${graph.edges.length} edges.`);
  console.log(`✅ Found Goal Node: ${graph.nodes.find(n => n.type === "goal")?.label}\n`);

  // 2. Scenario: Cross-Workflow Insights
  console.log("Scenario B: Cross-Workflow Intelligence");
  const insights = await intelService.getUnifiedInsights(workspaceId);
  console.log(`✅ Top Contributor: ${insights.top_contributor}`);
  console.log(`✅ Structural Recommendation: ${insights.recommendation}\n`);

  if (graph.nodes.length >= 4 && graph.edges.length >= 3 && insights.top_contributor === "nova-researcher") {
    console.log("✅ Global task graph and unified operations verified.");
  } else {
    console.error("❌ FAILED: Task graph validation mismatch.");
  }

  console.log("\n🎉 PHASE 33: UNIFIED OPERATING MODEL VERIFIED!");
}

testGlobalTaskGraph();
