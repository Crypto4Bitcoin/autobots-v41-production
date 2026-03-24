export interface VideoGenerationInput {
  script: string
  title: string
  imagePrompt?: string
  voiceoverText?: string
}

export interface VideoGenerationOutput {
  jobId: string
  status: "queued" | "processing" | "completed"
  videoUrl?: string
  provider: string
  generatedAt: string
}

export class VideoGeneratorAdapter {
  async render(input: VideoGenerationInput): Promise<VideoGenerationOutput> {
    const webhookOrRenderer = process.env.VIDEO_RENDER_WEBHOOK_URL

    if (!webhookOrRenderer) {
      return {
        jobId: crypto.randomUUID(),
        status: "completed",
        videoUrl: "https://example.com/fallback-video.mp4",
        provider: "fallback",
        generatedAt: new Date().toISOString(),
      }
    }

    const res = await fetch(webhookOrRenderer, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VIDEO_RENDER_API_KEY ?? ""}`,
      },
      body: JSON.stringify(input),
    })

    if (!res.ok) {
      throw new Error(`Video render failed with status ${res.status}`)
    }

    const data = await res.json()

    return {
      jobId: data.jobId ?? crypto.randomUUID(),
      status: data.status ?? "queued",
      videoUrl: data.videoUrl,
      provider: "external-renderer",
      generatedAt: new Date().toISOString(),
    }
  }
}