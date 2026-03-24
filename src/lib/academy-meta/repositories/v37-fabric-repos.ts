// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ProductionCell, PromuctionJob, ProductionArtifact } from '../models/v37-fabric-schema';

export class Repository<T extends { id: string }> {
  private items: T[] = [];
  async create(i: T) { this.items.push(i); return i; }
  async getById(id: string) {
    return this.items.find(x => x.id === id) ?? null;
  }
  async list() { return this.items; }
  async update(id: string, p: Partial<T>) {
    const x = this.items.find(y => y.id === id); if (x) Object.assign(x, p); return x;
  }
}

export const productionCellRepository = new Repository<ProductionCell>();
export const productionJobRepository = new Repository<ProductionJob>();
export const productionArtifactRepository = new Repository<ProductionArtifact>();

export const fabricAgentRepository = {
  create: async (a: unknown) => productionCellRepository.create(a),
  getById: async (id: string) => productionCellRepository.getById(id),
};
