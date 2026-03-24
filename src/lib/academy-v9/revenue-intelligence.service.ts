import { randomUUID } from "crypto"
import { RevenueRecord } from "./types"
import { RevenueStoreService } from "./revenue-store.service"

export class RevenueIntelligenceService {
  async ingest(input: Omit<RevenueRecord, "id" | "createdAt">) {
    const record: RevenueRecord = {
      id: randomUUID(),
      productId: input.productId,
      schoolId: input.schoolId,
      revenue: input.revenue,
      cost: input.cost,
      period: input.period,
      createdAt: new Date().toISOString(),
    }

    return RevenueStoreService.addRevenue(record)
  }
}
