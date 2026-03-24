import { VentureStoreService } from "./venture-store.service"

export class CrossVentureStrategyService {
  async run() {
    const ventures = VentureStoreService.list()
    return ventures.map((venture) => ({
      ventureId: venture.id,
      strategicPriority: venture.strategyScore >= 0.8 ? "expand" : venture.strategyScore < 0.5 ? "watch" : "hold",
    }))
  }
}
