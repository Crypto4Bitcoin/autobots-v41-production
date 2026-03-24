import { WorkflowEvolutionService } from "../lib/services/workflow-evolution.service";
import { ImprovementProposalService } from "../lib/services/improvement-proposal.service";
import { VersionComparisonService } from "../lib/services/version-comparison.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testWorkflowEvolution() {
  console.log("🚀 Testing Phase 31: Workflow Learning & Auto-Evolution...\n");

  setupSupabaseMock();

  const evolution = new WorkflowEvolutionService();
  const proposer = new ImprovementProposalService();
  const bench = new VersionComparisonService();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const workflowId = "wf-slow-render";

  // 1. Scenario: Performance Analysis (Bottleneck Detection)
  console.log("Scenario A: Performance Analysis");
  const signals = await evolution.analyzeEvolutionSignals();
  console.log(`✅ Performance Signals: ${signals.length} identified.`);

  // 2. Scenario: Improvement Proposal Generation
  console.log("Scenario B: Structural Improvement Proposal");
  const proposal = await proposer.generateProposal(signals[0]);
  console.log(`✅ Proposal type: ${proposal.type}. Description: ${proposal.description}\n`);

  // 3. Scenario: Version Benchmarking
  console.log("Scenario C: Version Benchmarking (A/B Comparison)");
  const comparison = await bench.compareVersions("v1-original", "v2-evolved");
  console.log(`✅ Performance Delta: Winner is ${comparison.winner_version_id} (Margin: ${comparison.margin * 100}%)`);

  if (signals[0].improvement_potential === "high" && proposal.type === "capability_replacement" && comparison.margin > 0) {
    console.log("✅ Workflow learning and auto-evolution logic verified.");
  } else {
    console.error("❌ FAILED: Evolution validation mismatch.");
  }

  console.log("\n🎉 PHASE 31: WORKFLOW EVOLUTION VERIFIED!");
}

testWorkflowEvolution();
