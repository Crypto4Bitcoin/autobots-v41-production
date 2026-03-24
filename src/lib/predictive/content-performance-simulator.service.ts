export interface ContentSimulationInput {
  category: string
  title: string
  description: string
  hashtags: string[]
  script?: string
}

export class ContentPerformanceSimulatorService {
  async simulate(input: ContentSimulationInput) {
    const hookBoost = /why|how|now|big|truth|what|warning|move/i.test(input.title) ? 0.16 : 0.06
    const hashtagBoost = Math.min(0.15, input.hashtags.length * 0.025)
    const descriptionBoost = input.description.length > 80 ? 0.12 : 0.05
    const scriptBoost = input.script && input.script.length > 120 ? 0.13 : 0.04

    const contentScore = Math.max(0, Math.min(1, 0.42 + hookBoost + hashtagBoost + descriptionBoost + scriptBoost))

    const youtube = Math.max(0, Math.min(1, contentScore + 0.08))
    const instagram = Math.max(0, Math.min(1, contentScore + 0.03))
    const tiktok = Math.max(0, Math.min(1, contentScore + 0.06))

    return {
      contentScore,
      platformFit: {
        youtube,
        instagram,
        tiktok,
      },
    }
  }
}
