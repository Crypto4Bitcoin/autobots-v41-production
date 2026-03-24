import { AgentLifecycleService } from '../lib/workforce/agent-lifecycle.service';
import { AgentRegistry } from '../lib/workforce/agent.registry';
import { TaskDelegationService } from '../lib/workforce/task-delegation.service';
import { AgentCoordinationService } from '../lib/workforce/agent-coordination.service';
import { AgentAuditService } from '../lib/workforce/agent-audit.service';

async function runTests() {
  console.log("--- Starting Phase 70 Workforce Verification ---");

  // 1. Workforce Intelligence Boot
  console.log("\n[Test 1] Verifying Workforce Bootup");
  await AgentLifecycleService.bootWorkforce();
  const agents = AgentRegistry.getAllAgents();
  console.log(`Total agents registered: ${agents.length}`);
  console.assert(agents.length === 6, "Workforce bootup failed! Missing agents.");

  // 2. Task Delegation & Lifecycle
  console.log("\n[Test 2] Verifying Task Delegation & Lifecycle");
  const planId = 'plan_beta_001';
  const task = await TaskDelegationService.createTask(planId, 'Research', { target: 'Competitor X' });
  console.log(`Task created with ID: ${task.id}, Initial Status: ${task.status}`);
  console.assert(task.status === 'Queued', "Task lifecycle start failed!");

  // 3. Agent Coordination (Assignment)
  console.log("\n[Test 3] Verifying Agent Coordination (Assignment)");
  await AgentCoordinationService.assignTask(task.id);
  const updatedTask = TaskDelegationService.getTask(task.id);
  console.log(`Task ${task.id} assigned to agent: ${updatedTask ? updatedTask.assignedAgentId : 'unknown'}, Status: ${updatedTask ? updatedTask.status : 'unknown'}`);
  // We expect assigned or running
  const statusOk = updatedTask && (updatedTask.status === 'Running' || updatedTask.status === 'Assigned');
  console.assert(statusOk, "Coordination assignment failed!");

  // 4. Audit Traceability
  console.log("\n[Test 4] Verifying Audit Traceability");
  AgentAuditService.log({
    eventId: 'evt_742',
    taskId: task.id,
    agentId: (updatedTask && updatedTask.assignedAgentId) || 'unknown',
    action: 'GATHER_EVIDENCE',
    context: { url: 'https://competitor-x.com' }
  });
  const trail = AgentAuditService.getTrail('evt_742');
  console.log(`Audit records found for event evt_742: ${trail.length}`);
  console.assert(trail.length === 1, "Audit logging failed!");

  console.log("\n--- Workforce Verification Complete ---");
}

runTests().catch(console.error);

