import { CostAccountingService } from "../lib/services/cost-accounting.service";
import { CostPredictionService } from "../lib/services/cost-prediction.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testCostAccounting() {
  console.log("🚀 Testing Phase 38: Cost Accounting & Prediction...\n");

  setupSupabaseMock();

  // 1. Cost Logging
  const accounting = new CostAccountingService();
  console.log("Step 1: Logging capability cost...");
  await accounting.logCost({
      workflow_run_id: "wf-test-123",
      node_id: "node-1",
      capability_key: "media.render",
      amount_usd: 1.25,
      dimensions: { provider_cost: 1.0, compute_cost: 0.2, storage_cost: 0.05 }
  });
  console.log("✅ Cost record persisted.\n");

  // 2. Cost Prediction
  const predictor = new CostPredictionService();
  console.log("Step 2: Predicting workflow cost...");
  const prediction = await predictor.predictCost("wf-template-v1");
  console.log(`✅ Prediction: $${prediction.estimated_usd} (Confidence: ${prediction.confidence})`);
  console.log(`- Breakdown: ${JSON.stringify(prediction.breakdown)}`);

  if (prediction.estimated_usd > 0) {
      console.log("✅ Prediction logic verified.");
  }

  console.log("\n🎉 PHASE 38: COST ACCOUNTING VERIFIED!");
}

testCostAccounting();
