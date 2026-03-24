import { CenturyScaleSimulator } from '../lib/sim/century-scale-simulator';
import { GeopoliticalRiskAnalyzer } from '../lib/sim/geopolitical-risk-analyzer';
import { EnvironmentalStabilityModeler } from '../lib/sim/environmental-stability-modeler';
import { StabilityBaseline } from '../lib/sim/stability-baseline';

async function runTests() {
  console.log("--- Starting Phase 94 Stability Verification ---");

  // 1. Test Stability Baseline
  console.log("\n[Test 1] Verifying Stability Baseline");
  const baseline = StabilityBaseline.getBaseline();
  console.log(`Economic Index: ${baseline.economicIndex} | Resilience: ${baseline.environmentalResilience} | Risk: ${baseline.geopoliticalRisk}`);
  console.assert(baseline.economicIndex > 0.8, "Stability baseline too low!");

  // 2. Test Century Scale Simulation
  console.log("\n[Test 2] Verifying Century Scale Simulation");
  const sim = await CenturyScaleSimulator.runSimulation({ mode: 'Baseline' });
  console.log(`Wealth Multiplier: ${sim.year100_Wealth} | Future Stability: ${sim.year100_Stability}`);
  console.assert(sim.year100_Stability > 0.9, "Future stability projection failed!");

  // 3. Test Geopolitical Risk Analysis
  console.log("\n[Test 3] Verifying Geopolitical Risk Analysis");
  const risk = await GeopoliticalRiskAnalyzer.analyzeRisks();
  console.log(`Risk Score: ${risk.riskScore} | Primary Threat: ${risk.primaryThreat} | Mitigation: ${risk.mitigationActive}`);
  console.assert(risk.riskScore < 0.2, "Geopolitical risk too high in simulation!");

  // 4. Test Environmental Modeler
  console.log("\n[Test 4] Verifying Environmental Stability Modeler");
  const env = await EnvironmentalStabilityModeler.projectImpact('Planetary_Reforestation');
  console.log(`Sequester Rate: ${env.carbonSequesterRate} | Biodiversity: ${env.biodiversityDelta}`);
  console.assert(env.tempStability > 0.9, "Environmental stability projection failed!");

  console.log("\n--- Stability Verification Complete ---");
}

runTests().catch(console.error);
