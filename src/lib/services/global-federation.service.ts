export interface FederationTrust {
  source_org: string;
  target_org: string;
  trust_level: 'limited' | 'trusted' | 'strategic';
  status: 'active' | 'revoked';
}

export class GlobalFederationService {
  private static trustStore: FederationTrust[] = [
    { source_org: "autobots-main", target_org: "partner-alpha", trust_level: "trusted", status: "active" }
  ];

  static checkTrust(source: string, target: string): FederationTrust | undefined {
    return this.trustStore.find(t => t.source_org === source && t.target_org === target && t.status === 'active');
  }

  static listTrusts(): FederationTrust[] {
    return this.trustStore;
  }
}
