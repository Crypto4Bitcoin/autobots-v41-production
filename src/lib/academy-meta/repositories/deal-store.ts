import { DealRecord } from '../types';

export class DealStore {
  private deals: DealRecord[] = [];

  async create(deal: DealRecord) {
    this.deals.push(deal);
    return deal;
  }

  async listByVenture(ventureId: string) {
    return this.deals.filter((d) => d.ventureId === ventureId);
  }
}

export const dealStore = new DealStore();
