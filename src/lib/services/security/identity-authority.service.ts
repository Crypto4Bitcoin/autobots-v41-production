export interface IdentityProfile {
  id: string
  type: "human" | "agent" | "runtime" | "system"
  authorityScope: string[]
  status: "active" | "revoked" | "suspended"
}

export class IdentityAuthorityService {
  private registry = new Map<string, IdentityProfile>()

  async verify(id: string): Promise<boolean> {
    const profile = this.registry.get(id)
    return profile?.status === "active"
  }

  async register(profile: IdentityProfile): Promise<void> {
    this.registry.set(profile.id, profile)
  }

  async revoke(id: string): Promise<void> {
    const profile = this.registry.get(id)
    if (profile) profile.status = "revoked"
  }
}