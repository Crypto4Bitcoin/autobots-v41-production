
import { randomUUID } from "crypto"
import { PartnerSchoolApplication } from "./types"

export class PartnerSchoolOnboardingService {
  private static applications: PartnerSchoolApplication[] = []

  async apply(input: Omit<PartnerSchoolApplication, "id" | "createdAt">) {
    const record: PartnerSchoolApplication = {
      id: randomUUID(),
      name: input.name,
      region: input.region,
      niche: input.niche,
      operator: input.operator,
      requestedTier: input.requestedTier,
      createdAt: new Date().toISOString(),
    }

    PartnerSchoolOnboardingService.applications.unshift(record)
    return record
  }

  async list() {
    return [...PartnerSchoolOnboardingService.applications]
  }
}
