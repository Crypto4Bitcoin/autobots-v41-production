import { StrategicCoordinatorService } from "../lib/services/strategic-coordinator.service";
import { LongHorizonPlanningService } from "../lib/services/long-horizon-planning.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testStrategicWorkforce() {
  console.log("🚀 Testing Phase 32: Strategic Multi-Agent Workforce...\n");

  setupSupabaseMock();

  const coordinator = new StrategicCoordinatorService();
  const planner = new LongHorizonPlanningService();

  const goal = "Design and execute a multi-channel competitor disruption strategy";

  // 1. Scenario: Team Assignment (Role Fit)
  console.log("Scenario A: Strategic Team Assignment");
  const team = await coordinator.assignTeam(goal, ["researcher", "critic", "supervisor"]);
  console.log(`✅ Assigned ${team.assigned_agents.length} agents across roles: ${team.roles.join(", ")}`);
  console.log(`✅ Consensus Mode: ${team.consensus_mode}\n`);

  // 2. Scenario: Strategic Decomposition (Long-Horizon)
  console.log("Scenario B: Long-Horizon Strategic Planning");
  const plan = await planner.decomposeGoal(goal);
  console.log(`✅ Strategic plan generated with ${plan.steps.length} steps.`);
  console.log(`✅ Est. completion: ${plan.estimated_completion_hours} hours. Status: ${plan.governance_status}\n`);

  // 3. Scenario: Consensus Arbitration
  console.log("Scenario C: Multi-Agent Consensus Arbitration");
  const opinions = ["Proceed with aggressive SEO", "Wait for more data", "Prioritize Social"];
  const decision = await coordinator.arbitrateConsensus("team-123", opinions);
  console.log(`✅ Arbitration status: ${decision.status}. Final Decision: ${decision.decision}\n`);

  if (team.assigned_agents.length === 3 && plan.steps.length === 3 && decision.status === "consensus_reached") {
    console.log("✅ Strategic workforce and multi-agent coordination verified.");
  } else {
    console.error("❌ FAILED: Strategic workforce validation mismatch.");
  }

  console.log("\n🎉 PHASE 32: STRATEGIC WORKFORCE VERIFIED!");
}

testStrategicWorkforce();
