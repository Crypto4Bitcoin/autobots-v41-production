import { BotFactoryStoreService } from "./bot-factory-store.service"
import { BotPackagerService } from "./bot-packager.service"
import { DeploymentTemplateService } from "./deployment-template.service"
import { PricingTierService } from "./pricing-tier.service"
import { ProductReadinessService } from "./product-readiness.service"
import { SupportStateService } from "./support-state.service"

export class AcademyV8OrchestratorService {
  private packager = new BotPackagerService()
  private template = new DeploymentTemplateService()
  private pricing = new PricingTierService()
  private readiness = new ProductReadinessService()
  private support = new SupportStateService()

  async run(input: { prototypeId: string; title: string; category: string; prototypeScore: number }) {
    const base = await this.packager.package(input)
    const deploymentTemplate = await this.template.buildTemplate({ category: input.category })
    const readinessScore = await this.readiness.score({
      prototypeScore: input.prototypeScore,
      deploymentComplexity: 0.36,
    })
    const pricingTier = await this.pricing.choose({ readinessScore })
    const supportState = await this.support.choose({ readinessScore })

    const product = BotFactoryStoreService.add({
      ...base,
      deploymentTemplate,
      pricingTier,
      readinessScore,
      supportState,
    })

    return {
      ranAt: new Date().toISOString(),
      product,
    }
  }
}
