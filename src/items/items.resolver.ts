import { ParseIntPipe } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreateItemInput, UpdateItemInput } from './dto';
import { Item } from './entities/item.entity';
@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) { }

  @Mutation(() => Item, { name: 'createItem' })
  createItem(@Args('createItemInput') createItemInput: CreateItemInput): Promise<Item> {
    return this.itemsService.create(createItemInput);
  }

  @Query(() => [Item], { name: 'items' })
  findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Query(() => Item, { name: 'item' })
  findOne(@Args('id', { type: () => Int }, ParseIntPipe) id: number): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @Mutation(() => Item, { name: 'updateItem' })
  updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput): Promise<Item> {
    return this.itemsService.update(updateItemInput.id, updateItemInput);
  }

  @Mutation(() => Item, { name: 'deleteItem' })
  removeItem(@Args('id', { type: () => Int }, ParseIntPipe) id: number): Promise<Item> {
    return this.itemsService.remove(id);
  }
}
