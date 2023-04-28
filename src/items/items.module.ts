import { Module } from '@nestjs/common';
// Service
import { ItemsService } from './items.service';
// Resolver
import { ItemsResolver } from './items.resolver';
// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';
// Entity
import { Item } from './entities/item.entity';

@Module({
  providers: [ItemsResolver, ItemsService],
  imports: [TypeOrmModule.forFeature([Item])]
})
export class ItemsModule { }
