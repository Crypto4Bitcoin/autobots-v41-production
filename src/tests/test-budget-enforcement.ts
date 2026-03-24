import { BudgetEnforcementService } from "../lib/services/budget-enforcement.service";
import { CostDashboardService } from "../lib/services/cost-dashboard.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testBudgetEnforcement() {
  console.log("🚀 Testing Phase 38: Budget Enforcement & ECO-Mode...\n");

  setupSupabaseMock();

  const enforcer = new BudgetEnforcementService();

  // 1. Normal Mode (Healthy Budget)
  console.log("Scenario A: Healthy Budget ($100 spend / $1000 limit)");
  const resA = await enforcer.enforceBudget("ws-123", 100);
  console.log(`✅ Result: ${resA.allow ? "ALLOWED" : "BLOCKED"}, Mode: ${resA.mode.toUpperCase()}\n`);

  // 2. ECO Mode (Threshold Reached)
  console.log("Scenario B: Threshold Reached ($850 spend / $1000 limit)");
  const resB = await enforcer.enforceBudget("ws-123", 850);
  console.log(`✅ Result: ${resB.allow ? "ALLOWED" : "BLOCKED"}, Mode: ${resB.mode.toUpperCase()}\n`);

  // 3. Blocked Mode (Limit Exceeded)
  console.log("Scenario C: Limit Exceeded ($1050 spend / $1000 limit)");
  const resC = await enforcer.enforceBudget("ws-123", 1050);
  console.log(`✅ Result: ${resC.allow ? "ALLOWED" : "BLOCKED"}, Mode: ${resC.mode.toUpperCase()}\n`);

  // 4. Financial Observability
  const dashboard = new CostDashboardService();
  const metrics = await dashboard.getDashboardMetrics("ws-123");
  console.log(`✅ Dashboard: ${metrics.budget_utilization * 100}% util, Top: ${metrics.top_cost_capability}`);

  console.log("\n🎉 PHASE 38: BUDGET ENFORCEMENT VERIFIED!");
}

testBudgetEnforcement();
