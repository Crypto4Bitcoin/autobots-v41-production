export class MeshTreasuryStore {
  private nodes: unknown[] = [];
  async create(node: unknown) { this.nodes.push(node); return node; }
  async list() { return this.nodes; }
  async getByVenture(ventureId: string) { return this.nodes.find(n => n.ventureId === ventureId); }
}
export const meshTreasuryStore = new MeshTreasuryStore();
