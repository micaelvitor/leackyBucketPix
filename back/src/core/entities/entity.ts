import { ObjectType, Field, ID } from 'type-graphql';
import { prop } from '@typegoose/typegoose';

@ObjectType()
export class Entity {
  @Field(() => ID)
  @prop({ required: true })
  id!: string;

  constructor(id?: string) {
    if (id) {
      this.id = id;
    }
  }
} 