import { SchoolRecord, SovereigntyPolicy } from "./types"
import { randomUUID } from "crypto"

export class SubAcademyRegistryService {
  private static subSchools: SchoolRecord[] = []
  private static policies: SovereigntyPolicy[] = []

  /**
   * Spawns a new independent sub-academy for a specific niche.
   */
  static spawnSchool(name: string, niche: string, principalId: string): SchoolRecord {
    const school: SchoolRecord = {
      id: randomUUID(),
      name,
      niche,
      principalId,
      registryId: randomUUID(), // Link to a niche-specific agent registry
      status: "emerging",
      foundedAt: new Date().toISOString(),
      performanceMetrics: {
        totalROI: 0,
        avgAccuracy: 0.5,
        contentOutput: 0,
      },
      creditBalance: 1000, // Initial endowment
    }

    this.subSchools.push(school)
    
    // Create a default sovereignty policy for the niche
    this.policies.push({
      nicheId: school.id,
      redLines: ["No misinformation", "Maintain brand tone"],
      authorityScope: ["content_creation", "local_governance"],
      brandDNA: "Standard Institutional"
    })

    console.log(`[SubAcademy] Spawned ${name} Academy for ${niche}`)
    return school
  }

  static getSchool(id: string): SchoolRecord | undefined {
    return this.subSchools.find((s) => s.id === id)
  }

  static getAllSchools(): SchoolRecord[] {
    return [...this.subSchools]
  }

  static updateSchool(id: string, patch: Partial<SchoolRecord>): SchoolRecord | undefined {
    const idx = this.subSchools.findIndex((s) => s.id === id)
    if (idx === -1) return undefined
    this.subSchools[idx] = { ...this.subSchools[idx], ...patch }
    return this.subSchools[idx]
  }

  static getPolicy(nicheId: string): SovereigntyPolicy | undefined {
    return this.policies.find((p) => p.nicheId === nicheId)
  }
}
