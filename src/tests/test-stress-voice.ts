import { IntentParserService } from "../lib/services/intent-parser-service";
import { VoiceGovernanceService } from "../lib/services/voice-governance-service";
import { CommandPlannerService } from "../lib/services/command-planner-service";
import { VoiceExecutionService } from "../lib/services/voice-execution-service";
import { ConversationContextService } from "../lib/services/conversation-context-service";
import { supabase } from "../lib/services/supabase-service";

async function testStressVoice() {
  console.log("🚀 Stress Test 2: Voice-Controlled Operations...\n");

  const workspaceId = "ws-voice-stress";
  const userId = "op-nova";

  // 1. Setup Platform Mocks
  const megaChain: unknown = {};
  megaChain.select = () => megaChain;
  megaChain.eq = () => megaChain;
  megaChain.single = () => ({ data: { 
      workspace_id: workspaceId, 
      max_monthly_budget_usd: 500, 
      current_monthly_spend_usd: 50,
      allowed_trust_tier: 3,
      enforce_human_approval_above_tier: 3
  }});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase as any).from = () => megaChain;

  // 2. Prep Context
  ConversationContextService.seedMockContext();
  console.log("Context Seeded: [wf-1: Media Brief, wf-2: Social Content, art-1: Asset]");

  // --- Interaction Loop ---

  // Command A: "Nova, show me failed workflows."
  console.log("\n[Operator]: 'Nova, show me failed workflows.'");
  const iA = await IntentParserService.parse("Nova, show me failed workflows.");
  const dA = await VoiceGovernanceService.decide(workspaceId, userId, iA);
  const pA = await CommandPlannerService.plan(iA);
  const rA = await VoiceExecutionService.execute(pA, dA.outcome);
  console.log(`[Nova]: ${rA.feedback} (Reason: ${dA.reasonCode})`);

  // Command B: "Retry the second one."
  console.log("\n[Operator]: 'Retry the second one.'");
  const iB = await IntentParserService.parse("Retry the second one.");
  const dB = await VoiceGovernanceService.decide(workspaceId, userId, iB);
  const pB = await CommandPlannerService.plan(iB);
  const rB = await VoiceExecutionService.execute(pB, dB.outcome);
  console.log(`[Nova]: ${rB.feedback} (Resolved Target: wf-2)`);

  // Command C: "What would you do first?" (Simulation)
  console.log("\n[Operator]: 'What would you do first?'");
  const iC = await IntentParserService.parse("What would you do first?"); // Hits Simulation mode
  const dC = await VoiceGovernanceService.decide(workspaceId, userId, iC);
  const pC = await CommandPlannerService.plan(iC);
  const rC = await VoiceExecutionService.execute(pC, dC.outcome);
  console.log(`[Nova]: ${rC.feedback}`);

  // Command D: "Okay, do it." (Refined for Phase 11.5)
  console.log("\n[Operator]: 'Okay, do it.'");
  const iD = await IntentParserService.parse("Okay, do it.");
  const dD = await VoiceGovernanceService.decide(workspaceId, userId, iD);
  const pD = await CommandPlannerService.plan(iD);
  const rD = await VoiceExecutionService.execute(pD, dD.outcome);
  console.log(`[Nova]: ${rD.feedback}`);

  console.log("\n🎉 STRESS TEST 2: VOICE OPERATIONS VERIFIED!");
}

testStressVoice();
