// eslint-disable-next-line @typescript-eslint/no-require-imports
﻿const { AutonomousBudgetGuard } = require('../lib/services/autonomous-budget-guard');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { EventDeduplicationService } = require('../lib/services/event-deduplication.service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { EventCorrelationService } = require('../lib/services/event-correlation.service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { EventExpirationService } = require('../lib/services/event-expiration.service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DecisionRuleEngine } = require('../lib/services/decision-rule-engine');

async function runTests() {
  console.log("--- Starting Phase 69 Autonomous Verification ---");

  // 1. Budget Guard Test
  console.log("\n[Test 1] Verifying AutonomousBudgetGuard (Throttling)");
  const workspaceId = 'ws_prod_001';
  let decisionsProceeded = 0;
  for (let i = 0; i < 25; i++) {
    if (AutonomousBudgetGuard.canProceed(workspaceId, 'decisions')) {
      decisionsProceeded++;
    }
  }
  console.log(`Decisions allowed: ${decisionsProceeded} / 20 budget limit.`);
  console.assert(decisionsProceeded === 20, "Budget Guard failed! Allowed too many decisions.");

  // 2. Event Deduplication Test
  console.log("\n[Test 2] Verifying EventDeduplicationService");
  const signalId = 'sig_market_spike_405';
  const firstTrigger = EventDeduplicationService.isDuplicate(signalId);
  const secondTrigger = EventDeduplicationService.isDuplicate(signalId);
  console.log(`First trigger duplicate? ${firstTrigger}`);
  console.log(`Second trigger duplicate? ${secondTrigger}`);
  console.assert(!firstTrigger && secondTrigger, "Deduplication Service failed!");

  // 3. TTL Expiration Test
  console.log("\n[Test 3] Verifying EventExpirationService (TTL)");
  const thirtyOneMinsAgo = Date.now() - (31 * 60 * 1000);
  const isExpired = await EventExpirationService.checkExpiration('market_volatility', thirtyOneMinsAgo);
  console.log(`Volatile event created 31m ago - is expired? ${isExpired}`);
  console.assert(isExpired === true, "Expiration Service failed for Volatility TTL!");

  // 4. Severity & Priority Test
  console.log("\n[Test 4] Verifying DecisionRuleEngine Logic");
  const mockEvent = { type: 'market_volatility', confidence: 0.85, payload: { impact: 'high' } };
  const outcome = await DecisionRuleEngine.evaluate(mockEvent);
  console.log(`Decision Severity: ${outcome.severity}, Priority: ${outcome.priority}`);
  console.log(`Approval Mandatory: ${outcome.approvalMandatory}, Confidence: ${outcome.confidence}`);
  console.assert(outcome.severity === 'High' && outcome.priority === 'High', "Severity/Priority logic mismatch!");

  console.log("\n--- Verification Complete ---");
}

runTests().catch(console.error);
