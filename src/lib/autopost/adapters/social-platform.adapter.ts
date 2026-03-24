export type Platform = "youtube" | "reels" | "tiktok";
export interface UploadResult { success: boolean; externalId: string; url: string; }
export class SocialPlatformBridge {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  async upload(platform: Platform, data: unknown): Promise<UploadResult> {
    console.log("[Social] Uploading to " + platform + "...");
    return { success: true, externalId: "ext_" + platform + "_" + Date.now(), url: "https://" + platform + ".com/v/12345" };
  }
}