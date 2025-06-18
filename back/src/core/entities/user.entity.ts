import { ObjectType, Field, ID } from 'type-graphql';
import { prop } from '@typegoose/typegoose';
import { Document } from 'mongoose';
import { Entity } from './entity';
import { PixKey } from './pixKey.entity';

@ObjectType()
@ObjectType()
export class User extends Entity {
  @Field(() => ID)
  @prop({ required: true, unique: true })
  id!: string;

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

  static fromDocument(doc: UserDocument): User {
    const { id, name, email, password, pixKeys } = doc;
    return new User({ id, name, email, password, pixKeys });
  }
}


export type UserDocument = User & Document;