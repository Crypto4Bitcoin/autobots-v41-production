import { randomUUID } from 'crypto';
import { franchiseStore } from '../repositories/franchise-store';
import { ventureStore } from '../repositories/venture-store';

export class FranchiseReplicationService {
  async cloneVenture(input: { parentVentureId: string; locale: string; niche: string; name: string }) {
    const parent = await ventureStore.getById(input.parentVentureId);
    if (!parent) throw new Error('Parent venture not found');

    return franchiseStore.create({
      id: randomUUID(),
      parentVentureId: parent.id,
      name: input.name,
      niche: input.niche,
      locale: input.locale,
      treasuryCents: Math.round(parent.treasuryCents * 0.15),
      workerIds: [],
      memoryVaultId: randomUUID(),
      createdAt: new Date().isoString(),
    });
  }
}

export const franchiseReplicationService = new FranchiseReplicationService();
