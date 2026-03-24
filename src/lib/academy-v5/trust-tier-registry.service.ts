
import { randomUUID } from "crypto"
import { TrustLinkRecord } from "./types"

export class TrustTierRegistryService {
  private static links: TrustLinkRecord[] = []

  async negotiate(input: Omit<TrustLinkRecord, "id" | "updatedAt" | "status">) {
    const record: TrustLinkRecord = {
      id: randomUUID(),
      sourceSchoolId: input.sourceSchoolId,
      targetSchoolId: input.targetSchoolId,
      tier: input.tier,
      scopes: input.scopes,
      status: "active",
      updatedAt: new Date().toISOString(),
    }

    TrustTierRegistryService.links.unshift(record)
    return record
  }

  async list() {
    return [...TrustTierRegistryService.links]
  }
}
