// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RevenueIntelligenceService } from "./revenue-intelligence.service"
import { ProductRoiService } from "./product-roi.service"
import { SchoolProfitabilityService } from "./school-profitability.service"
import { CapitalAllocationService } from "./capital-allocation.service"
import { PortfolioBalanceService } from "./portfolio-balance.service"

export class AcademyV9OrchestratorService {
  private roi = new ProductRoiService()
  private profitability = new SchoolProfitabilityService()
  private allocation = new CapitalAllocationService()
  private portfolio = new PortfolioBalanceService()

  async run() {
    const roi = await this.roi.run()
    const profitability = await this.profitability.run()
    const allocations = await this.allocation.run()
    const portfolio = await this.portfolio.run()

    return {
      ranAt: new Date().toISOString(),
      roi,
      profitability,
      allocations,
      portfolio,
    }
  }
}
