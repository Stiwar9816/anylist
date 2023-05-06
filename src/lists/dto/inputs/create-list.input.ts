import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateListInput {
  @IsString()
  @Field(() => String)
  name: string
}