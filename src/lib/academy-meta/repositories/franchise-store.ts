import { FranchiseBranch } from '../types';

export class FranchiseStore {
  private branches: FranchiseBranch[] = [];

  async create(branch: FranchiseBranch) {
    this.branches.push(branch);
    return branch;
  }

 async listByParent(parentVentureId: string) {
    return this.branches.filter((b) => b.parentVentureId === parentVentureId);
  }
}

export const franchiseStore = new FranchiseStore();
