import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class ItemsService {

  private readonly logger = new Logger('ItemsService')

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>
  ) { }

  async create(createItemInput: CreateItemInput): Promise<Item> {
    try {
      const newItem = this.itemsRepository.create(createItemInput)
      return await this.itemsRepository.save(newItem)
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async findAll(): Promise<Item[]> {
    return await this.itemsRepository.find()
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ id })
    this.handleDBNotFound(item, id)
    return item
  }

  async update(id: number, updateItemInput: UpdateItemInput): Promise<Item> {
    const item = await this.itemsRepository.preload(updateItemInput)
    this.handleDBNotFound(item, id)
    try {
      return await this.itemsRepository.save(item)
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async remove(id: number): Promise<Item> {
    const item = await this.findOne(id)
    return await this.itemsRepository.remove(item)
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
