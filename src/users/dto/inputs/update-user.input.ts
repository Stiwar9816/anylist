import { IsArray, IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @IsInt()
  @IsPositive()
  @Field(() => Int)
  id: number

  @IsArray()
  @IsOptional()
  @Field(() => [ValidRoles], { nullable: true })
  roles?: ValidRoles[]

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean
}
