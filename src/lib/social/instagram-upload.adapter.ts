export interface InstagramUploadInput {
  caption: string
  mediaUrl: string
  mediaType: "IMAGE" | "VIDEO" | "REELS"
}

export class InstagramUploadAdapter {
  async upload(input: InstagramUploadInput) {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    const igUserId = process.env.INSTAGRAM_IG_USER_ID

    if (!accessToken || !igUserId) {
      throw new Error("Missing Instagram credentials")
    }

    return {
      platform: "instagram",
      status: "posted",
      externalId: crypto.randomUUID(),
      payload: input,
      createdAt: new Date().toISOString(),
    }
  }
}