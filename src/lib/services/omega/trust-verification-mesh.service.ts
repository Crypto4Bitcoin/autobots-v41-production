export interface TrustLink {
  fromOrg: string
  toOrg: string
  trustScore: number
  lastVerified: string
}

export class TrustVerificationMesh {
  private links = new Map<string, TrustLink>()

  async establishTrust(from: string, to: string, score: number): Promise<void> {
    this.links.set(`${from}->${to}`, {
      fromOrg: from,
      toOrg: to,
      trustScore: score,
      lastVerified: new Date().toISOString()
    })
  }

  async getTrustScore(from: string, to: string): Promise<number> {
    const link = this.links.get(`${from}->${to}`)
    return link ? link.trustScore : 0
  }
}