export interface TikTokUploadInput {
  title: string
  videoUrl: string
  privacyLevel?: string
}

export class TikTokUploadAdapter {
  async upload(input: TikTokUploadInput) {
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN
    if (!accessToken) {
      throw new Error("Missing TIKTOK_ACCESS_TOKEN")
    }

    return {
      platform: "tiktok",
      status: "posted",
      externalId: crypto.randomUUID(),
      payload: input,
      createdAt: new Date().toISOString(),
    }
  }
}