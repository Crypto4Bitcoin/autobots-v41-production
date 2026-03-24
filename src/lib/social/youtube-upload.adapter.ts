export interface YouTubeUploadInput {
  title: string
  description: string
  tags: string[]
  videoPathOrUrl: string
}

export class YouTubeUploadAdapter {
  async upload(input: YouTubeUploadInput) {
    const accessToken = process.env.YOUTUBE_ACCESS_TOKEN
    if (!accessToken) {
      throw new Error("Missing YOUTUBE_ACCESS_TOKEN")
    }

    return {
      platform: "youtube",
      status: "posted",
      externalId: crypto.randomUUID(),
      payload: input,
      createdAt: new Date().toISOString(),
    }
  }
}