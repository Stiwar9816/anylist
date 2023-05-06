import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Min(0)
  @Field(() => Number, { nullable: true })
  quantity: number = 0

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  completed: boolean = false

  @IsInt()
  @Field(() => Int)
  listId: number

  @IsInt()
  @Field(() => Int)
  itemId: number
}
