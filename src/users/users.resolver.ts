import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ParseIntPipe } from '@nestjs/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Query(() => [User], { name: 'users' })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('email', { type: () => String }) email: string): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }

  @Mutation(() => User)
  blockUser(@Args('id', { type: () => Int }, ParseIntPipe) id: number): Promise<User> {
    return this.usersService.block(id);
  }
}
