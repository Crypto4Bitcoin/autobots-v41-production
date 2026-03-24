import { MemoryRecord, ProductionRecord, SchoolState, SocialMemoryRecord } from "./types"

export class MemoryStoreService {
  private static memory: MemoryRecord[] = []
  private static socialMemory: SocialMemoryRecord[] = []
  private static production: ProductionRecord[] = []

  private static schoolState: SchoolState = {
    live: false,
    mode: "stopped",
    overseenBy: [
      "ChancellorAgent",
      "DeanOpsAgent",
      "ScheduleMarshalAgent",
      "CurriculumBalancerAgent",
      "SchoolAuditAgent",
      "VerifyAgent",
    ],
  }

  static addMemory(record: MemoryRecord) {
    this.memory.unshift(record)
    return record
  }

  static getMemory(category?: string) {
    const items = category ? this.memory.filter((m) => m.category === category) : this.memory
    return [...items]
  }

  static addSocialMemory(record: SocialMemoryRecord) {
    this.socialMemory.unshift(record)
    return record
  }

  static getSocialMemory(status?: SocialMemoryRecord["status"]) {
    const items = status ? this.socialMemory.filter((r) => r.status === status) : this.socialMemory
    return [...items]
  }

  static updateSocialMemory(id: string, patch: Partial<SocialMemoryRecord>) {
    this.socialMemory = this.socialMemory.map((r) => (r.id === id ? { ...r, ...patch } : r))
    return this.socialMemory.find((r) => r.id === id)
  }

  static addProduction(record: ProductionRecord) {
    this.production.unshift(record)
    return record
  }

  static getProduction(status?: ProductionRecord["status"]) {
    const items = status ? this.production.filter((p) => p.status === status) : this.production
    return [...items]
  }

  static updateProduction(id: string, patch: Partial<ProductionRecord>) {
    this.production = this.production.map((p) => (p.id === id ? { ...p, ...patch } : p))
    return this.production.find((p) => p.id === id)
  }

  static getSchoolState() {
    return this.schoolState
  }

  static setSchoolState(patch: Partial<SchoolState>) {
    this.schoolState = {
      ...this.schoolState,
      ...patch,
      lastGovernorActionAt: new Date().toISOString(),
    }
    return this.schoolState
  }
}
