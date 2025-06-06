import { ObjectType, Field, ID } from 'type-graphql';
import { prop } from '@typegoose/typegoose';
import { Document } from 'mongoose';
import { Entity } from './entity';
import { PixKey } from './pixKey.entity';

@ObjectType()
export class User extends Entity {
  @Field()
  @prop({ required: true })
  name!: string;

  @Field()
  @prop({ required: true, unique: true })
  email!: string;

  @Field()
  @prop({ required: true })
  password!: string;

  @Field(() => [PixKey])
  @prop({ type: () => [PixKey], default: [] })
  pixKeys!: PixKey[];

  constructor(data: Partial<User> & { id?: string }) {
    super(data.id);
    Object.assign(this, data);
  }
}

export type UserDocument = User & Document;