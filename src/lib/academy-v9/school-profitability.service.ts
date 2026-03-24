import { RevenueStoreService } from "./revenue-store.service"

export class SchoolProfitabilityService {
  async run() {
    const rows = RevenueStoreService.getRevenue()
    const bySchool = new Map<string, { revenue: number; cost: number }>()

    rows.forEach((row) => {
      const current = bySchool.get(row.schoolId) ?? { revenue: 0, cost: 0 }
      current.revenue += row.revenue
      current.cost += row.cost
      bySchool.set(row.schoolId, current)
    })

    return [...bySchool.entries()].map(([schoolId, values]) => ({
      schoolId,
      profit: values.revenue - values.cost,
      margin: values.revenue === 0 ? 0 : (values.revenue - values.cost) / values.revenue,
      revenue: values.revenue,
      cost: values.cost,
    }))
  }
}
