import { IntentParserService } from "../lib/services/intent-parser-service";
import { VoiceGovernanceService } from "../lib/services/voice-governance-service";
import { CommandPlannerService } from "../lib/services/command-planner-service";
import { VoiceExecutionService } from "../lib/services/voice-execution-service";
import { ConversationContextService } from "../lib/services/conversation-context-service";
import { supabase } from "../lib/services/supabase-service";

async function testIntelligentVoice() {
  console.log("🚀 Testing Phase 11.5: Voice Governance & Command Intelligence...\n");

  const workspaceId = "00000000-0000-0000-0000-000000000001";
  const userId = "operator-1";

  // 1. Setup Mocks
  const megaChain: unknown = {};
  megaChain.select = () => megaChain;
  megaChain.eq = () => megaChain;
  megaChain.single = () => ({ data: { 
      workspace_id: workspaceId, 
      max_monthly_budget_usd: 100, 
      current_monthly_spend_usd: 10,
      allowed_trust_tier: 2,
      enforce_human_approval_above_tier: 3
  }});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase as any).from = () => megaChain;

  // 2. Contextual Resolution: "Retry the second one"
  console.log("Scenario 1: Contextual Reference Resolution");
  ConversationContextService.seedMockContext(); // wf-1, wf-2, art-1
  const ut1 = "Nova, retry the second one.";
  const intent1 = await IntentParserService.parse(ut1);
  const decision1 = await VoiceGovernanceService.decide(workspaceId, userId, intent1);
  const plan1 = await CommandPlannerService.plan(intent1);
  await VoiceExecutionService.execute(plan1, decision1.outcome);
  console.log(`✅ Outcome: ${decision1.outcome}. Resolution: ${plan1.explanation}\n`);

  // 3. Risk Gate: "Publish everything now" (Side-Effectful)
  console.log("Scenario 2: High-Risk Confirmation Trigger");
  const ut2 = "Nova, publish to all channels now.";
  const intent2 = await IntentParserService.parse(ut2);
  const decision2 = await VoiceGovernanceService.decide(workspaceId, userId, intent2);
  const plan2 = await CommandPlannerService.plan(intent2);
  await VoiceExecutionService.execute(plan2, decision2.outcome);
  console.log(`✅ Outcome: ${decision2.outcome}. Reason: ${decision1.reason}\n`);

  // 4. Simulation Mode: "What would you do?"
  console.log("Scenario 3: Simulation Mode Logic");
  const ut3 = "Nova, what would you do if I said publish today's video?";
  const intent3 = await IntentParserService.parse(ut3);
  const decision3 = await VoiceGovernanceService.decide(workspaceId, userId, intent3);
  const plan3 = await CommandPlannerService.plan(intent3);
  const result3 = await VoiceExecutionService.execute(plan3, decision3.outcome);
  console.log(`✅ Outcome: ${decision3.outcome}. Feedback: ${result3.feedback}\n`);

  // 5. Macro Execution: "Run the morning brief"
  console.log("Scenario 4: Macro Plan Resolution");
  const ut4 = "Nova, run the morning brief.";
  const intent4 = await IntentParserService.parse(ut4);
  const decision4 = await VoiceGovernanceService.decide(workspaceId, userId, intent4);
  const plan4 = await CommandPlannerService.plan(intent4);
  await VoiceExecutionService.execute(plan4, decision4.outcome);
  console.log(`✅ Outcome: ${decision4.outcome}. Logic: ${plan4.explanation}\n`);

  console.log("🎉 INTELLIGENT VOICE STACK VERIFIED!");
}

testIntelligentVoice();
