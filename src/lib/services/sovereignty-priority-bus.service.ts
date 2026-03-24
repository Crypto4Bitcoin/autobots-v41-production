export class SovereigntyPriorityBus {
  private static interrupts: string[] = [];

  static triggerInterrupt(commandId: string, level: "CRITICAL" | "EMERGENCY") {
    console.log(`[SovereigntyBus] High-priority interrupt triggered: ${commandId} (Level: ${level})`);
    this.interrupts.push(commandId);
    return { status: "INTERRUPTED", delay_ms: 2 };
  }

  static getActiveInterrupts() { return this.interrupts; }
}