export interface MarketBotConcept {
  id: string;
  sourceMemoryId: string;
  category: string;
  title: string;
  problem: string;
  solution: string;
  targetUser: string;
  monetizationModel: string;
  noveltyReason: string;
  createdAt: string;
}

export interface ConceptReview {
  id: string;
  conceptId: string;
  decision: 'good' | 'bad';
  reason: string;
  reviewedAt: string;
}

export interface ConceptTestResult {
  id: string;
  conceptId: string;
  viabilityScore: number;
  feasibilityScore: number;
  marketDemandScore: number;
  monetizationScore: number;
  finalScore: number;
  outcome: 'good_working' | 'bad_not_working';
  testedAt: string;
}

export interface ConceptAnalytics {
  id: string;
  conceptId: string;
  category: string;
  demandSignal: number;
  noveltySignal: number;
  buildComplexity: number;
  competitionRisk: number;
  expectedROI: number;
  createdAt: string;
}

export interface ArchivedConceptRecord {
  id: string;
  concept: MarketBotConcept;
  review: ConceptReview;
  test: ConceptTestResult;
  analytics: ConceptAnalytics;
  archiveBucket: 'good_working' | 'bad_not_working';
  archivedAt: string;
}
export const ConceptAnalytics = {} as any;

export const MarketBotConcept = {} as any;

export const ArchivedConceptRecord = {} as any;

export const ConceptReview = {} as any;

export const ConceptTestResult = {} as any;
