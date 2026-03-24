import { GlobalCommandInterface } from '../lib/civic/global-command.interface';
import { CivicPlanningAssistant } from '../lib/civic/civic-planning.assistant';
import { PublicInfrastructureIntel } from '../lib/civic/public-infrastructure.intel';
import { SocietalInsightLayer } from '../lib/civic/societal-insight.layer';

async function runTests() {
  console.log("--- Starting Phase 86 Civic Intelligence Verification ---");

  // 1. Test Civic Directive Execution
  console.log("\n[Test 1] Verifying Civic Directive Execution");
  const directive = "Optimize planetary transport efficiency for renewable energy peaks.";
  const result = await GlobalCommandInterface.executeCivicDirective(directive);
  console.log(`Directive Status: ${result.status} | Impact Zone: ${result.impactZone} | Target Sectors: ${result.targetSectors.join(', ')}`);
  console.assert(result.status === 'Acknowledged', "Civic directive failed to acknowledge!");

  // 2. Test Civic Planning Brief
  console.log("\n[Test 2] Verifying Civic Planning Brief");
  const brief = await CivicPlanningAssistant.generatePlanningBrief('Transport');
  console.log(`Recommendation: ${brief.recommendation} | Horizon: ${brief.horizon} | Confidence: ${brief.confidence}`);
  console.assert(brief.confidence > 0.9, "Planning confidence too low!");

  // 3. Test Infra Status
  console.log("\n[Test 3] Verifying Infrastructure Status");
  const status = PublicInfrastructureIntel.getInfraStatus();
  console.log(`Power Stability: ${status.powerGridStability} | Transport Efficiency: ${status.transportEfficiency}`);
  console.assert(status.powerGridStability > 0.9, "Power stability too low for public release!");

  // 4. Test Societal Insight
  console.log("\n[Test 4] Verifying Societal Insight Extraction");
  const insights = await SocietalInsightLayer.extractInsights();
  console.log(`Top Insight: ${insights[0].topic} | Sentiment: ${insights[0].sentiment}`);
  console.assert(insights.length > 0, "No societal insights extracted!");

  console.log("\n--- Civic Intelligence Verification Complete ---");
}

runTests().catch(console.error);
