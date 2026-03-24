import { ventureStore } from '../repositories/venture-store';

export class InterventureGovernanceService {
  async auditCompetition() {
    const ventures = await ventureStore.list();
    const totalProducts = ventures.reduce((sum, venture) => sum + venture.productIds.length, 0);
    return ventures.map((venture) => ({
      ventureId: venture.id, ventureName: venture.name,
      concentrationRatio: totalProducts === 0 ? 0 : venture.productIds.length / totalProducts,
      compliant: totalProducts === 0 ? true : venture.productIds.length / totalProducts < 0.6,
    }));
  }
}
export const interventureGovernanceService = new InterventureGovernanceService();
