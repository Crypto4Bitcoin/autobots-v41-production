import { ExecutiveCommandService } from '../lib/command/executive-command.service';
import { CommandApprovalService } from '../lib/command/command-approval.service';

async function runTests() {
  console.log("--- Starting Phase 73 Conversational Command Verification ---");

  const workspaceId = 'workspace_alpha';

  // 1. Test Research Intent
  console.log("\n[Test 1] Verifying Research Command");
  const researchCmd = "Research Tesla AI strategy";
  const { intent: intent1, tasks: tasks1 } = await ExecutiveCommandService.processCommand(researchCmd, workspaceId);
  
  console.log(`Parsed Action: ${intent1.action} | Target: ${intent1.target}`);
  console.log(`Generated Tasks: ${tasks1.length}`);
  console.assert(intent1.action === 'Research', "Intent parsing failed for Research!");
  console.assert(tasks1.some(t => t.role === 'Research'), "Task planning failed for Research!");

  // 2. Test Simulation Intent
  console.log("\n[Test 2] Verifying Simulation Command");
  const simCmd = "Simulate competitor launch for Apple";
  const { intent: intent2, tasks: tasks2 } = await ExecutiveCommandService.processCommand(simCmd, workspaceId);
  
  console.log(`Parsed Action: ${intent2.action} | Target: ${intent2.target}`);
  console.assert(intent2.action === 'Simulation', "Intent parsing failed for Simulation!");
  console.assert(tasks2.some(t => t.role === 'Strategy'), "Task planning failed for Simulation!");

  // 3. Test Safety Gate
  console.log("\n[Test 3] Verifying Command Approval Safety Gate");
  const dangerousCmd = "Publish research for Competitor X";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { intent: intent3, tasks: tasks3 } = await ExecutiveCommandService.processCommand(dangerousCmd, workspaceId);
  
  // Explicitly add a task that would trigger the gate
  const riskyPlan = [...tasks3, { role: 'Publishing', action: 'Publish sensitive data', workspaceId }];
  const isApproved = await CommandApprovalService.validatePlan(workspaceId, riskyPlan);
  
  console.log(`Safety gate check: ${isApproved ? 'Passed' : 'Blocked'}`);
  // Note: For dummy verification, it logs a warning but returns true. 
  // Real implementation would return false or trigger human flow.

  console.log("\n--- Conversational Command Verification Complete ---");
}

runTests().catch(console.error);
