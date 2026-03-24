import { PolicyService } from "../lib/services/policy-service";
import { PipelineState } from "../lib/types/enums";

async function testPolicy() {
  console.log("🚀 Running Adaptive Policy Engine Logic Tests...\n");

  const mockWorkspacePolicy = {
    providerStrategyDefault: "balanced",
    complianceModeDefault: "standard",
    mandatoryReviewPlatforms: ["LinkedIn"],
    sensitiveKeywordRules: {
      forceReview: true,
      keywords: ["crypto", "medical"]
    },
    queueLoadRules: {
      skipOptionalStagesAboveDepth: 10,
      optionalStages: [PipelineState.REPURPOSING, PipelineState.ASSET_BRIEFING]
    }
  };

  // --- Case 1: Eco Mode ---
  console.log("Test 1: Cost Mode 'eco' routing...");
  const ctx1 = PolicyService.getExecutionContext({
    workspacePolicy: mockWorkspacePolicy,
    itemMetadata: { cost_mode: "eco" },
    targetState: PipelineState.RESEARCHING,
    queueDepth: 0
  });
  console.log(`   Strategy: ${ctx1.providerStrategy} | Reasons: ${ctx1.reasonCodes.join(", ")}`);
  if (ctx1.providerStrategy === "cheap_first" && ctx1.reasonCodes.includes("cost_mode_eco")) {
    console.log("✅ Passed\n");
  } else {
    throw new Error("Test 1 Failed");
  }

  // --- Case 2: Platform Review Trigger ---
  console.log("Test 2: Platform-based mandatory review (LinkedIn)...");
  const ctx2 = PolicyService.getExecutionContext({
    workspacePolicy: mockWorkspacePolicy,
    itemMetadata: { platform: "LinkedIn" },
    targetState: PipelineState.POSTING,
    queueDepth: 0
  });
  console.log(`   Requires Review: ${ctx2.requiresHumanReview} | Reasons: ${ctx2.reasonCodes.join(", ")}`);
  if (ctx2.requiresHumanReview && ctx2.reasonCodes.includes("platform_requires_review")) {
    console.log("✅ Passed\n");
  } else {
    throw new Error("Test 2 Failed");
  }

  // --- Case 3: Sensitive Keywords ---
  console.log("Test 3: Sensitive keyword match (crypto)...");
  const ctx3 = PolicyService.getExecutionContext({
    workspacePolicy: mockWorkspacePolicy,
    itemMetadata: {},
    targetState: PipelineState.CONTENT_COMPOSITION,
    queueDepth: 0,
    contentPreview: "This is a post about crypto investing."
  });
  console.log(`   Requires Review: ${ctx3.requiresHumanReview} | Reasons: ${ctx3.reasonCodes.join(", ")}`);
  if (ctx3.requiresHumanReview && ctx3.reasonCodes.includes("sensitive_keyword_match")) {
    console.log("✅ Passed\n");
  } else {
    throw new Error("Test 3 Failed");
  }

  // --- Case 4: Queue Depth Skipping ---
  console.log("Test 4: Queue depth skipping (REPURPOSING at depth 15)...");
  const ctx4 = PolicyService.getExecutionContext({
    workspacePolicy: mockWorkspacePolicy,
    itemMetadata: {},
    targetState: PipelineState.REPURPOSING,
    queueDepth: 15
  });
  console.log(`   Skip Stage: ${ctx4.skipOptionalStages} | Reasons: ${ctx4.reasonCodes.join(", ")}`);
  if (ctx4.skipOptionalStages && ctx4.reasonCodes.includes("queue_depth_high")) {
    console.log("✅ Passed\n");
  } else {
    throw new Error("Test 4 Failed");
  }

  // --- Case 5: Non-optional stage NOT skipped even at high depth ---
  console.log("Test 5: Critical stage (RESEARCHING) NOT skipped at high depth...");
  const ctx5 = PolicyService.getExecutionContext({
    workspacePolicy: mockWorkspacePolicy,
    itemMetadata: {},
    targetState: PipelineState.RESEARCHING,
    queueDepth: 15
  });
  console.log(`   Skip Stage: ${ctx5.skipOptionalStages} | Reasons: ${ctx5.reasonCodes.join(", ")}`);
  if (!ctx5.skipOptionalStages) {
    console.log("✅ Passed\n");
  } else {
    throw new Error("Test 5 Failed");
  }

  console.log("🎉 ALL POLICY LOGIC TESTS PASSED!");
}

testPolicy().catch(err => {
  console.error(err);
  process.exit(1);
});
