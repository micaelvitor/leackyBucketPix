import { PixKey, PixKeyType, PixKeyDocument } from '../entities/pixKey.entity';
import { PixKeyRepository } from '../repositories/pixKey.repository';
import { v4 as uuidv4 } from 'uuid';

export class PixKeyService {
  private repository: PixKeyRepository;

  constructor() {
    this.repository = new PixKeyRepository();
  }

  async createKey(type: PixKeyType, value: string, ownerId: string): Promise<PixKeyDocument> {
    if (!PixKey.validateValue(type, value)) {
      throw new Error(`Invalid value for type ${type}`);
    }

    const existingKey = await this.repository.findByValue(value);
    if (existingKey) {
      throw new Error('Key already exists');
    }

    const pixKey = new PixKey({
      id: uuidv4(),
      type,
      value,
      ownerId
    });

    return this.repository.create(pixKey);
  }

  async getKeyById(id: string): Promise<PixKeyDocument | null> {
    return this.repository.findById(id);
  }

  async getKeysByOwnerId(ownerId: string): Promise<PixKeyDocument[]> {
    return this.repository.findByOwnerId(ownerId);
  }

  async getKeysByType(type: PixKeyType): Promise<PixKeyDocument[]> {
    return this.repository.findByType(type);
  }

  async deleteKey(id: string): Promise<PixKeyDocument | null> {
    return this.repository.delete(id);
  }
} 