import { AgentCoordinatorService } from "../lib/services/agent-coordinator-service";
import { DelegationService } from "../lib/services/delegation-service";
import { ConsensusService } from "../lib/services/consensus-service";
import { AgentReputationService } from "../lib/services/agent-reputation-service";
import { SupervisorService } from "../lib/services/supervisor-service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testAgentWorkforce() {
  console.log("🚀 Testing Phase 17: Multi-Agent Workforce Layer...\n");

  const workspaceId = "ws-test-123";

  // 1. Setup Architecture Mocks
  setupSupabaseMock({
    agent_profiles: [
      { id: "a1", name: "Nova Research", role: "researcher", status: "active", workspace_id: workspaceId },
      { id: "a2", name: "Aria Analyst", role: "researcher", status: "active", workspace_id: workspaceId }
    ],
    agent_reputation_metrics: [
      { agent_id: "a1", total_runs: 10, success_rate: 0.9, avg_latency_ms: 3000 }
    ]
  });

  const coordinator = new AgentCoordinatorService();
  const delegation = new DelegationService();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const consensus = new ConsensusService();
  const reputation = new AgentReputationService();
  const supervisor = new SupervisorService();

  // 2. Scenario A: Role-Based Assignment
  console.log("Scenario A: Role-Based Agent Assignment");
  const assigned = await coordinator.assignAgent({
    workspaceId,
    requiredRole: "researcher",
    workflowRunId: "wf-1"
  });
  console.log(`✅ Assigned Agent: ${assigned.name} (Role: ${assigned.role})\n`);

  // 3. Scenario B: Delegation & Subtasks
  console.log("Scenario B: Inter-Agent Delegation (Subtasks)");
  const subtask = await delegation.createSubtask({
    workflowRunId: "wf-1",
    parentNodeRunId: "node-1",
    assignedAgentId: assigned.id,
    taskType: "research.search",
    inputPayload: { query: "market trends" }
  });
  console.log(`✅ Created subtask: ${subtask.id}. Status: ${subtask.status}`);

  const completed = await delegation.completeSubtask(subtask.id, { findings: "Found trends..." });
  console.log(`✅ Subtask completed at ${completed.completed_at}.\n`);

  // 4. Scenario C: Consensus Resolution
  console.log("Scenario C: Multi-Agent Consensus Resolution");
  const outcomes = [
    { agentId: "a1", score: 85, output: "Draft A is superior." },
    { agentId: "a2", score: 87, output: "Draft B has better depth." }
  ];
  const result = ConsensusService.resolve(outcomes);
  console.log(`✅ Consensus Winner: ${result.winner.agentId} (Score: ${result.winner.score})`);
  console.log(`✅ Disagreement Delta: ${result.disagreement}. High Disagreement: ${result.requiresEscalation}\n`);

  // 5. Scenario D: Supervisory Escalation
  console.log("Scenario D: Supervisory Escalation (Disagreement)");
  if (result.requiresEscalation) {
    const escalation = await supervisor.escalateIfNeeded({
      workflowRunId: "wf-1",
      reason: "High consensus disagreement",
      metadata: { outputs: outcomes }
    });
    console.log(`✅ Escalated to human. Task ID: ${escalation.id}\n`);
  }

  // 6. Scenario E: Reputation Tracking
  console.log("Scenario E: Agent Reputation Tracking");
  const updatedRep = await reputation.updateMetrics("a1", {
    success: true,
    latencyMs: 4000,
    reviewScore: 92
  });
  console.log(`✅ Updated Rep for a1: Success Rate: ${updatedRep.success_rate.toFixed(2)}, Avg Latency: ${updatedRep.avg_latency_ms.toFixed(0)}ms\n`);

  console.log("🎉 PHASE 17: AGENT WORKFORCE VERIFIED!");
}

testAgentWorkforce();
