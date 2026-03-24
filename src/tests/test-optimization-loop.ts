import { DBService } from "../lib/services/supabase-service";
import { PolicyService } from "../lib/services/policy-service";
import { OptimizationService } from "../lib/services/optimization-service";
import { PipelineState } from "../lib/types/enums";

async function testOptimization() {
  console.log("🚀 Running Outcome-Driven Optimization Loop Tests (Mocked)...\n");

  const workspaceId = "00000000-0000-0000-0000-000000000001";

  // 1. MOCK environment
  const mockRuns = [
    { agent_name: "CheapAgent", artifacts: [{ artifact_feedback: [{ score: 20 }] }] },
    { agent_name: "CheapAgent", artifacts: [{ artifact_feedback: [{ score: 30 }] }] },
    { agent_name: "CheapAgent", artifacts: [{ artifact_feedback: [{ score: 25 }] }] },
    { agent_name: "CheapAgent", artifacts: [{ artifact_feedback: [{ score: 20 }] }] },
    { agent_name: "CheapAgent", artifacts: [{ artifact_feedback: [{ score: 15 }] }] }
  ];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  (DBService as any).supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () => ({
              limit: async () => ({ data: mockRuns, error: null })
            })
          })
        })
      })
    })
  };

  const mockMemRecord: unknown[] = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  (DBService as any).saveMemoryRecord = async (rec: unknown) => {
    mockMemRecord.push(rec);
    return { data: rec, error: null };
  };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  (DBService as any).getMemoryRecords = async () => ([{ pattern_data: mockMemRecord[mockMemRecord.length-1]?.pattern_data }]);

  try {
    // 2. Trigger Optimization Update (1st time)
    console.log("Test 1: Aggregating performance (5 samples)...");
    const metrics = await OptimizationService.updateTuningMetrics(workspaceId);
    console.log("   Bias Calculated:", metrics?.recommendedBias);
    
    if (metrics?.recommendedBias["CheapAgent"] === "demote") {
      console.log("✅ Passed: Agent correctly demoted after 5 samples.\n");
    } else {
      throw new Error(`Failed: Agent not demoted. Bias: ${JSON.stringify(metrics?.recommendedBias)}`);
    }

    // 3. Test Cooldown
    console.log("Test 2: Verifying cooldown skip...");
    const metrics2 = await OptimizationService.updateTuningMetrics(workspaceId);
    // OptimizationService logs "Cooldown active..." - we check if it returns the same object
    if (metrics2 === metrics) {
      console.log("✅ Passed: Cooldown active, update skipped.\n");
    } else {
      throw new Error("Failed: Cooldown did not trigger");
    }

    // 4. Verify Policy Bias
    console.log("Test 3: Policy Engine response to demotion...");
    const ctx = PolicyService.getExecutionContext({
      workspacePolicy: { providerStrategyDefault: "balanced" },
      itemMetadata: {},
      targetState: PipelineState.CONTENT_COMPOSITION,
      queueDepth: 0,
      tuningMetrics: metrics
    });

    console.log(`   Strategy: ${ctx.providerStrategy} | Reason: ${ctx.reasonCodes.join(", ")}`);
    if (ctx.providerStrategy === "quality_first" && ctx.reasonCodes.includes("performance_demotion_fallback")) {
      console.log("✅ Passed: Policy automatically pivoted to quality strategy.\n");
    } else {
      throw new Error("Failed: Policy did not pivot to quality");
    }

    console.log("🎉 ALL OPTIMIZATION LOOP TESTS PASSED!");

  } catch (err) {
    console.error("\n❌ TESTS FAILED:");
    console.error(err);
    process.exit(1);
  }
}

// Set dummy envs
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://dummy.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "dummy";

testOptimization();
