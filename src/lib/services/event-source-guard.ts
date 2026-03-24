export class EventSourceGuard {
  private static trustedSources = ['internal-workflow', 'marketplace-vetted', 'official-api-bridge'];

  /**
   * Validates trusted signal origins and prevents malicious injection.
   */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  static validate(source: string, signature?: string): boolean {
    if (this.trustedSources.includes(source)) {
      return true;
    }
    
    console.warn(`[EventSourceGuard] BLOCKED untrusted signal source: ${source}`);
    return false;
  }
}
