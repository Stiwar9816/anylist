import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ListItemService } from './list-item.service';
import { ListItem } from './entities/list-item.entity';
import { CreateListItemInput, UpdateListItemInput } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParseIntPipe, UseGuards } from '@nestjs/common';

@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) { }

  @Mutation(() => ListItem)
  createListItem(@Args('createListItemInput') createListItemInput: CreateListItemInput): Promise<ListItem> {
    return this.listItemService.create(createListItemInput);
  }


  @Query(() => ListItem, { name: 'listItem' })
  findOne(@Args('id', { type: () => Int }, ParseIntPipe) id: number): Promise<ListItem> {
    return this.listItemService.findOne(id);
  }

  @Mutation(() => ListItem, { name: 'updateListItem' })
  updateListItem(@Args('updateListItemInput') updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    return this.listItemService.update(updateListItemInput.id, updateListItemInput);
  }

  @Mutation(() => ListItem, { name: 'removeListItem' })
  removeListItem(@Args('id', { type: () => Int }, ParseIntPipe) id: number): Promise<ListItem> {
    return this.listItemService.remove(id);
  }
}
