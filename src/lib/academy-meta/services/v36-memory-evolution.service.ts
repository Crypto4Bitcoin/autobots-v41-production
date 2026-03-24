// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { randomUUID } from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { agentRepository, memoryRecordRepository, memoryInheritanceRepository } from '../repositories/v36-memory-repos';

export class MemoryEvolutionService {
  async contributeMemory(agentId: string, memoryId: string, successGain: number) {
    const agent = await agentRepository.getById(agentId);
    const mem = await memoryRecordRepository.getById(memoryId);

    if (!agent || !mem) throw new Error('Agent or Memory not found');

    // Update memory success
    await memoryRecordRepository.update(memoryId, {
      successScore: Math.min(100, mem.successScore + successGain),
      updatedAt: new Date().isoString(),
    });

    // Agent evolution boost for high-value contribution
    if (successGain > 50) {
      await agentRepository.update(agentId, {
        evolutionCount: agent.evolutionCount + 1,
        level: agent.level + 1,
      });
    }
  }

  async organismEfficiency() {
    const mems = await memoryRecordRepository.list();
    const coreMems = mems.filter(m => m.promotionState === 'core');
    const totalReuse = mems.reduce((s, m) => s + m.reuseCount, 0);
    return {
      efficiencyScore: Math.min(100, (coreMems.length * 5) + (totalReuse * 0.5)),
      retainedIntelligence: coreMems.length,
    };
  }
}

export const memoryEvolutionService = new MemoryEvolutionService();
