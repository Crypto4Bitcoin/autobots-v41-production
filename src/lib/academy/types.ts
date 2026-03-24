export type AgentStatus =
  | "idle"
  | "researching"
  | "rotating"
  | "training"
  | "creating"
  | "editing"
  | "queued"
  | "posting"
  | "governing"
  | "paused"
  | "error"

export type AgentRole =
  | "teacher"
  | "principal"
  | "verify"
  | "chancellor"
  | "dean_ops"
  | "schedule_marshal"
  | "curriculum_balancer"
  | "school_audit"
  | "training_video"
  | "training_image"
  | "title"
  | "description"
  | "hashtag"
  | "social_assembler"
  | "social_editor"
  | "compliance_editor"
  | "format_editor"
  | "production_packager"
  | "youtube_autoposter"
  | "reels_autoposter"
  | "tiktok_autoposter"
  | "scheduler"
  | "analytics_feedback"
  | "monitor"
  | "metrics"
  | "time_audit"
  | "performance_review"
  | "role_control"

export interface AgentRecord {
  id: string
  name: string
  role: AgentRole
  category: string
  status: AgentStatus
  startedAt: string
  lastActionAt: string
  totalActions: number
  avgTaskMs: number
  learningScore: number
  performanceScore: number
  skillLevel: number
}

export interface PredictionScores {
  categoryScore: number
  topicScore: number
  contentScore: number
  platformFit: {
    youtube: number
    instagram: number
    tiktok: number
  }
  recommendedWindow: {
    iso: string
    score: number
    label: string
  }
  productionPriority: number
}

export interface MemoryRecord {
  id: string
  category: string
  title: string
  summary: string
  sourceUrl?: string
  sources?: { title: string; url: string; content: string; score?: number }[]
  storedAt: string
  confidence: number
  prediction?: Partial<PredictionScores>
}

export interface SocialMemoryRecord {
  id: string
  category: string
  title: string
  description: string
  hashtags: string[]
  imagePrompt?: string
  imageUrl?: string
  videoScript?: string
  videoUrl?: string
  status: "draft" | "edited" | "production_ready"
  createdAt: string
  prediction?: Partial<PredictionScores>
}

export interface ProductionRecord {
  id: string
  socialMemoryId: string
  platform: "youtube" | "instagram" | "tiktok"
  title: string
  description: string
  hashtags: string[]
  imageUrl?: string
  videoUrl?: string
  status: "queued" | "scheduled" | "posted" | "failed"
  externalId?: string
  scheduledAt?: string
  createdAt: string
  priorityScore?: number
  prediction?: Partial<PredictionScores>
}


export interface SchoolRecord {
  id: string
  name: string
  niche: string
  principalId: string
  registryId: string
  status: "active" | "hibernating" | "emerging"
  foundedAt: string
  performanceMetrics: {
    totalROI: number
    avgAccuracy: number
    contentOutput: number
  }
  creditBalance: number
}

export interface CreditRecord {
  id: string
  entityId: string
  amount: number
  type: "earn" | "spend" | "allocate"
  purpose: string
  timestamp: string
}

export interface SovereigntyPolicy {
  nicheId: string
  redLines: string[]
  authorityScope: string[]
  brandDNA: string
}

export interface SchoolState {
  id: string
  name: string
  parentSchoolId?: string
  live: boolean
  mode: "running" | "paused" | "stopped"
  startedAt?: string
  stoppedAt?: string
  pauseReason?: string
  lastGovernorActionAt?: string
  overseenBy: string[]
  subSchools: string[] // List of SchoolRecord IDs
}

export const AgentRecord = {} as any;

export const SovereigntyPolicy = {} as any;

export const MemoryRecord = {} as any;

export const SchoolRecord = {} as any;

export const CreditRecord = {} as any;

export const ProductionRecord = {} as any;

export const SchoolState = {} as any;

export const SocialMemoryRecord = {} as any;

export const AnalyticsData = {} as any;

export const CalibrationData = {} as any;

const type_stub = (props: any) => null;
export default type_stub;
