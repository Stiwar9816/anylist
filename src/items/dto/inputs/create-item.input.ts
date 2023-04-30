import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Min } from 'class-validator';
@InputType()
export class CreateItemInput {

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string

  @IsInt()
  @IsPositive()
  @Min(1)
  @Field(() => Int)
  quantity: number

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  quantityUnits?: string
}
