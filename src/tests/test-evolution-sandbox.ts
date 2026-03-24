// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EvolutionProposalService, EvolutionProposal } from "../lib/services/evolution-proposal-service";
import { EvolutionLabService, ProposalEvaluatorService } from "../lib/services/evolution-lab-service";
import { DeterminismGuardService, CostGuardService, SafetyGuardService } from "../lib/services/evolution-guards-service";
import { GovernanceApprovalService, GraduationPipelineService } from "../lib/services/governance-approval-service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function runPhase46Tests() {
  console.log("?? Testing Phase 46: Autonomous Evolution Sandbox\n");
  setupSupabaseMock();

  const baseProposal: unknown = {
      title: "Optimize Video Ingestion Strategy",
      rationale: "Replacing sequential processing with parallel chunking.",
      proposedChange: { targetType: "workflow", targetId: "wf-media-ingest-to-publish", mutations: {} },
      expectedBenefits: { latencyImprovementMs: 500, costReductionUsd: 0.1 },
      riskClassification: "medium"
  };

  // 1. Direct Production Mutation Blocked
  console.log("Test 1: Reject unsafe proposal attempting direct production mutation...");
  try {
     const p1 = { ...baseProposal, proposedChange: { ...baseProposal.proposedChange, mutations: { directProductionWrite: true } }};
     const prop = await EvolutionProposalService.submitProposal(p1);
     SafetyGuardService.validate(prop);
     console.error("? Failed: Safety guard allowed direct production mutation.");
  } catch (e: unknown) {
     console.log("? Passed: Blocked -", e.message);
  }

  // 2. Reject proposal trying to modify security boundaries
  console.log("\nTest 2: Reject proposal attempting to modify security or governance policies...");
  try {
     const p2 = { ...baseProposal, proposedChange: { ...baseProposal.proposedChange, mutations: { crossTenantAccess: true } }};
     const prop = await EvolutionProposalService.submitProposal(p2);
     SafetyGuardService.validate(prop);
     console.error("? Failed: Safety guard allowed tenant boundary breach.");
  } catch (e: unknown) {
     console.log("? Passed: Blocked -", e.message);
  }

  // 3. Reject determinism violation
  console.log("\nTest 3: Reject proposal that violates deterministic execution guarantees...");
  try {
     const p3 = { ...baseProposal, proposedChange: { targetType: "routing_strategy", targetId: "router", mutations: { nondeterministic: true } }};
     const prop = await EvolutionProposalService.submitProposal(p3);
     DeterminismGuardService.validate(prop);
     console.error("? Failed: Determinism guard allowed non-deterministic routing change.");
  } catch (e: unknown) {
     console.log("? Passed: Blocked -", e.message);
  }

  // 4. Reject Cost Increase
  console.log("\nTest 4: Reject proposal if cost or failure rate increases...");
  try {
     const p4 = { ...baseProposal, expectedBenefits: { costReductionUsd: -5.0 } };
     const prop = await EvolutionProposalService.submitProposal(p4);
     CostGuardService.validate(prop);
     console.error("? Failed: Cost guard allowed proposal that projects a deficit.");
  } catch (e: unknown) {
     console.log("? Passed: Blocked -", e.message);
  }

  // 5. Successful Execution and Evaluation
  console.log("\nTest 5: Execute proposal inside sandbox environment & Compare Metrics...");
  try {
     const validProp = await EvolutionProposalService.submitProposal(baseProposal);
     const baseline = { latencyMs: 5000, costUsd: 1.0, reliabilityPct: 99.9, qualityScore: 80 };
     
     // Guards
     DeterminismGuardService.validate(validProp);
     SafetyGuardService.validate(validProp);
     CostGuardService.validate(validProp);

     // Sandbox Simulation
     const sandboxResult = await EvolutionLabService.simulateProposal(validProp, baseline);
     console.log(`   -> Sandbox Result: Latency (${sandboxResult.latencyMs}ms), Cost ($${sandboxResult.costUsd}), Quality (${sandboxResult.qualityScore})`);
     
     // Evaluate
     ProposalEvaluatorService.evaluate(validProp, baseline, sandboxResult);
     console.log("? Passed: Evaluation successful. Proposal measurements passed metric requirements.");

     console.log("\nTest 6: Approve proposal when improvements meet latency, cost, and reliability thresholds...");
     const isApproved = await GovernanceApprovalService.requestApproval(validProp);
     if (isApproved) {
         console.log(`? Passed: Proposal ${validProp.proposalId} auto-approved for medium/low risk.`);
     }

     console.log("\nTest 7: Ensure approved proposals move to staged deployment only...");
     const stagingProp = await GraduationPipelineService.promote(validProp);
     if (stagingProp.status === "staged") {
         console.log("? Passed: Deployed carefully to staging environment. Not pushed direct to prod.");
     }

  } catch (e: unknown) {
     console.error("? Failed:", e.message);
  }

  console.log("\n?? PHASE 46: AUTONOMOUS EVOLUTION SANDBOX COMPLETED!");
}

runPhase46Tests();
