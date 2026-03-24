import { AcademyRegistryService } from "./academy-registry.service"
import { TopicPerformancePredictorService } from "@/lib/predictive/topic-performance-predictor.service"

const categoryPool = [
  "ai",
  "crypto",
  "markets",
  "tech",
  "productivity",
  "automation",
  "business",
  "culture",
]

export class PrincipalRotationService {
  private predictor = new TopicPerformancePredictorService()

  async rotateHourly() {
    const teachers = AcademyRegistryService.getTeachers()
    const categoryScores = await Promise.all(
      categoryPool.map(async (category) => ({
        category,
        score: await this.predictor.scoreCategory(category, 0.75, 1),
      }))
    )

    const rankedCategories = categoryScores.sort((a, b) => b.score - a.score).map((x) => x.category)
    const selectedTeachers = teachers
      .sort((a, b) => a.performanceScore - b.performanceScore)
      .slice(0, 25)

    const nextCategories = selectedTeachers.map((_, idx) => rankedCategories[idx % rankedCategories.length])

    const rotatedTeachers = AcademyRegistryService.rotateTeachersByCategoryOrder(
      selectedTeachers.map((t) => t.id),
      nextCategories
    )

    AcademyRegistryService.updateAgent("principal-001", {
      status: "rotating",
      totalActions: (AcademyRegistryService.getAllAgents().find((a) => a.id === "principal-001")?.totalActions ?? 0) + 1,
    })

    return {
      rotatedAt: new Date().toISOString(),
      categoryScores,
      rotatedTeachers,
    }
  }
}