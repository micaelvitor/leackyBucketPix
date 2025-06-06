import { ObjectType, Field, ID } from 'type-graphql';
import { prop, getModelForClass } from '@typegoose/typegoose';
import { PixKey } from './pixKey';

@ObjectType()
export class User {
  @Field(() => ID)
  readonly id!: string;

  @Field()
  @prop({ required: true, unique: true })
  email!: string;

  @prop({ required: true })
  password!: string;

  @Field()
  @prop({ default: 10 })
  tokens!: number;

  @Field(() => [PixKey], { nullable: true })
  @prop({ type: () => [PixKey], default: [] })
  pixKeys!: PixKey[];
}

export const UserModel = getModelForClass(User);
