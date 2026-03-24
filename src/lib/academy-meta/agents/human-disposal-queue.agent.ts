import { researchDisposalService } from '../services/research-disposal-service';

export class HumanDisposalQueueAgent {
  async execute(recordId: string, purge: boolean) {
    return researchDisposalService.humanDisposalDecision(recordId, purge);
  }
}

export const humanDisposalQueueAgent = new HumanDisposalQueueAgent();
