import { randomUUID } from "crypto"
import { PrototypeArchiveService } from "./prototype-archive.service"
import { PrototypePlannerService } from "./prototype-planner.service"
import { FeasibilityEstimatorService } from "./feasibility-estimator.service"
import { MarketValidationService } from "./market-validation.service"
import { PrototypeSandboxService } from "./prototype-sandbox.service"
import { PrototypeScoringService } from "./prototype-scoring.service"
import { IncubationGovernorService } from "./incubation-governor.service"

export class AcademyV7OrchestratorService {
  private planner = new PrototypePlannerService()
  private estimator = new FeasibilityEstimatorService()
  private validator = new MarketValidationService()
  private sandbox = new PrototypeSandboxService()
  private scorer = new PrototypeScoringService()
  private governor = new IncubationGovernorService()

  async run(input: { conceptId: string; category: string; title: string }) {
    const plan = await this.planner.plan(input)
    const feasibility = await this.estimator.estimate(plan)
    const validation = await this.validator.validate(input)
    const sandbox = await this.sandbox.test(plan)
    const score = await this.scorer.score({ conceptId: input.conceptId, feasibility, validation, sandbox })
    const governed = await this.governor.govern(score)

    const archived = PrototypeArchiveService.add({
      id: randomUUID(),
      conceptId: input.conceptId,
      title: input.title,
      category: input.category,
      plan,
      feasibility,
      validation,
      sandbox,
      score,
      governedAction: governed.action,
      archivedAt: new Date().toISOString(),
    })

    return { ranAt: new Date().toISOString(), plan, feasibility, validation, sandbox, score, governed, archived }
  }
}
