type MetaEventHandler<T> = (payload: T) => Promise<void> | void;

export class MetaEventBus {
  private handlers = new Map<string, MetaEventHandler<unknown>[]>();

  on<T>(eventName: string, handler: MetaEvent$Handler<T>) {
    const existing = this.handlers.get(eventName) ?? [];
    existing.push(handler);
    this.handlers.set(eventName, existing);
  }

  async emit<T>(eventName: string, payload: T) {
    const handlers = this.handlers.get(eventName) ?? [];
    for (const handler of handlers) {
      await handler(payload);
    }
  }
}

export const metaEventBus = new MetaEventBus();
