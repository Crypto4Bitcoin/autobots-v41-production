import { NegotiationProtocol } from '../lib/negotiation/negotiation-protocol';
import { ContractDraftingService } from '../lib/negotiation/contract-drafting.service';
import { MarketArbitrationEngine } from '../lib/negotiation/market-arbitration.engine';

async function runTests() {
  console.log("--- Starting Phase 81 Autonomous Negotiation Verification ---");

  const orgA = 'org_alpha';
  const orgB = 'org_beta';

  // 1. Test Offer Proposal
  console.log("\n[Test 1] Verifying Offer Proposal");
  const offer = { id: 'off_001', resourceType: 'Compute_Credits', quantity: 1000, pricePerUnit: 0.05, terms: 'Net-30' };
  const proposal = await NegotiationProtocol.proposeOffer(orgA, orgB, offer);
  console.log(`Proposal Group: ${proposal.conversationId} | Status: ${proposal.status}`);
  console.assert(proposal.status === 'Under_Review', "Proposal status should be Under_Review!");

  // 2. Test Counter-Offer
  console.log("\n[Test 2] Verifying Counter-Offer");
  const counter = await NegotiationProtocol.counterOffer(proposal.conversationId, 0.04);
  console.log(`Counter-Offer Status: ${counter.status} | Next Step: ${counter.nextStep}`);
  console.assert(counter.status === 'Negotiating', "Counter-offer should keep negotiation active!");

  // 3. Test Contract Drafting
  console.log("\n[Test 3] Verifying Contract Drafting");
  const agreementId = await ContractDraftingService.draftAgreement(orgA, orgB, offer);
  console.log(`Agreement ID: ${agreementId}`);
  console.assert(agreementId.startsWith('agmt_'), "Agreement ID should be correctly generated!");

  // 4. Test Market Arbitration
  console.log("\n[Test 4] Verifying Market Arbitration");
  const price = MarketArbitrationEngine.analyzeMarketEquilibrium('Compute_Credits');
  console.log(`Market Equilibrium Price: $${price}`);
  console.assert(price === 42.50, "Market price should match baseline!");

  const resolution = await MarketArbitrationEngine.resolveDispute([orgA, orgB], 'Regional_Bandwidth_Priority');
  console.log(`Dispute Winner: ${resolution.winner} | Compensation: ${resolution.compensation}`);

  console.log("\n--- Autonomous Negotiation Verification Complete ---");
}

runTests().catch(console.error);
