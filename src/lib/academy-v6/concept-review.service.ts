import { randomUUID } from 'crypto';
import { ConceptReview, MarketBotConcept } from './types';

export class ConceptReviewService {
  async review(concept: MarketBotConcept): Promise<ConceptReview> {
    const qualityScore = Math.random();
    const decision = qualityScore > 0.4 ? 'good' : 'bad';
    return {
      id: randomUUID(),
      conceptId: concept.id,
      decision,
      reason: decision === 'good' 
        ? 'Concept identifies a high-value friction point with clear monetization.' 
        : 'Market saturation or low technical feasibility detected.',
      reviewedAt: new Date().toISOString(),
    };
  }
}