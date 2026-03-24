import { researchDisposalService } from '../services/research-disposal-service';

export class PrincipalVerifierAgent {
  async execute(recordId: string, approved: boolean) {
    return researchDisposalService.principalVerify(recordId, approved);
  }
}

export const principalVerifierAgent = new PrincipalVerifierAgent();
