import { AgentRecord } from "./types"

const categories = [
  "ai",
  "crypto",
  "markets",
  "tech",
  "productivity",
  "automation",
  "business",
  "culture",
]

export class AcademyRegistryService {
  private static teacherAgents: AgentRecord[] = Array.from({ length: 100 }, (_, i) => ({
    id: `teacher-${String(i + 1).padStart(3, "0")}`,
    name: `TeacherAgent-${String(i + 1).padStart(3, "0")}`,
    role: "teacher",
    category: categories[i % categories.length],
    status: "idle",
    startedAt: new Date().toISOString(),
    lastActionAt: new Date().toISOString(),
    totalActions: 0,
    avgTaskMs: 0,
    learningScore: 0.55,
    performanceScore: 0.55,
    skillLevel: 1,
  }))

  private static governanceAgents: AgentRecord[] = [
    {
      id: "principal-001",
      name: "PrincipalAgent",
      role: "principal",
      category: "academy_control",
      status: "idle",
      startedAt: new Date().toISOString(),
      lastActionAt: new Date().toISOString(),
      totalActions: 0,
      avgTaskMs: 0,
      learningScore: 0.9,
      performanceScore: 0.9,
      skillLevel: 9,
    },
    {
      id: "verify-001",
      name: "VerifyAgent",
      role: "verify",
      category: "quality_control",
      status: "idle",
      startedAt: new Date().toISOString(),
      lastActionAt: new Date().toISOString(),
      totalActions: 0,
      avgTaskMs: 0,
      learningScore: 0.95,
      performanceScore: 0.95,
      skillLevel: 9,
    },
    {
      id: "chancellor-001",
      name: "ChancellorAgent",
      role: "chancellor",
      category: "school_governance",
      status: "idle",
      startedAt: new Date().toISOString(),
      lastActionAt: new Date().toISOString(),
      totalActions: 0,
      avgTaskMs: 0,
      learningScore: 0.98,
      performanceScore: 0.98,
      skillLevel: 10,
    },
    {
      id: "deanops-001",
      name: "DeanOpsAgent",
      role: "dean_ops",
      category: "school_operations",
      status: "idle",
      startedAt: new Date().toISOString(),
      lastActionAt: new Date().toISOString(),
      totalActions: 0,
      avgTaskMs: 0,
      learningScore: 0.92,
      performanceScore: 0.93,
      skillLevel: 9,
    },
    {
      id: "marshal-001",
      name: "ScheduleMarshalAgent",
      role: "schedule_marshal",
      category: "scheduler_control",
      status: "idle",
      startedAt: new Date().toISOString(),
      lastActionAt: new Date().toISOString(),
      totalActions: 0,
      avgTaskMs: 0,
      learningScore: 0.9,
      performanceScore: 0.9,
      skillLevel: 9,
    },
    {
      id: "balancer-001",
      name: "CurriculumBalancerAgent",
      role: "curriculum_balancer",
      category: "category_allocation",
      status: "idle",
      startedAt: new Date().toISOString(),
      lastActionAt: new Date().toISOString(),
      totalActions: 0,
      avgTaskMs: 0,
      learningScore: 0.9,
      performanceScore: 0.91,
      skillLevel: 9,
    },
    {
      id: "audit-001",
      name: "SchoolAuditAgent",
      role: "school_audit",
      category: "school_audit",
      status: "idle",
      startedAt: new Date().toISOString(),
      lastActionAt: new Date().toISOString(),
      totalActions: 0,
      avgTaskMs: 0,
      learningScore: 0.93,
      performanceScore: 0.94,
      skillLevel: 9,
    },
  ]

  static getAllAgents() {
    return [...this.teacherAgents, ...this.governanceAgents]
  }

  static getTeachers() {
    return [...this.teacherAgents]
  }

  static updateAgent(id: string, patch: Partial<AgentRecord>) {
    let updated: AgentRecord | undefined

    this.teacherAgents = this.teacherAgents.map((agent) => {
      if (agent.id === id) {
        updated = {
          ...agent,
          ...patch,
          lastActionAt: new Date().toISOString(),
        }
        return updated
      }
      return agent
    })

    this.governanceAgents = this.governanceAgents.map((agent) => {
      if (agent.id === id) {
        updated = {
          ...agent,
          ...patch,
          lastActionAt: new Date().toISOString(),
        }
        return updated
      }
      return agent
    })

    return updated
  }

  static rotateTeachersByCategoryOrder(selectedTeacherIds: string[], nextCategories: string[]) {
    const changed = []

    this.teacherAgents = this.teacherAgents.map((agent, idx) => {
      const foundIndex = selectedTeacherIds.indexOf(agent.id)

      if (foundIndex !== -1) {
        const updated = {
          ...agent,
          category: nextCategories[foundIndex] ?? nextCategories[idx % nextCategories.length] ?? agent.category,
          status: "rotating" as const,
          totalActions: agent.totalActions + 1,
          lastActionAt: new Date().toISOString(),
        }
        changed.push(updated)
        return updated
      }

      return agent
    })

    return changed
  }

  static bumpPerformance(id: string, elapsedMs: number, learningDelta = 0.01, performanceDelta = 0.01, skillDelta = 0.05) {
    const current = this.getAllAgents().find((a) => a.id === id)
    if (!current) return undefined

    const nextAvg =
      current.totalActions === 0
        ? elapsedMs
        : Math.round((current.avgTaskMs * current.totalActions + elapsedMs) / (current.totalActions + 1))

    return this.updateAgent(id, {
      totalActions: current.totalActions + 1,
      avgTaskMs: nextAvg,
      learningScore: Math.min(1, current.learningScore + learningDelta),
      performanceScore: Math.min(1, current.performanceScore + performanceDelta),
      skillLevel: Math.min(10, current.skillLevel + skillDelta),
      status: "idle",
    })
  }
}
