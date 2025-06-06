export abstract class Event {
  public readonly occurredAt: Date;

  constructor() {
    this.occurredAt = new Date();
  }
}

export interface EventHandler<T extends Event> {
  handle(event: T): Promise<void>;
} 