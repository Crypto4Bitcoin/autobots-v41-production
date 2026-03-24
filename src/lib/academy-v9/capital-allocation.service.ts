import { randomUUID } from "crypto"
import { RevenueStoreService } from "./revenue-store.service"
import { AllocationRecord } from "./types"

export class CapitalAllocationService {
  async run() {
    const rows = RevenueStoreService.getRevenue()
    const byTarget = new Map<string, { revenue: number; cost: number }>()

    rows.forEach((row) => {
      const current = byTarget.get(row.schoolId) ?? { revenue: 0, cost: 0 }
      current.revenue += row.revenue
      current.cost += row.cost
      byTarget.set(row.schoolId, current)
    })

    const allocations: AllocationRecord[] = [...byTarget.entries()].map(([target, values]) => {
      const score = values.revenue === 0 ? 0 : Math.max(0, Math.min(1, (values.revenue - values.cost) / values.revenue))
      return {
        id: randomUUID(),
        target,
        allocationScore: score,
        recommendation: score >= 0.6 ? "increase" : score < 0.3 ? "decrease" : "hold",
        createdAt: new Date().toISOString(),
      }
    })

    RevenueStoreService.replaceAllocations(allocations)
    return allocations
  }
}
