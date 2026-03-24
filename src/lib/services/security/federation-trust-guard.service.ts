export interface OrgTrustProfile {
  orgId: string
  trustLevel: number
  revoked: boolean
}

export class FederationTrustGuard {
  private trustMap = new Map<string, OrgTrustProfile>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
  async canAccess(orgId: string, resource: string): Promise<boolean> {
    const profile = this.trustMap.get(orgId)
    if (!profile || profile.revoked) return false
    return profile.trustLevel > 5
  }
}