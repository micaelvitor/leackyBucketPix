import { ObjectType, Field, ID } from 'type-graphql';
import { PixKey } from './pixKey';

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field(() => [PixKey])
  pixKeys!: PixKey[];
}