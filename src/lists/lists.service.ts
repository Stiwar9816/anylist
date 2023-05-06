import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateListInput, UpdateListInput } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto';

@Injectable()
export class ListsService {

  private readonly logger = new Logger('ListsService')

  constructor(
    @InjectRepository(List)
    private readonly listsRepository: Repository<List>
  ) { }

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    try {
      const newList = await this.listsRepository.create({ ...createListInput, user })
      return await this.listsRepository.save(newList)
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<List[]> {
    const { limit, offset } = paginationArgs
    const { search } = searchArgs

    const queryBuilder = await this.listsRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id })

    if (search)
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${search.toLocaleLowerCase()}%` })

    return queryBuilder.getMany()
  }

  async findOne(id: number, user: User): Promise<List> {
    const list = await this.listsRepository.findOneBy({
      id,
      user: {
        id: user.id
      }
    })
    this.handleDBNotFound(list, id)
    return list
  }

  async update(id: number, updateListInput: UpdateListInput, user: User): Promise<List> {
    await this.findOne(id, user)
    const list = await this.listsRepository.preload(updateListInput)
    this.handleDBNotFound(list, id)
    try {
      return await this.listsRepository.save(list)
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async remove(id: number, user: User): Promise<List> {
    const list = await this.findOne(id, user)
    return await this.listsRepository.remove(list)
  }

  async listCountByUser(user: User): Promise<number> {
    return this.listsRepository.count({
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

  private handleDBNotFound(lists: List, id: number) {
    if (!lists) throw new NotFoundException(`List with id ${id} not found`)
  }
}
