import { VerticalPackManifest } from "../services/pack-registry-service";

export const MediaPack: VerticalPackManifest = {
  packId: "pack-media-1",
  name: "AutoBots Media Pack",
  description: "End-to-end media automation: ingestion, transcription, summarization, clips, and captions.",
  category: "media",
  requiredCapabilities: ["video-ingest", "speech-to-text", "llm-summarize", "video-clipper"],
  configurationSchema: {
    youtubeApiKey: "string",
    socialMediaHooks: "array"
  },
  pricing: {
    monthlySubscriptionUsd: 199.00,
    costPerRunUsd: 0.50
  },
  workflows: [
    {
      workflowId: "wf-media-ingest-to-publish",
      description: "Full YouTube video to social clips pipeline.",
      definition: {
         nodes: [
             { id: "ingest", capability_key: "video-ingest" },
             { id: "transcribe", capability_key: "speech-to-text" },
             { id: "summarize", capability_key: "llm-summarize" },
             { id: "clip", capability_key: "video-clipper" }
         ],
         edges: [
             { source: "ingest", target: "transcribe" },
             { source: "transcribe", target: "summarize" },
             { source: "summarize", target: "clip" }
         ]
      }
    }
  ]
};
