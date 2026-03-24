import { VerticalPackManifest } from "../services/pack-registry-service";

export const ResearchPack: VerticalPackManifest = {
  packId: "pack-research-1",
  name: "AutoBots Deep Research Pack",
  description: "Web retrieval, document ingestion, source comparison, and synthesis.",
  category: "research",
  requiredCapabilities: ["web-search", "doc-parser", "llm-compare", "report-generator"],
  configurationSchema: {
    searchApiKey: "string"
  },
  pricing: {
    monthlySubscriptionUsd: 299.00,
    costPerRunUsd: 1.00
  },
  workflows: [
    {
      workflowId: "wf-deep-research",
      description: "Multi-document synthesis and contradiction detection.",
      definition: {
         nodes: [
             { id: "search", capability_key: "web-search" },
             { id: "parse", capability_key: "doc-parser" },
             { id: "compare", capability_key: "llm-compare" },
             { id: "report", capability_key: "report-generator" }
         ],
         edges: [
             { source: "search", target: "parse" },
             { source: "parse", target: "compare" },
             { source: "compare", target: "report" }
         ]
      }
    }
  ]
};
