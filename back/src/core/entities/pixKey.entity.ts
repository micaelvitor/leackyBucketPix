import { ObjectType, Field } from 'type-graphql';
import { prop } from '@typegoose/typegoose';
import { Document } from 'mongoose';
import { Entity } from './entity';

export enum PixKeyType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  CPF = 'CPF',
  RANDOM = 'RANDOM'
}

@ObjectType()
export class PixKey extends Entity {
  @Field(() => String)
  @prop({ required: true, enum: PixKeyType })
  type!: PixKeyType;

  @Field()
  @prop({ required: true, unique: true })
  value!: string;

  @Field()
  @prop({ required: true })
  ownerId!: string;

  constructor(data: Partial<PixKey> & { id?: string }) {
    super(data.id);
    Object.assign(this, data);
  }

  static validateValue(type: PixKeyType, value: string): boolean {
    switch (type) {
      case PixKeyType.EMAIL:
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      
      case PixKeyType.PHONE:
        return /^\+?[1-9]\d{10,14}$/.test(value);
      
      case PixKeyType.CPF:
        return /^\d{11}$/.test(value);
      
      case PixKeyType.RANDOM:
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
      
      default:
        return false;
    }
  }
}

export type PixKeyDocument = PixKey & Document;