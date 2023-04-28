import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SigninInput, SignupInput } from './dto';
import { AuthResponde } from './types/auth-response.type';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver(() => AuthResponde)
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => AuthResponde, { name: 'signup' })
  async signUp(@Args('signupInput') signupInput: SignupInput): Promise<AuthResponde> {
    return this.authService.signup(signupInput)
  }

  @Mutation(() => AuthResponde, { name: 'signin' })
  async signIn(@Args('signinInput') siginInput: SigninInput): Promise<AuthResponde> {
    return this.authService.signin(siginInput)
  }

  @Query(() => AuthResponde, { name: 'revalidate' })
  @UseGuards(JwtAuthGuard)
  revalidateToken(@CurrentUser(/**[ValidRoles.admin]*/) user: User): AuthResponde {
    return this.authService.revalidateToken(user)
  }
}
