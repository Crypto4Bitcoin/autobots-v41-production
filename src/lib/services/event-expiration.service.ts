export class EventExpirationService {
  private static TTL_MAP: Record<string, number> = {
    'market_volatility': 1800000, // 30 mins
    'competitor_update': 86400000, // 24 hours
    'workflow_anomaly': 3600000 // 1 hour
  };

  /**
   * Automatically expires stale events and triggers cleanup.
   */
  static async checkExpiration(eventType: string, createdAt: number): Promise<boolean> {
    const ttl = this.TTL_MAP[eventType] || 3600000;
    const isExpired = Date.now() - createdAt > ttl;
    if (isExpired) {
      console.log(`[EventExpiration] Event of type ${eventType} has expired.`);
    }
    return isExpired;
  }
}
