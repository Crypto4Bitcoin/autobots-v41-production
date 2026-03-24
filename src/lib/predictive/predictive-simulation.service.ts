import { PredictionScores } from "@/lib/academy/types"
import { TopicPerformancePredictorService } from "./topic-performance-predictor.service"
import { ContentPerformanceSimulatorService } from "./content-performance-simulator.service"
import { PostingWindowPredictorService } from "./posting-window-predictor.service"
import { ProductionPriorityScorerService } from "./production-priority-scorer.service"

export class PredictiveSimulationService {
  private topicPredictor = new TopicPerformancePredictorService()
  private contentSimulator = new ContentPerformanceSimulatorService()
  private windowPredictor = new PostingWindowPredictorService()
  private priorityScorer = new ProductionPriorityScorerService()

  async simulateResearch(input: {
    category: string
    title: string
    summary: string
    confidence: number
  }): Promise<Partial<PredictionScores>> {
    const categoryScore = await this.topicPredictor.scoreCategory(input.category, input.confidence, 1)
    const topicScore = await this.topicPredictor.scoreTopic(input.title, input.summary)

    return {
      categoryScore,
      topicScore,
    }
  }

  async simulateContent(input: {
    category: string
    title: string
    description: string
    hashtags: string[]
    script?: string
    confidence: number
  }): Promise<PredictionScores> {
    const categoryScore = await this.topicPredictor.scoreCategory(input.category, input.confidence, 1)
    const topicScore = await this.topicPredictor.scoreTopic(input.title, input.description)
    const content = await this.contentSimulator.simulate({
      category: input.category,
      title: input.title,
      description: input.description,
      hashtags: input.hashtags,
      script: input.script,
    })

    const preferredPlatform =
      content.platformFit.youtube >= content.platformFit.instagram &&
      content.platformFit.youtube >= content.platformFit.tiktok
        ? "youtube"
        : content.platformFit.instagram >= content.platformFit.tiktok
        ? "instagram"
        : "tiktok"

    const recommendedWindow = await this.windowPredictor.predict(input.category, preferredPlatform)
    const productionPriority = await this.priorityScorer.score({
      categoryScore,
      topicScore,
      contentScore: content.contentScore,
      platformFit: Math.max(
        content.platformFit.youtube,
        content.platformFit.instagram,
        content.platformFit.tiktok
      ),
      confidence: input.confidence,
    })

    return {
      categoryScore,
      topicScore,
      contentScore: content.contentScore,
      platformFit: content.platformFit,
      recommendedWindow,
      productionPriority,
    }
  }
}
