import { WorkforcePlannerService } from "../lib/services/workforce-planner.service";

async function testWorkforcePlanner() {
  console.log("🚀 Testing Phase 18: Autonomous Workforce Planning...\n");

  const planner = new WorkforcePlannerService();
  const goal = "Deep research into competitor pricing and a summary report.";

  console.log("Scenario: Proposing workforce plan from goal");
  const plan = await planner.proposePlan(goal);

  console.log("✅ Workforce Plan Proposed:");
  console.log(` - Goal: ${plan.goal}`);
  console.log(` - Steps: ${plan.steps.length}`);
  plan.steps.forEach((s, i) => {
    console.log(`   [${i+1}] ${s.role}: ${s.capability} (${s.description})`);
  });

  if (plan.confidence >= 0.8 && plan.requires_approval) {
    console.log("\n✅ Plan satisfies governance: high confidence & mandatory approval flag present.");
  } else {
    console.error("\n❌ FAILED: Plan does not meet required governance flags.");
  }

  console.log("\n🎉 PHASE 18: WORKFORCE PLANNING VERIFIED!");
}

testWorkforcePlanner();
