import type { Scenario } from './scenario-planning.service';

export class RiskForecastService {
  /**
   * Estimates operational and governance risk for each candidate plan.
   */
  static async forecastRisk(scenario: Scenario): Promise<number> {
    console.log(`[RiskForecast] Evaluating risk for: ${scenario.name}`);
    
    let risk = 0.1;
    const externalKeywords = ['publish', 'post', 'send', 'notify'];
    scenario.steps.forEach(step => {
        if (externalKeywords.some(kw => step.toLowerCase().includes(kw))) {
            risk += 0.2;
        }
    });

    return Math.min(1.0, risk);
  }
}
