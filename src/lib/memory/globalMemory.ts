export interface MemoryEntry { id: string; timestamp: number; source: string; content: string; sentimentScore: number }
export class GlobalMemory {
  private static logs: MemoryEntry[] = [];
  static record(source: string, content: string, sentimentScore: number): void {
    // Phase 141: Shared memory architecture
    this.logs.push({ id: "mem-" + Date.now(), timestamp: Date.now(), source, content, sentimentScore });
    if (this.logs.length > 500) this.logs.shift(); // 148: Decay
  }
  static getHistory(): MemoryEntry[] { return this.logs; }
  static getGlobalSentiment(): number {
    if (this.logs.length === 0) return 50;
    return this.logs.reduce((acc, l) => acc + l.sentimentScore, 0) / this.logs.length;
  }
}
