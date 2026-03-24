import { mediaAssetFactoryService } from '../services/media-asset-factory-service';

export class V22MediaForgeAgent {
  async execute(input: { ventureId: string; productId?: string; sourceContentId?: string; title: string }) {
    return mediaAssetFactoryService.generateFactorySet(input);
  }
}

export const v22MediaForgeAgent = new V22MediaForgeAgent();
