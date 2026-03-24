import { garbageMemoryService } from '../services/garbage-memory-service';
import { ResearchKnowledge } from '../types';

export class GarbageMemoryAgent {
  async execute(input: {
    knowledge: ResearchKnowledge;
    teacherReviewScore: number;
    linkedToProduct: boolean;
    reason: string;
  }) {
    return garbageMemoryService.stageResearchForDisposal(input);
  }
}

export const garbageMemoryAgent = new GarbageMemoryAgent();
