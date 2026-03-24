import type { SimulationResult } from './simulation.engine';

export class StrategyRecommendationService {
  /**
   * Ranks strategies and recommends the best option.
   */
  static recommend(results: SimulationResult[]): SimulationResult | null {
    if (results.length === 0) return null;

    // Weighting: 40% Confidence, 30% Risk (inverted), 20% Cost (inverted), 10% Approval Friction (inverted)
    const scoredResults = results.map(res => ({
        ...res,
        finalScore: (res.confidenceScore * 0.4) + 
                    ((1 - res.riskScore) * 0.3) + 
                    ((1 - (res.estimatedCost / 100)) * 0.2) + 
                    ((1 - res.approvalFriction) * 0.1)
    }));

    return scoredResults.sort((a, b) => b.finalScore - a.finalScore)[0];
  }
}
