
export type SchoolTrustTier =
  | "isolated"
  | "limited"
  | "trusted"
  | "strategic"
  | "full_federated_partner"

export interface PartnerSchoolApplication {
  id: string
  name: string
  region: string
  niche: string
  operator: string
  requestedTier: SchoolTrustTier
  createdAt: string
}

export interface TrustLinkRecord {
  id: string
  sourceSchoolId: string
  targetSchoolId: string
  tier: SchoolTrustTier
  scopes: string[]
  status: "active" | "suspended" | "revoked"
  updatedAt: string
}

export interface MarketplacePacket {
  id: string
  schoolId: string
  category: string
  title: string
  summary: string
  type: "curriculum" | "creative" | "analytics" | "prompt_pack"
  priceWeight: number
  rating: number
  createdAt: string
}

export interface StandardizedMemoryPacket {
  id: string
  sourceSchoolId: string
  category: string
  schemaVersion: string
  packetType: "research" | "social" | "production" | "analytics"
  payload: Record<string, unknown>
  standardizedAt: string
}

export interface NetworkPostPlan {
  id: string
  schoolId: string
  platform: "youtube" | "instagram" | "tiktok" | "x"
  assetTitle: string
  scheduledAt: string
  priorityScore: number
  createdAt: string
}

export interface SchoolIdentityRecord {
  id: string
  schoolId: string
  did: string
  credentialStatus: "active" | "suspended" | "revoked" | "pending"
  publicKeyRef: string
  createdAt: string
}

export const NetworkPostPlan = {} as any;

export const MarketplacePacket = {} as any;

export const StandardizedMemoryPacket = {} as any;

export const PartnerSchoolApplication = {} as any;

export const SchoolIdentityRecord = {} as any;

export const TrustLinkRecord = {} as any;
