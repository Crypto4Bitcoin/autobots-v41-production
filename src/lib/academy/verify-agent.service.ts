import { MemoryStoreService } from "@/lib/academy/memory-store.service"
import { AcademyRegistryService } from "@/lib/academy/academy-registry.service"

export interface VerificationResult {
  ok: boolean
  stage: "memory" | "social_memory" | "production" | "autopost"
  targetId: string
  reason: string
  verifiedAt: string
}

export class VerifyAgentService {
  async verifyMemoryRecord(targetId: string): Promise<VerificationResult> {
    const found = MemoryStoreService.getMemory().find((x) => x.id === targetId)

    if (!found) {
      return {
        ok: false,
        stage: "memory",
        targetId,
        reason: "Memory record not found.",
        verifiedAt: new Date().toISOString(),
      }
    }

    const predictionOk = (found.prediction?.categoryScore ?? 0) >= 0.45 && (found.prediction?.topicScore ?? 0) >= 0.45
    const structuralOk = Boolean(found.title && found.summary && found.category)

    return {
      ok: structuralOk && predictionOk,
      stage: "memory",
      targetId,
      reason:
        structuralOk && predictionOk
          ? "Memory record is structurally valid and prediction threshold passed."
          : "Memory record failed structural or predictive quality threshold.",
      verifiedAt: new Date().toISOString(),
    }
  }

  async verifySocialMemory(targetId: string): Promise<VerificationResult> {
    const found = MemoryStoreService.getSocialMemory().find((x) => x.id === targetId)

    if (!found) {
      return {
        ok: false,
        stage: "social_memory",
        targetId,
        reason: "Social memory record not found.",
        verifiedAt: new Date().toISOString(),
      }
    }

    const structuralOk = Boolean(found.title && found.description && found.hashtags?.length)
    const predictionOk = (found.prediction?.contentScore ?? 0) >= 0.5
    const priorityOk = (found.prediction?.productionPriority ?? 0) >= 0.52

    return {
      ok: structuralOk && predictionOk && priorityOk,
      stage: "social_memory",
      targetId,
      reason:
        structuralOk && predictionOk && priorityOk
          ? "Social draft is valid and strong enough for editorial flow."
          : "Social draft failed structure, content, or production priority threshold.",
      verifiedAt: new Date().toISOString(),
    }
  }

  async verifyProductionRecord(targetId: string): Promise<VerificationResult> {
    const found = MemoryStoreService.getProduction().find((x) => x.id === targetId)

    if (!found) {
      return {
        ok: false,
        stage: "production",
        targetId,
        reason: "Production record not found.",
        verifiedAt: new Date().toISOString(),
      }
    }

    const ok = Boolean(
      found.title &&
      found.description &&
      found.platform &&
      found.priorityScore !== undefined &&
      found.priorityScore >= 0.52
    )

    return {
      ok,
      stage: "production",
      targetId,
      reason: ok
        ? "Production record is valid and prioritized."
        : "Production record is incomplete or priority is too low.",
      verifiedAt: new Date().toISOString(),
    }
  }

  async verifyAgentHealth(agentId: string): Promise<VerificationResult> {
    const agent = AcademyRegistryService.getAllAgents().find((a) => a.id === agentId)

    return {
      ok: Boolean(agent),
      stage: "autopost",
      targetId: agentId,
      reason: agent ? `Agent ${agent.name} is registered.` : "Agent missing from registry.",
      verifiedAt: new Date().toISOString(),
    }
  }
}
