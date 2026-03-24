export class ScopedAutonomyThrottle {
  private static throttleLevels = new Map<string, number>();

  static setAutonomy(subsystem: string, level: number) {
    console.log(`[Throttle] Setting autonomy for ${subsystem} to ${level * 100}%`);
    this.throttleLevels.set(subsystem, level);
  }

  static getLevel(subsystem: string) { return this.throttleLevels.get(subsystem) || 1.0; }
}