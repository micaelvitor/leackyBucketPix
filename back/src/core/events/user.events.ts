import { Event } from './event';
import { User } from '../entities/user.entity';

export class UserCreatedEvent extends Event {
  constructor(public readonly user: User) {
    super();
  }
}

export class UserUpdatedEvent extends Event {
  constructor(public readonly user: User) {
    super();
  }
}

export class UserDeletedEvent extends Event {
  constructor(public readonly userId: string) {
    super();
  }
}

export class PixKeyAddedEvent extends Event {
  constructor(
    public readonly userId: string,
    public readonly pixKey: any
  ) {
    super();
  }
} 