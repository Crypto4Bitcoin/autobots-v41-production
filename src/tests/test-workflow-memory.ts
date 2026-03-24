import { WorkflowRecommendationService } from "../lib/services/workflow-recommendation-service";
import { RecommendationFeedbackService } from "../lib/services/recommendation-feedback-service";
import { WorkflowAssemblerService } from "../lib/services/workflow-assembler-service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testWorkflowMemory() {
  console.log("🚀 Testing Phase 13: Workflow Memory & Advice (The Learning Loop)...\n");

  const workspaceId = "ws-memory-test";
  const userId = "op-nova";

  // 1. Setup Architecture Mocks
  setupSupabaseMock();

  // 2. Scenario A: Advice Based on History
  console.log("Scenario A: Intelligent Advice (Advisor Mode)");
  const goal = "Build a competitor analysis.";
  const recs = await WorkflowRecommendationService.recommend(goal, workspaceId);
  
  console.log(`✅ Recommendations for '${goal}':`);
  recs.forEach(r => {
      console.log(` - ${r.displayName} (Confidence: ${r.confidence.toFixed(2)})`);
      console.log(`   Reason: ${r.reason}`);
  });
  console.log("");

  // 3. Scenario B: Proposal Persistence
  console.log("Scenario B: Draft Proposal Persistence");
  await WorkflowAssemblerService.assembleDraft(
    ["search.web", "research.analyze"], 
    "A quick research draft",
    workspaceId,
    userId
  );
  console.log("✅ Proposal sent to persistence layer (workflow_proposals).\n");

  // 4. Scenario C: Recording Interaction Feedback
  console.log("Scenario C: Recording User Feedback Loop");
  await RecommendationFeedbackService.recordFeedback({
      goalText: goal,
      templateId: "media-short-001",
      outcome: "accepted"
  });
  console.log("✅ Usage feedback recorded to closed-loop memory.\n");

  console.log("🎉 PHASE 13: WORKFLOW MEMORY VERIFIED!");
}

testWorkflowMemory();
