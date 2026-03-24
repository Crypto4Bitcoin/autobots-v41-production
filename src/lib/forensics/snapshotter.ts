export interface SystemSnapshot { timestamp: number; stability: number; districts: any[]; agents: any[] }
export class Snapshotter {
  private static backups: SystemSnapshot[] = [];
  static takeSnapshot(state: any): void {
    // Phase 221/223: Automated snapshotting
    this.backups.push({ timestamp: Date.now(), ...state });
    if (this.backups.length > 10) this.backups.shift();
  }
  static getLatestSnapshot(): SystemSnapshot | null { return this.backups[this.backups.length - 1] || null; }
  static getRPO(): number {
    if (this.backups.length === 0) return 0;
    return (Date.now() - this.backups[this.backups.length - 1].timestamp) / 1000;
  }
}
