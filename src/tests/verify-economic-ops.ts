import { AutonomousCompanyManager } from '../lib/economy/autonomous-company.manager';
import { MachineInvestmentPortfolio } from '../lib/economy/machine-investment.portfolio';
import { LaborCoordinationService } from '../lib/economy/labor-coordination.service';

async function runTests() {
  console.log("--- Starting Phase 87 Autonomous Economy Verification ---");

  const orgId = 'org_alpha';

  // 1. Test Autonomous Company Provisioning
  console.log("\n[Test 1] Verifying Company Provisioning");
  const company = await AutonomousCompanyManager.provisionCompany(orgId, 'Compute_Arbitrage');
  console.log(`Company ID: ${company.companyId} | Status: ${company.status} | Initial Budget: $${company.budget}`);
  console.assert(company.companyId.startsWith('corp_'), "Company ID should be correctly generated!");

  // 2. Test Machine Investment Optimization
  console.log("\n[Test 2] Verifying Machine Investment Optimization");
  const portfolio = await MachineInvestmentPortfolio.optimizeAssets(orgId);
  console.log(`Portfolio Yield: ${portfolio.portfolioYield} | Primary Asset: ${portfolio.primaryAsset}`);
  console.assert(portfolio.portfolioYield.includes('+'), "Portfolio yield should be positive!");

  // 3. Test Labor Coordination
  console.log("\n[Test 3] Verifying Global Labor Coordination");
  const labor = await LaborCoordinationService.allocateGlobalLabor('Distributed_Audit', 1000);
  console.log(`Nodes Assigned: ${labor.nodesAssigned} | ETA: ${labor.eta}`);
  console.assert(labor.nodesAssigned > 0, "No labor nodes assigned!");

  console.log("\n--- Autonomous Economy Verification Complete ---");
}

runTests().catch(console.error);
