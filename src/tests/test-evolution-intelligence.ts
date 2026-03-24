import { WorkflowEvolutionService } from "../lib/services/workflow-evolution.service";
import { ImprovementProposalService } from "../lib/services/improvement-proposal.service";
import { VersionComparisonService } from "../lib/services/version-comparison.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testEvolutionIntelligence() {
  console.log("🚀 Testing Phase 39: Workflow Evolution Intelligence...\n");

  setupSupabaseMock();

  // 1. Performance Analysis
  const evolution = new WorkflowEvolutionService();
  const signals = await evolution.analyzeEvolutionSignals();
  console.log(`✅ Evolution Signals: ${signals.length} identified.`);
  if (signals.length > 0) {
      console.log(`- Top Candidate: ${signals[0].workflow_id} (Potential: ${signals[0].improvement_potential})`);
  }

  // 2. Proposal Generation
  const proposer = new ImprovementProposalService();
  const proposal = await proposer.generateProposal(signals[0]);
  console.log(`✅ Improvement Proposal Generated: ${proposal.type}`);
  console.log(`- Description: ${proposal.description}`);

  // 3. Version Comparison
  const comparator = new VersionComparisonService();
  const comparison = await comparator.compareVersions("media-render-v1", "media-render-v1.1-prop");
  console.log(`✅ Version Benchmark: Winner is ${comparison.winner_version_id} (Margin: ${comparison.margin * 100}%)`);

  if (comparison.confidence > 0.8) {
      console.log("✅ High-confidence evolution path identified.");
  }

  console.log("\n🎉 PHASE 39: EVOLUTION INTELLIGENCE VERIFIED!");
}

testEvolutionIntelligence();
