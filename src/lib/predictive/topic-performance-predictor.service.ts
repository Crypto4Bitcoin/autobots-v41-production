import { MemoryStoreService } from "@/lib/academy/memory-store.service"

export class TopicPerformancePredictorService {
  async scoreCategory(category: string, confidence: number, freshnessHours = 1) {
    const history = MemoryStoreService.getMemory(category).slice(0, 10)
    const historyBoost = Math.min(0.2, history.length * 0.015)
    const freshnessBoost = Math.max(0, 0.2 - freshnessHours * 0.01)
    const base = 0.45

    return Math.max(0, Math.min(1, base + historyBoost + freshnessBoost + confidence * 0.2))
  }

  async scoreTopic(title: string, summary: string) {
    const lengthFactor = Math.min(0.2, title.length / 200)
    const urgencyBoost = /now|latest|today|breaking|surge|moves|rally|drop/i.test(`${title} ${summary}`) ? 0.18 : 0.05
    const clarityBoost = summary.length > 120 ? 0.12 : 0.06

    return Math.max(0, Math.min(1, 0.4 + lengthFactor + urgencyBoost + clarityBoost))
  }
}
