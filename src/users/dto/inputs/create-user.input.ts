import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsEmail()
  @Field(() => String)
  email: string

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  fullName: string

  @IsString()
  @MinLength(6)
  @Field(() => String)
  password: string
}
