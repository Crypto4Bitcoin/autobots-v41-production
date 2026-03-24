export class AgentContextStore {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static context: Map<string, any> = new Map();

  /**
   * Maintains shared workspace-safe context for multi-agent collaboration.
   */
  static set(key: string, value: unknown) {
    this.context.set(key, value);
  }

  static get(key: string): unknown {
    return this.context.get(key);
  }

  static clear(key: string) {
    this.context.delete(key);
  }
}

