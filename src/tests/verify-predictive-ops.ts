import { ForecastingEngine } from '../lib/predictive/forecasting.engine';
import { ScenarioModelingService } from '../lib/predictive/scenario-modeling.service';
import { MacroTrendDetector } from '../lib/predictive/macro-trend-detector';
import { EarlyWarningService } from '../lib/predictive/early-warning.service';

async function runTests() {
  console.log("--- Starting Phase 80 Predictive Intelligence Verification ---");

  const workspaceId = 'workspace_phi';

  // 1. Test Forecasting
  console.log("\n[Test 1] Verifying Probabilistic Forecasting");
  const forecast = await ForecastingEngine.generateForecast(workspaceId, 'Active_User_Growth');
  console.log(`Forecast Target: ${forecast.target} | Prob: ${forecast.probability} | Horizon: ${forecast.timeHorizon}`);
  console.assert(forecast.probability > 0.8, "Forecast probability should be high!");

  // 2. Test Scenario Modeling
  console.log("\n[Test 2] Verifying Cross-Org Scenario Modeling");
  const scenario = await ScenarioModelingService.modelCrossOrgScenario('Supply_Chain_Interference', ['org_a', 'org_b']);
  console.log(`Scenario: ${scenario.scenario} | Status: ${scenario.status} | Mitigation: ${scenario.mitigationPath}`);
  console.assert(scenario.status === 'Stabilized', "Scenario should be stabilized!");

  // 3. Test Macro Trend Detection
  console.log("\n[Test 3] Verifying Macro Trend Detection");
  const trends = MacroTrendDetector.detectTrends();
  console.log(`Detected Trends: ${trends.join(', ')}`);
  console.assert(trends.length > 0, "Should have detected macro trends!");

  // 4. Test Early Warning
  console.log("\n[Test 4] Verifying Early Warning Signal");
  await EarlyWarningService.issueSignal('Market_Drift', 'Detected potential Q3 volatility peak.');

  console.log("\n--- Predictive Intelligence Verification Complete ---");
}

runTests().catch(console.error);
