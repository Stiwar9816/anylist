import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto';
import { Item } from './entities/item.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
@Injectable()
export class ItemsService {

  private readonly logger = new Logger('ItemsService')

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>
  ) { }

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    try {
      const newItem = this.itemsRepository.create({ ...createItemInput, user })
      return await this.itemsRepository.save(newItem)
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Item[]> {
    const { limit, offset } = paginationArgs
    const { search } = searchArgs
    // return await this.itemsRepository.find({
    //   take: limit,
    //   skip: offset,
    //   where: {
    //     user: {
    //       id: user.id
    //     },
    //     name: Like(`%${search}%`)
    //   }
    // })
    const queryBuilder = this.itemsRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id })

    if (search)
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${search.toLocaleLowerCase()}%` })

    return queryBuilder.getMany()
  }

  async findOne(id: number, user: User): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({
      id,
      user: {
        id: user.id
      }
    })
    this.handleDBNotFound(item, id)
    return item
  }

  async update(id: number, updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    await this.findOne(id, user)
    const item = await this.itemsRepository.preload(updateItemInput)
    this.handleDBNotFound(item, id)
    try {
      return await this.itemsRepository.save(item)
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async remove(id: number, user: User): Promise<Item> {
    const item = await this.findOne(id, user)
    return await this.itemsRepository.remove(item)
  }

  async itemCountByUser(user: User): Promise<number> {
    return this.itemsRepository.count({
      where: {
        user: {
          id: user.id
        }
      }
    })
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

  private handleDBNotFound(item: Item, id: number) {
    if (!item) throw new NotFoundException(`Item with id ${id} not found`)
  }
}
