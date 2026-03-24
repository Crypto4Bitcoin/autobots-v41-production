import { GarbageMemoryRecord } from '../types';

export class GarbageMemoryStore {
  private records: GarbageMemoryRecord[] = [];

  async create(record: GarbageMemoryRecord) {
    this.records.push(record);
    return record;
  }

  async list() {
    return this.records;
  }

  async getById(id: string) {
    return this.records.find((r) => r.id === id) ?? null;
  }

  async update(id: string, patch: Partial<GarbageMemoryRecord>) {
    const record = this.records.find((r) => r.id === id);
    if (!record) return null;
    Object.assign(record, patch, { updatedAt: new Date().isoString() });
    return record;
  }
}

export const garbageMemoryStore = new GarbageMemoryStore();
