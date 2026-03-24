import { VerticalPackManifest } from "../services/pack-registry-service";

export const TradingPack: VerticalPackManifest = {
  packId: "pack-trading-1",
  name: "AutoBots Trading Pack",
  description: "Market signal ingestion, analysis, risk scoring, and governance checks.",
  category: "trading",
  requiredCapabilities: ["market-data", "risk-analyzer", "governance-check", "trade-executor"],
  configurationSchema: {
    brokerageApiKey: "string",
    maxRiskTolerance: "number"
  },
  pricing: {
    monthlySubscriptionUsd: 999.00,
    costPerRunUsd: 5.00
  },
  workflows: [
    {
      workflowId: "wf-trade-signal",
      description: "Signal to risk-filtered execution.",
      definition: {
         nodes: [
             { id: "data", capability_key: "market-data" },
             { id: "risk", capability_key: "risk-analyzer" },
             { id: "gov", capability_key: "governance-check" },
             { id: "exec", capability_key: "trade-executor" }
         ],
         edges: [
             { source: "data", target: "risk" },
             { source: "risk", target: "gov" },
             { source: "gov", target: "exec" }
         ]
      }
    }
  ]
};
