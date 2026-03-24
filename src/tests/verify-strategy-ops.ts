import { ScenarioPlanningService } from '../lib/strategy/scenario-planning.service';
import { SimulationEngine } from '../lib/strategy/simulation.engine';
import { StrategyRecommendationService } from '../lib/strategy/strategy-recommendation.service';
import { OutcomePredictionService } from '../lib/strategy/outcome-prediction.service';
import { RiskForecastService } from '../lib/strategy/risk-forecast.service';
import { ScenarioRegistry } from '../lib/strategy/scenario.registry';

async function runTests() {
  console.log("--- Starting Phase 72 Strategic Simulation Verification ---");

  const workspaceId = 'workspace_alpha';
  const eventId = 'evt_competitor_launch_001';

  // 1. Scenario Generation
  console.log("\n[Step 1] Generating Strategic Scenarios...");
  const scenarios = await ScenarioPlanningService.buildScenarios(eventId);
  console.log(`Generated ${scenarios.length} scenarios.`);

  // 2. Simulation & Forecasting
  console.log("\n[Step 2] Simulating Scenarios & Forecasting Outcomes...");
  const results = [];
  for (const scen of scenarios) {
    const simResult = await SimulationEngine.simulate(scen);
    const prediction = await OutcomePredictionService.predict(scen, workspaceId);
    const risk = await RiskForecastService.forecastRisk(scen);
    
    simResult.riskScore = risk;
    
    console.log(`- Scenario: ${scen.name}`);
    console.log(`  Prediction: ${prediction}`);
    console.log(`  Risk Score: ${risk.toFixed(2)}`);
    
    results.push(simResult);
    
    await ScenarioRegistry.saveRecord(workspaceId, {
        scenario: scen,
        result: simResult,
        timestamp: Date.now(),
        selected: false
    });
  }

  // 3. Strategy Recommendation
  console.log("\n[Step 3] Ranking Strategies...");
  const recommendation = StrategyRecommendationService.recommend(results);
  
  if (recommendation) {
    const bestScen = scenarios.find(s => s.id === recommendation.scenarioId);
    console.log(`Winner: ${bestScen?.name}`);
    console.log(`Confidence: ${recommendation.confidenceScore.toFixed(2)} | Risk: ${recommendation.riskScore.toFixed(2)}`);
  }

  console.log("\n--- Strategic Simulation Verification Complete ---");
}

runTests().catch(console.error);
