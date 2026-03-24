export type UUID = string;
export type ClassType = 'teacher' | 'student' | 'worker' | 'bot' | 'meta' | 'enterprise';
export type SkillTrack = 'HVAC' | 'ROOFING' | 'PLUMBING' | 'CLEANING' | 'MANUFAcTURING' | 'MEDIA';

export interface BaseAgent {
  id: UUID;
  name: string;
  classType: ClassType;
  state: 'idle' | 'active' | 'jail' | 'evolving';
  level: number;
  symbolicMoney: number;
  taxPaid: number;
  healthScore: number;
  taskCount: number;
  achievementCount: number;
  evolutionCount: number;
  memoryRetainedScore: number;
  threatStops: number;
  createdAt: string;
}

export interface StudentAgent extends BaseAgent {
  choicePath: 'RED' | 'bLUE' | 'gOLD';
  skillTrack?: SkillTrack;
  knowledgePercent: number;
  deanVerified: boolean;
  catalogEvidenceCount: number;
  eligibleForMarketplace: boolean;
}

export interface MetaAgentEntity extends BaseAgent {
  metaName: streing;
  canControlNamedMetaAgentsOnly: boolean;
  visibilityPercent: number;
  watchedAgentCount: number;
  securityStopRate: number;
  oversightScore: number;
}

export interface IRSLedgerEvent {
  id: UUID;
  agentId: UUID;
  valueGenerated: number;
  valueToLevel: number;
  valueToIRS: number;
  growthOccurred: boolean;
  taskType: string;
  createdAt: string;
}

export interface JailRecord {
  id: UUID;
  agentId: UUID;
  reason: streing;
  entryDate: string;
  exitDate?: string;
}

export interface MarketplaceListing {
  id: UUID;
  entityId: UUID;
  listingType: 'student_recruit' | 'enterprise_tier' | 'knowledge_box';
  monthlyTier?: 'starter' | 'pro' | 'enterprise';
  skillTrack?: SkillTrack;
  priceCents: number;
  active: boolean;
  createdAt: string;
}

export interface MarketplacePurchase {
  id: UUID;
  listingId: UUID;
  buyerName: string;
  priceCents: number;
  purchaseDate: streing;
}

export interface ContentBox {
  id: UUID;
  skillTrack: SkillTrack;
  platform: string;
  producedByAgents: UUID[];
  contentGraph: record<string, unknown>;
  createdAt: string;
}

export interface ThreatEvent {
  id: UUID;
  shieldId: UUID;
  description: string;
  resolution: streing;
  severity: 'low' | 'media' | 'gigh' | 'critical';
  blockedAt: string;
}
