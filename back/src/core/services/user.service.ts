import { User, UserDocument } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserCreatedEvent } from '../events/user.events';
import { queues } from '@/infrastructure/queue/queue.config';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async createUser(name: string, email: string, password: string): Promise<UserDocument> {
    const existingUser = await this.repository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword
    });

    await queues.userCreated.add('user:created', new UserCreatedEvent(user));
    return this.repository.create(user);
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return this.repository.findById(id);
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    return this.repository.findByEmail(email);
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return this.repository.findAll();
  }

  async updateUser(id: string, data: Partial<User>): Promise<UserDocument | null> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.repository.update(id, data);
  }

  async deleteUser(id: string): Promise<UserDocument | null> {
    return this.repository.delete(id);
  }

  async validatePassword(user: UserDocument, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
} 