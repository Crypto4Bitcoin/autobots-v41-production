export class RollbackService {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static stateBackup: Map<string, any> = new Map();

  static backup(key: string, data: unknown) {
    if (data === undefined) {
      console.warn(`[Rollback] Attempted to backup undefined data for key: ${key}. Using empty object.`);
      data = {};
    }
    console.log(`[Rollback] Backing up state for: ${key}`);
    this.stateBackup.set(key, JSON.parse(JSON.stringify(data)));
  }

  static async restore(key: string): Promise<boolean> {
    console.log(`[Rollback] Triggering RESTORE for: ${key}`);
    const data = this.stateBackup.get(key);
    if (!data) return false;

    // Simulate restoration logic
    console.log(`[Rollback] Restoring ${key} to last known good state.`);
    return true;
  }
}