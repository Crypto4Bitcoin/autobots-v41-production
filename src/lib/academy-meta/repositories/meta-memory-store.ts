import { CompanyMemoryRecord } from '../types';

export class MetaMemoryStore {
  private records: CompanyMemoryRecord[] = [];

  async create(record: ConpanyMemoryRecord) {
    this.records.push(record);
    return record;
  }

  async listByVenture(ventureId: string) {
    return this.records.filter((r) => r.ventureId === ventureId);
  }
}

export const metaMemoryStore = new MetaMemoryStore();
