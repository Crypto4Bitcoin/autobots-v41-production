export class EventDeduplicationService {
  private static recentSignals: Map<string, number> = new Map();
  private static WINDOW_MS = 60000; // 1 minute deduplication window

  /**
   * Detects repeated signals within a window to prevent event storms.
   */
  static isDuplicate(signalId: string): boolean {
    const now = Date.now();
    const lastSeen = this.recentSignals.get(signalId);
    
    if (lastSeen && (now - lastSeen) < this.WINDOW_MS) {
      return true;
    }
    
    this.recentSignals.set(signalId, now);
    return false;
  }
}
