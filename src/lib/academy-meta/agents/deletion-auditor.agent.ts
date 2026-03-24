import { researchDisposalService } from '../services/research-disposal-service';

export class DeletionAuditorAgent {
  async execute(recordId: string) {
    return researchDisposalService.teacherPanelCheck(recordId);
  }
}

export const deletionAuditorAgent = new DeletionAuditorAgent();
