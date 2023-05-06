import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput, ValidRolesArgs } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { ItemsService } from 'src/items/items.service';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { Item } from 'src/items/entities/item.entity';
import { ListsService } from 'src/lists/lists.service';
import { List } from 'src/lists/entities/list.entity';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService
  ) { }

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User
  ): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user)
  }


  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField(() => Int, { name: 'itemCount' })
  async itemCount(
    @Parent() user: User,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) adminUser: User
  ): Promise<number> {
    return this.itemsService.itemCountByUser(user)
  }

  @ResolveField(() => [String], { name: 'items' })
  async getItemsByUser(
    @Parent() user: User,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) adminUser: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, paginationArgs, searchArgs)
  }

  @ResolveField(() => [String], { name: 'lists' })
  async getListsByUser(
    @Parent() user: User,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) adminUser: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<List[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs)
  }
}
