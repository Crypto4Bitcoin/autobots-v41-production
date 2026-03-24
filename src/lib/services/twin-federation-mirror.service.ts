export class TwinFederationMirror {
  private static trustGraph: unknown = {};

  static async mirrorTrustLinks(links: unknown[]) {
    console.log("[TwinFederation] Mirroring cross-org trust relationships...");
    this.trustGraph = links.reduce((acc, l) => ({ ...acc, [l.org_id]: l.trust_score }), {});
    return this.trustGraph;
  }

  static getTrustScore(orgId: string) { return this.trustGraph[orgId] || 0; }
}