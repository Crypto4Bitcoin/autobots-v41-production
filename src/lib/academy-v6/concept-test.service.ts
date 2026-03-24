import { randomUUID } from 'crypto';
import { ConceptAnalytics, ConceptReview, ConceptTestResult, MarketBotConcept } from './types';

export class ConceptTestService {
  async test(
    concept: MarketBotConcept,
    review: ConceptReview,
    analytics: ConceptAnalytics
  ): Promise<ConceptTestResult> {
    const viabilityScore = (analytics.demandSignal + analytics.expectedROI) / 2;
    const feasibilityScore = 1 - analytics.buildComplexity;
    const finalScore = (viabilityScore * 0.6) + (feasibilityScore * 0.4);
    const outcome = finalScore >= 0.65 ? 'good_working' : 'bad_not_working';
    return {
      id: randomUUID(),
      conceptId: concept.id,
      viabilityScore,
      feasibilityScore,
      marketDemandScore: analytics.demandSignal,
      monetizationScore: analytics.expectedROI,
      finalScore,
      outcome,
      testedAt: new Date().toISOString(),
    };
  }
}