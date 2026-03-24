import { AppEvent } from '../services/event-intelligence.service';

export class EventRegistry {
  private static events: Map<string, AppEvent> = new Map();

  /**
   * Persists a new event.
   */
  static async register(event: AppEvent) {
    this.events.set(event.id, event);
    console.log(`[EventRegistry] Registered event: ${event.id} [${event.type}]`);
    return event.id;
  }

  static getEvent(id: string): AppEvent | undefined {
    return this.events.get(id);
  }

  static getActiveEvents(workspaceId: string): AppEvent[] {
    return Array.from(this.events.values())
      .filter(e => e.workspaceId === workspaceId && e.status !== 'archived');
  }
}
