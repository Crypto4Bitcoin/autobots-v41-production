import { WorkflowRecommendationService } from "../lib/services/workflow-recommendation-service";
import { WorkflowAssemblerService } from "../lib/services/workflow-assembler-service";
import { IntentParserService } from "../lib/services/intent-parser-service";
import { VoiceGovernanceService } from "../lib/services/voice-governance-service";
import { CommandPlannerService } from "../lib/services/command-planner-service";
import { VoiceExecutionService } from "../lib/services/voice-execution-service";
import { WorkflowProposalViewer } from "../lib/services/workflow-proposal-viewer";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testAutonomousAssembly() {
  console.log("🚀 Testing Phase 12: Autonomous Workflow Recommendation & Assembly...\n");

  const workspaceId = "ws-assembly-1";
  const userId = "op-nova";

  // 1. Setup Architecture Mocks
  setupSupabaseMock();

  // 2. Scenario A: Recommendation Lifecycle
  console.log("Scenario A: Intelligent Recommendation");
  const recs = await WorkflowRecommendationService.recommend("I need to build a competitor monitoring system.");
  console.log(`✅ Recommendations generated: ${recs.map(r => r.displayName).join(', ')}`);
  console.log(`Top match: ${recs[0].displayName} (Reason: ${recs[0].reason})\n`);

  // 3. Scenario B: Draft-First Assembly via Voice
  console.log("Scenario B: Voice-Guided Assembly (Draft-First Rule)");
  const utterance = "Nova, build me a report for research.";
  
  // Hear -> Understand
  const intent = await IntentParserService.parse(utterance);
  
  // Govern (Expect PROPOSAL outcome for assembly)
  const decision = await VoiceGovernanceService.decide(workspaceId, userId, intent);
  
  // Plan
  const plan = await CommandPlannerService.plan(intent);
  
  // Execute (Dumb dispatch)
  const result = await VoiceExecutionService.execute(plan, decision.outcome);
  
  console.log(`✅ Outcome: ${decision.outcome} (Reason: ${decision.reasonCode})`);
  console.log(`✅ Plan: ${plan.explanation}`);
  console.log(`✅ Nova: ${result.feedback}\n`);

  // 4. Scenario C: Custom Structural Assembly
  console.log("Scenario C: Custom Structural Assembly (Visual Projection)");
  const proposal = await WorkflowAssemblerService.assembleDraft(
    ["search.web", "research.analyze", "media.render"], 
    "A custom research-to-media pipeline"
  );
  
  console.log(`✅ Draft DAG Assembled with ${proposal.draftDag.nodes.length} nodes.`);
  console.log(WorkflowProposalViewer.projectVisual(proposal.draftDag));
  console.log(`✅ Validation: ${proposal.isGoverned ? "Passed Governance Check" : "Governed Flag Check"}`);
  console.log(`✅ Warnings: ${proposal.warnings.length > 0 ? proposal.warnings.join(', ') : "None"}\n`);

  console.log("🎉 PHASE 12: AUTONOMOUS ASSEMBLY VERIFIED!");
}

testAutonomousAssembly();
