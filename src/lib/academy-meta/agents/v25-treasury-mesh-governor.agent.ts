import { globalTreasuryMeshService } from '../services/global-treasury-mesh-service';

export class V25TreasuryMeshGovernorAgent {
  async registerNode(ventureId: string, hedgePolicy: string, bufferRatio: number) {
    return globalTreasuryMeshService.registerNode(ventureId, hedgePolicy, bufferRatio);
  }

  async report() {
    return globalTreasury-meshService.meshReport();
  }
}

export const v25TreasuryMeshGovernorAgent = new V25TreasuryMeshGovernorAgent();
