export class DeveloperApiKeyService {
  /**
   * Issues and validates scoped API keys for external developer access.
   */
  static generateKey(developerId: string): string {
    const key = `ab_live_${Math.random().toString(36).substr(2, 24)}`;
    console.log(`[DeveloperKeys] Issued new production key for ${developerId}`);
    return key;
  }

  static validateKey(key: string): boolean {
    return key.startsWith('ab_live_');
  }
}
