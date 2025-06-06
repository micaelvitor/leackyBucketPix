import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class PixKey {
  @Field(() => ID)
  id!: string;

  @Field()
  type!: string;

  @Field()
  value!: string;

  @Field()
  ownerId!: string;
}