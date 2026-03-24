export interface FederatedPassport {
  id: string
  issuerId: string
  subjectDid: string
  scopes: string[]
  issuedAt: string
  expiresAt: string
}

export class FederatedPassportService {
  async issue(issuerId: string, subjectDid: string, scopes: string[]): Promise<FederatedPassport> {
    return {
      id: `pass-${Math.random().toString(36).substring(7)}`,
      issuerId,
      subjectDid,
      scopes,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString() // 24h
    }
  }

  async validate(passport: FederatedPassport): Promise<boolean> {
    const now = new Date()
    return now >= new Date(passport.issuedAt) && now <= new Date(passport.expiresAt)
  }
}