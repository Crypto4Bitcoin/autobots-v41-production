import { SovereigntyPolicy } from './types';

export class BrandSyncService {
  private static globalBrandDNA = 'OMEGA_PRIME_INSTITUTIONAL';
  private static globalRedLines = [
    'No AI hallucination promotion',
    'No political bias',
    'Maintain high legibility'
  ];

  /**
   * Synchronizes a niche-specific policy with the global brand guardrails.
   */
  static async sync(policy: SovereigntyPolicy): Promise<SovereigntyPolicy> {
    // Intersect global red lines with niche red lines
    const unifiedRedLines = Array.from(new Set([...this.globalRedLines, ...policy.redLines]));
    
    console.log(`[BrandSync] Synchronized policy for niche: ${policy.nicheId}`);
    
    return {
      ...policy,
      redLines: unifiedRedLines,
      brandDNA: `${this.globalBrandDNA} // ${policy.brandDNA}`
    };
  }

  static async auditContent(content: string, nichePolicy: SovereigntyPolicy): Promise<{ safe: boolean; violations: string[] }> {
    const violations = nichePolicy.redLines.filter(line => content.includes(line));
    return {
      safe: violations.length === 0,
      violations
    };
  }
}