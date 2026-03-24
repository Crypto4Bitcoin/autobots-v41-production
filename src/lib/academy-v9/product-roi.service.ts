import { RevenueStoreService } from "./revenue-store.service"

export class ProductRoiService {
  async run() {
    const rows = RevenueStoreService.getRevenue()
    const byProduct = new Map<string, { revenue: number; cost: number }>()

    rows.forEach((row) => {
      const current = byProduct.get(row.productId) ?? { revenue: 0, cost: 0 }
      current.revenue += row.revenue
      current.cost += row.cost
      byProduct.set(row.productId, current)
    })

    return [...byProduct.entries()].map(([productId, values]) => ({
      productId,
      roi: values.cost === 0 ? values.revenue : (values.revenue - values.cost) / values.cost,
      revenue: values.revenue,
      cost: values.cost,
    }))
  }
}
