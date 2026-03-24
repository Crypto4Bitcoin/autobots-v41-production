import { FederatedLearningService } from '../lib/intelligence/federated-learning.service';
import { KnowledgePrivacyGuard } from '../lib/intelligence/knowledge-privacy-guard';
import { SharedThreatIntelligence } from '../lib/intelligence/shared-threat-intelligence';
import { GlobalKnowledgeGraph } from '../lib/intelligence/global-knowledge-graph';

async function runTests() {
  console.log("--- Starting Phase 83 Collective Intelligence Verification ---");

  const workspaceId = 'workspace_psi';

  // 1. Test Federated Gradient Sync
  console.log("\n[Test 1] Verifying Federated Gradient Sync");
  const syncResult = await FederatedLearningService.syncGradients(workspaceId, 'LLM_Specialization_Alpha');
  console.log(`Sync Status: ${syncResult.status} | Improvement Delta: ${syncResult.improvementDelta}`);
  console.assert(syncResult.status === 'Synched', "Federated sync failed!");

  // 2. Test Privacy Guard
  console.log("\n[Test 2] Verifying Knowledge Privacy Guard");
  const isSafe = KnowledgePrivacyGuard.validateSafety({ secret_key: 'REDACTED', public_pattern: 'Load_Balanced' });
  console.log(`Privacy Validation: ${isSafe ? 'PASSED' : 'FAILED'}`);
  console.assert(isSafe === true, "Privacy guard failed!");

  // 3. Test Threat Intelligence Broadcast
  console.log("\n[Test 3] Verifying Shared Threat Intelligence");
  const broadcast = await SharedThreatIntelligence.publishThreat('Zero_Day_Inference_Attack', 'Prompt_Injection_v4');
  console.log(`Threat Broadcast Reach: ${broadcast.reach} | Active Nodes: ${broadcast.activeNodes}`);
  console.assert(broadcast.activeNodes > 0, "No nodes received threat intel!");

  // 4. Test Knowledge Graph Query
  console.log("\n[Test 4] Verifying Global Knowledge Graph Query");
  const matches = await GlobalKnowledgeGraph.queryPattern('Optimal_Supply_Chain_Resiliency');
  console.log(`Found Patterns: ${matches.matches.join(', ')}`);
  console.assert(matches.matches.length > 0, "No patterns found in global graph!");

  console.log("\n--- Collective Intelligence Verification Complete ---");
}

runTests().catch(console.error);
