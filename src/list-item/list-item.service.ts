import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateListItemInput, UpdateListItemInput } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { User } from 'src/users/entities/user.entity';
import { List } from 'src/lists/entities/list.entity';

@Injectable()
export class ListItemService {

  private readonly logger = new Logger('ListsItemsService')

  constructor(
    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>
  ) { }

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...listItem } = createListItemInput
    try {
      const newListItem = await this.listItemsRepository.create({
        ...listItem, item: { id: itemId }, list: { id: listId }
      })
      await this.listItemsRepository.save(newListItem)
      return this.findOne(newListItem.id)
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async findAll(list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs
    const { search } = searchArgs

    const queryBuilder = await this.listItemsRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, { listId: list.id })

    if (search)
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${search.toLocaleLowerCase()}%` })

    return queryBuilder.getMany()
  }

  async countListItemByList(list: List): Promise<number> {
    return await this.listItemsRepository.count({
      where: { list: { id: list.id } }
    })
  }

  async findOne(id: number): Promise<ListItem> {
    const listItem = await this.listItemsRepository.findOneBy({ id })
    this.handleDBNotFound(listItem, id)
    return listItem
  }

  async update(id: number, updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    const { listId, itemId, ...updateListItem } = updateListItemInput

    const queryBuilder = await this.listItemsRepository.createQueryBuilder()
      .update()
      .set(updateListItem)
      .where('id = :id', { id })

    if (listId) queryBuilder.set({ list: { id: listId } })
    if (itemId) queryBuilder.set({ item: { id: itemId } })
    queryBuilder.execute()

    return this.findOne(id)
  }

  async remove(id: number): Promise<ListItem> {
    const listItem = await this.findOne(id)
    return await this.listItemsRepository.remove(listItem)
  }

  // Manejo de excepciones
  private handleDBException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail)
    else {
      this.logger.error(error)
      throw new InternalServerErrorException('Unexpected error, check server logs')
    }
  }

  private handleDBNotFound(listItem: ListItem, id: number) {
    if (!listItem) throw new NotFoundException(`ListItem with id ${id} not found`)
  }
}
