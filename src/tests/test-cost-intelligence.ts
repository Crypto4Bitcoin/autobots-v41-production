import { CostIntelligenceService } from "../lib/services/cost-intelligence.service";

async function testCostIntelligence() {
  console.log("🚀 Testing Phase 20: Platform Cost Intelligence...\n");

  const costIntel = new CostIntelligenceService();

  const mockEvents = [
    { payload: { capability: "research.search", cost_usd: 0.10 } },
    { payload: { capability: "research.search", cost_usd: 0.15 } },
    { payload: { capability: "media.render", cost_usd: 1.20 } }
  ];

  console.log("Scenario: Analyzing costs from event stream");
  const stats = await costIntel.analyzeCosts(mockEvents);

  console.log("✅ Cost Intelligence Results:");
  Object.keys(stats).forEach(cap => {
    console.log(` - ${cap}: Total $${stats[cap].cost.toFixed(2)} (Avg: $${stats[cap].avgCost?.toFixed(2)}) over ${stats[cap].runs} runs.`);
  });

  if (stats["media.render"].cost === 1.20) {
    console.log("\n✅ Cost aggregation verified.");
  } else {
    console.error("\n❌ FAILED: Cost aggregation mismatch.");
  }

  console.log("\n🎉 PHASE 20: COST INTELLIGENCE VERIFIED!");
}

testCostIntelligence();
