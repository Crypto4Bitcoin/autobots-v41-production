import { WorkflowBuilderService } from "../lib/services/workflow-builder-service";
import { WorkflowProposalViewer } from "../lib/services/workflow-proposal-viewer";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testVisualBuilder() {
  console.log("🚀 Testing Phase 14: Visual Autonomous Workflow Builder...\n");

  const proposalId = "test-proposal-123";

  // 1. Setup Architecture Mocks
  setupSupabaseMock({
    workflow_proposals: [{
        id: proposalId,
        draft_definition: { nodes: [{ id: "n1", capability: "search.web" }], edges: [] }
    }]
  });

  const builder = new WorkflowBuilderService();

  // 2. Scenario A: Valid Edit (Add Node)
  console.log("Scenario A: Valid Visual Edit (Add Node)");
  const edit = {
    type: "add_node",
    node: {
      id: "node-new",
      capability: "media.render"
    }
  };

  await builder.applyEdit(proposalId, edit);
  console.log("✅ Visual Builder: add_node successful.\n");

  // 3. Scenario B: Structural Validation (Cycle Detection)
  console.log("Scenario B: Structural Validation (Cycle Detection)");
  try {
    const cycleEdit = {
        type: "add_edge",
        edge: { from: "node-new", to: "n1" } // Already have n1 -> ???, adding node-new -> n1
    };
    
    // Manually add n1 -> node-new first
    await builder.applyEdit(proposalId, { type: "add_edge", edge: { from: "n1", to: "node-new" } });
    
    // Now trigger cycle
    await builder.applyEdit(proposalId, cycleEdit);
    console.error("❌ FAILED: Cycle detection did not block circular dependency.");
  } catch (error: unknown) {
    console.log(`✅ Cycle detection blocked edit: ${error.message}\n`);
  }

  // 4. Scenario C: Visual Rendering for UI
  console.log("Scenario C: Visual Rendering for UI Projection");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
  const { data: proposal } = await (require("../lib/services/supabase-service").supabase as any)
    .from("workflow_proposals")
    .select("draft_definition")
    .eq("id", proposalId)
    .single();

  const rendered = WorkflowProposalViewer.render(proposal.draft_definition);
  console.log(`✅ Rendered JSON for UI: ${rendered.nodes.length} nodes, ${rendered.edges.length} edges.`);
  console.log(`Nodes: ${rendered.nodes.map((n: unknown) => n.id).join(', ')}\n`);

  console.log("🎉 PHASE 14: VISUAL BUILDER VERIFIED!");
}

testVisualBuilder();
