export class APIAbuseDetector {
  private window = new Map<string, number[]>()

  async isAbusive(clientId: string): Promise<boolean> {
    const now = Date.now()
    const hits = this.window.get(clientId) || []
    const recent = hits.filter(h => now - h < 1000)
    
    if (recent.length > 100) return true // Threshold for abuse
    
    recent.push(now)
    this.window.set(clientId, recent)
    return false
  }
}