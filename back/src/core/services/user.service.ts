import { User, UserDocument } from '../entities/user.entity';
import { UserCreatedEvent } from '../events/user.events';
import { queues } from '@/infrastructure/queue/queue.config';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(private readonly repository: any) {}

  async createUser(name: string, email: string, password: string): Promise<UserDocument> {
    const existingUser = await this.repository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
    };
    const created = await this.repository.create(userData);
    created.password = undefined;
    await queues.userCreated.add('user:created', new UserCreatedEvent(created));
    return created;
  }

  async getUserById(id: string): Promise<User | null> {
    const userDoc = await this.repository.findById(id);
    return userDoc ? User.fromDocument(userDoc) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const userDoc = await this.repository.findByEmail(email);
    return userDoc ? User.fromDocument(userDoc) : null;
  }

  async getAllUsers(): Promise<User[]> {
    const userDocs = await this.repository.findAll();
    return userDocs.map(User.fromDocument);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedDoc = await this.repository.update(id, data);
    return updatedDoc ? User.fromDocument(updatedDoc) : null;
  }

  async deleteUser(id: string): Promise<User | null> {
    const deletedDoc = await this.repository.delete(id);
    return deletedDoc ? User.fromDocument(deletedDoc) : null;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}