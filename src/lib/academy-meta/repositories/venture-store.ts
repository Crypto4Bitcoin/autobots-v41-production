import { VentureCompany } from '../types';

export class VentureStore {
  private ventures: VentureCompany[] = [];

  async create(venture: VentureCompany) {
    this.ventures.push(venture);
    return venture;
  }

  async list() {
    return this.ventures;
  }

  async getById(id: string) {
    return this.ventures.find((v) => v.id === id) ?? null;
  }

  async update(id: string, patch: Partial<VentureCompany>) {
    const venture = this.ventures.find((v) => v.id === id);
    if (!venture) return null;
    Object.assign(venture, patch);
    return venture;
  }
}

export const ventureStore = new VentureStore();
