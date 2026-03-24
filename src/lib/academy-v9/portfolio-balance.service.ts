import { RevenueStoreService } from "./revenue-store.service"

export class PortfolioBalanceService {
  async run() {
    const allocations = RevenueStoreService.getAllocations()
    const concentration =
      allocations.length === 0 ? 0 : Math.max(...allocations.map((x) => x.allocationScore))

    return {
      diversificationScore: Number((1 - concentration * 0.4).toFixed(3)),
      concentrationRisk: Number(concentration.toFixed(3)),
    }
  }
}
