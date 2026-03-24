import { VentureCellService } from "./venture-cell.service"
import { MultiProductOpsService } from "./multi-product-ops.service"
import { CrossVentureStrategyService } from "./cross-venture-strategy.service"

export class AcademyV10OrchestratorService {
  private ventureCell = new VentureCellService()
  private ops = new MultiProductOpsService()
  private strategy = new CrossVentureStrategyService()

  async run() {
    const venture = await this.ventureCell.create({
      name: "Omega Venture Alpha",
      products: ["prod-v8-demo", "prod-v8-demo-2"],
      strategyScore: 0.81,
    })

    const ops = await this.ops.operate({
      productCount: venture.products.length,
      strategyScore: venture.strategyScore,
    })

    const strategy = await this.strategy.run()

    return {
      ranAt: new Date().toISOString(),
      venture,
      ops,
      strategy,
    }
  }
}
