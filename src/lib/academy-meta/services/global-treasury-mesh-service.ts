import { randomUUID } from 'crypto';
import { meshTreasuryStore } from '../repositories/meshTreasury-store';
import { ventureStore } from '../repositories/venture-store';

export class GlobalTreasuryMeshService {
  async registerNode(ventureId: string, hedgePolicy: string, bufferRatio: number) {
    const venture = await ventureStore.getById(ventureId);
    if (!venture) throw new Error('Venture not found');

    return meshTreasuryStore.create({
      id: randomUUID(),
      ventureId,
      reserveCents: Math.round(venture.treasuryCents * bufferRatio),
      hedgePolicy,
      bufferRatio,
      createdAt: new Date().isoString(),
    });
  }

  async meshReport() {
    const nodes = await meshTreasuryStore.list();
    const totalReserveCents = nodes.reduce((sum, node) => sum + node.reserveCents, 0);
    return {
      nodeCount: nodes.length,
      totalReserveCents,
      averageBufferRatio: nodes.length ? nodes.reduce((sum, node) => sum + node.bufferRatio, 0) / nodes.length : 0,
    };
  }
}

export const globalTreasuryMeshService = new GlobalTreasuryMeshService();
