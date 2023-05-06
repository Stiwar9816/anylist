import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CreateListInput, UpdateListInput } from './dto';
import { UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { ListItemService } from 'src/list-item/list-item.service';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemService
  ) { }

  @Mutation(() => List, { name: 'createList' })
  createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<List[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => List, { name: 'list' })
  findOne(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List, { name: 'updateList' })
  updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listsService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List, { name: 'removeLists' })
  removeList(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listsService.remove(id, user);
  }

  @ResolveField(() => [ListItem], { name: 'items' })
  async getListItems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs

  ): Promise<ListItem[]> {
    return await this.listItemsService.findAll(list, paginationArgs, searchArgs)
  }

  @ResolveField(() => Number, { name: 'totalItems' })
  async countListItemByList(@Parent() list: List): Promise<number> {
    return await this.listItemsService.countListItemByList(list)
  }
}
