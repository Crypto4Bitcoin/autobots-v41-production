import { randomUUID } from "crypto"
import { CommonsStoreService } from "./commons-store.service"

export class InnovationCommonsService {
  async share(input: { source: string; target: string; assetType: string; title: string }) {
    return CommonsStoreService.addShare({
      id: randomUUID(),
      source: input.source,
      target: input.target,
      assetType: input.assetType,
      title: input.title,
      createdAt: new Date().toISOString(),
    })
  }
}
