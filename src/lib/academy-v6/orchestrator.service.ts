import { randomUUID } from 'crypto';
import { MarketConceptService } from './market-concept.service';
import { ConceptReviewService } from './concept-review.service';
import { ConceptAnalyticsService } from './concept-analytics.service';
import { ConceptTestService } from './concept-test.service';
import { ConceptArchiveService } from './concept-archive.service';
import { InnovationGovernorService } from './innovation-governor.service';

export class AcademyV6OrchestratorService {
  private concept = new MarketConceptService();
  private review = new ConceptReviewService();
  private analytics = new ConceptAnalyticsService();
  private test = new ConceptTestService();
  private governor = new InnovationGovernorService();

  async run(category: string) {
    const concept = await this.concept.generateFromLatest(category);
    const review = await this.review.review(concept);
    const analytics = await this.analytics.analyze(concept);
    const test = await this.test.test(concept, review, analytics);
    const governance = await this.governor.govern(test);
    const archived = ConceptArchiveService.add({
      id: randomUUID(),
      concept,
      review,
      test,
      analytics,
      archiveBucket: test.outcome,
      archivedAt: new Date().toISOString(),
    });
    return {
      ranAt: new Date().toISOString(),
      concept,
      review,
      analytics,
      test,
      governance,
      archived,
    };
  }
}