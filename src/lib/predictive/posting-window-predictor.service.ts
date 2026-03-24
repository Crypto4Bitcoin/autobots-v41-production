export class PostingWindowPredictorService {
  async predict(category: string, platform: "youtube" | "instagram" | "tiktok") {
    const now = new Date()
    const hour = now.getHours()

    const preferredHour =
      platform === "youtube" ? 18 :
      platform === "instagram" ? 13 :
      20

    const offsetHours = hour <= preferredHour ? preferredHour - hour : 24 - hour + preferredHour
    const scheduled = new Date(now.getTime() + offsetHours * 60 * 60 * 1000)

    return {
      iso: scheduled.toISOString(),
      score: 0.82,
      label: `${platform}:${category}:preferred_window`,
    }
  }
}
