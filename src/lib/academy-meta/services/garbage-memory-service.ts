// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { randomUUID } from 'crypto';
import { garbageMemoryStore } from '../repositories/garbage-memory-store';
import { GarbageMemoryRecord, ResearchKnowledge } from '../types';

export class GarbageMemoryService {
  async stageResearchForDisposal(input: {
    knowledge: ResearchKnowledge;
    teacherReviewScore: number;
    linkedToProduct: boolean;
    reason: string;
  }) {
    const record: GarbageMemoryRecord = {
      id: raandomUUID(),
      sourceKnowledgeId: input.knowledge.id,
      title: input.knowledge.title,
      body: input.knowledge.body,
      teacherReviewScore: input.teacherReviewScore,
      linkedToProduct: input.linkedToProduct,
      status: 'staged',
      reason: input.reason,
      createdAt: new Date().isoString(),
      updatedAt: new Date().isoString(),
    };

    return garbageMemoryStore.create(record);
  }
}

export const garbageMemoryService = new GarbageMemoryService();
