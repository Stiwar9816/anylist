import { IsInt, IsPositive } from 'class-validator';
import { CreateItemInput } from './create-item.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @IsInt()
  @IsPositive()
  @Field(() => Int)
  id: number;
}
