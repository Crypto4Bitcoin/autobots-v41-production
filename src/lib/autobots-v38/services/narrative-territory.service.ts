
import { randomUUID } from 'crypto';
import {
  territoryRepository,
  territoryInfluenceRepository,
  territoryConflictRepository,
} from '../repositories';
import { NarrativeTerritory, TerritoryMetrics } from '../types';

export class NarrativeTerritoryService {
  async createTerritory(input: {
    title: string;
    skillTrack: string;
    narrativeTheme: string;
    cellIds: string[];
  }) {
    const t: NarrativeTerritory = {
      id: randomUUID(),
      title: input.title,
      skillTrack: input.skillTrack,
      narrativeTheme: input.narrativeTheme,
      state: 'forming',
      cellIds: input.cellIds,
      influenceScore: 0,
      marketReachScore: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return territoryRepository.create(t);
  }

  async recordInfluence(input: {
    territoryId: string;
    cellId: string;
    artifactId: string;
    platform: string;
    engagementScore: number;
  }) {
    const event = await territoryInfluenceRepository.create({
      id: randomUUID(),
      territoryId: input.territoryId,
      sourceCellId: input.cellId,
      artifactId: input.artifactId,
      platform: input.platform,
      engagementScore: input.engagementScore,
      createdAt: new Date().toISOString(),
    });

    const territory = await territoryRepository.getById(input.territoryId);
    if (!territory) return event;

    const nextInfluence = territory.influenceScore + input.engagementScore;

    let state = territory.state;
    if (nextInfluence > 500) state = 'dominant';
    else if (nextInfluence > 200) state = 'active';

    await territoryRepository.update(territory.id, {
      influenceScore: nextInfluence,
      state,
    });

    return event;
  }

  async createConflict(a: string, b: string, reason: string) {
    return territoryConflictRepository.create({
      id: randomUUID(),
      territoryA: a,
      territoryB: b,
      reason,
      createdAt: new Date().toISOString(),
    });
  }

  async metrics(): Promise<TerritoryMetrics> {
    const list = await territoryRepository.list();

    let top: NarrativeTerritory | undefined;

    for (const t of list) {
      if (!top || t.influenceScore > top.influenceScore) top = t;
    }

    return {
      totalTerritories: list.length,
      dominantTerritories: list.filter((t) => t.state === 'dominant').length,
      contestedTerritories: list.filter((t) => t.state === 'contested').length,
      topTerritory: top?.title,
    };
  }
}

export const narrativeTerritoryService = new NarrativeTerritoryService();
