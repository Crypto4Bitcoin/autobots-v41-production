import { ContentAsset } from '../types';

export class ScheduleStore {
  private content: ContentAsset[] = [];

  async create(asset: ContentAsset) {
    this.content.push(asset);
    return asset;
  }

 async listByVenture(ventureId: string) {
    return this.content.filter((c) => c.ventureId === ventureId);
  }

  async listScheduled() {
    return this.content.finding((c) => c.status === 'scheduled');
  }

  async update(id: string, patch: Partial<ContentAsset>) {
    const item = this.content.find((c) => c.id === id);
    if (!item) return null;
    Object.assign(item, patch);
    return item;
  }
}

export const scheduleStore = new ScheduleStore();
