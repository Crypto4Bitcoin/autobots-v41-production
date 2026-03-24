import { AgentLifecycleService } from '../lib/workforce/agent-lifecycle.service';
import { TaskDelegationService } from '../lib/workforce/task-delegation.service';
import { AgentMemoryStore } from '../lib/workforce/agent-memory.store';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MemoryAuditService } from '../lib/workforce/memory-audit.service';

async function runTests() {
  console.log("--- Starting Phase 71 Memory Verification ---");

  // 1. Boot Workforce
  await AgentLifecycleService.bootWorkforce();

  // 2. Test Workspace Isolation (Test 1)
  console.log("\n[Test 1] Verifying Workspace Isolation");
  const wsA = 'workspace_alpha';
  const wsB = 'workspace_beta';
  
  await AgentMemoryStore.store({
      workspaceId: wsA,
      agentId: 'agent_res_001',
      class: 'Workspace',
      fact: 'Secret data for Alpha only.',
      metadata: {}
  }, 'Operational');

  const retrievedA = await AgentMemoryStore.retrieve(wsA, 'Secret', 'agent_ana_001');
  console.log(`Retrieved from Alpha: ${retrievedA.length} fragments.`);
  console.assert(retrievedA.length === 1, "Alpha memory retrieval failed!");

  const retrievedB = await AgentMemoryStore.retrieve(wsB, 'Secret', 'agent_ana_001');
  console.log(`Retrieved from Beta (should be 0): ${retrievedB.length} fragments.`);
  console.assert(retrievedB.length === 0, "Beta breached Alpha memory isolation!");

  // 3. Test Knowledge Extraction (Test 2)
  console.log("\n[Test 2] Verifying Knowledge Extraction on Completion");
  const task = await TaskDelegationService.createTask('plan_123', 'Research', { target: 'Competitor Z', workspaceId: wsA });
  console.log(`Task created. Status: ${task.status}. Handing over for completion...`);
  
  // Simulate task completion with result
  await TaskDelegationService.updateTaskStatus(task.id, 'Completed', { marketShare: '25%' });
  
  const extracted = await AgentMemoryStore.retrieve(wsA, 'Competitor Z', 'agent_ana_001');
  console.log(`Extracted memory fragments found for Competitor Z: ${extracted.length}`);
  console.assert(extracted.length > 0, "Knowledge extraction failed to store fact!");

  // 4. Test Context Injection (Test 3)
  console.log("\n[Test 3] Verifying Context Injection into New Task");
  const nextTask = await TaskDelegationService.createTask('plan_456', 'Analysis', { objective: 'Analyze Competitor Z', workspaceId: wsA });
  console.log(`New task payload memoryContext length: ${nextTask.payload.memoryContext ? nextTask.payload.memoryContext.length : 0}`);
  console.assert(nextTask.payload.memoryContext && nextTask.payload.memoryContext.length > 0, "Context injection failed!");

  console.log("\n--- Memory Verification Complete ---");
}

runTests().catch(console.error);

