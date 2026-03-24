import { ventureCompetitionService } from '../services/venture-competition-service';

export class V24FranchiseReplicatorAgent {
  async execute(payload: unknown) {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ventureCompetitionService.replicate(payload as any);
  }
}

export const v24FranchiseReplicatorAgent = new V24FranchiseReplicatorAgent();
