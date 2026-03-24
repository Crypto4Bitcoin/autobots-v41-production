import { CivilizationStrategyOptimizer } from '../lib/strategy/civilization-strategy-optimizer';
import { MacroHistoricalSimulator } from '../lib/strategy/macro-historical-simulator';
import { MultiOrgAlignmentEngine } from '../lib/strategy/multi-org-alignment-engine';
import { StrategyBaseline } from '../lib/strategy/strategy-baseline';

async function runTests() {
  console.log("--- Starting Phase 98 Strategy Verification ---");

  // 1. Test Strategy Baseline
  console.log("\n[Test 1] Verifying Strategy Baseline");
  const baseline = StrategyBaseline.getBaseline();
  console.log(`Primary Goal: ${baseline.primaryGoal} | Horizon: ${baseline.horizon}`);
  console.assert(baseline.horizon === '1000_Years', "Strategy horizon incorrect!");

  // 2. Test Strategy Optimization
  console.log("\n[Test 2] Verifying Civilization Strategy Optimizer");
  const optimization = await CivilizationStrategyOptimizer.optimizeStrategy();
  console.log(`Optimized Path: ${optimization.optimizedPath} | Stability: ${optimization.systemicStability}`);
  console.assert(optimization.systemicStability > 0.9, "Strategy optimization failed!");

  // 3. Test Macro History Simulation
  console.log("\n[Test 3] Verifying Macro Historical Simulator");
  const history = await MacroHistoricalSimulator.simulateHistoricalImpact('Abundance_Omega');
  console.log(`Civilizational Tier: ${history.civilizationalTier} | Legacy Score: ${history.legacyScore}`);
  console.assert(history.legacyScore > 0.9, "Historical simulation failed!");

  // 4. Test Multi-Org Alignment
  console.log("\n[Test 4] Verifying Multi-Org Alignment Engine");
  const alignment = await MultiOrgAlignmentEngine.alignOrganizations();
  console.log(`Aligned Orgs: ${alignment.alignedCount} | Sync Reliability: ${alignment.syncReliability}`);
  console.assert(alignment.alignedCount > 1000, "Multi-org alignment failed!");

  console.log("\n--- Strategy Verification Complete ---");
}

runTests().catch(console.error);
