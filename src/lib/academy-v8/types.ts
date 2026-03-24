export interface BotProductRecord {
  id: string
  prototypeId: string
  title: string
  category: string
  deploymentTemplate: string
  pricingTier: "free" | "starter" | "pro" | "enterprise"
  readinessScore: number
  supportState: "draft" | "ready" | "live" | "maintenance"
  createdAt: string
}

export const BotProductRecord = {} as any;
