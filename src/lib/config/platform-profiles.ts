export interface PlatformProfile {
  platform: string;
  recommendedFormats: string[];
  aspectRatio: string;
  qaAgent: string;
}

export const PLATFORM_PROFILES: Record<string, PlatformProfile> = {
  youtube: {
    platform: "youtube",
    recommendedFormats: ["longform_16_9", "shorts_9_16"],
    aspectRatio: "16:9",
    qaAgent: "YouTubeQAAgent"
  },
  tiktok: {
    platform: "tiktok",
    recommendedFormats: ["vertical_9_16"],
    aspectRatio: "9:16",
    qaAgent: "TikTokQAAgent"
  },
  facebook: {
    platform: "facebook",
    recommendedFormats: ["feed_video_1_1", "reels_9_16"],
    aspectRatio: "1:1",
    qaAgent: "FacebookQAAgent"
  },
  instagram: {
    platform: "instagram",
    recommendedFormats: ["reels_9_16", "feed_4_5"],
    aspectRatio: "9:16",
    qaAgent: "InstagramQAAgent"
  },
  x: {
    platform: "x",
    recommendedFormats: ["clip_short"],
    aspectRatio: "16:9",
    qaAgent: "XQAAgent"
  }
};
