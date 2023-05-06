import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { List } from '../../lists/entities/list.entity';
import { Item } from 'src/items/entities/item.entity';

@Entity({ name: 'listItems' })
@Unique('listItem-item', ['list', 'item'])
@ObjectType()
export class ListItem {

  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number

  @Column('numeric')
  @Field(() => Number)
  quantity: number

  @Column('boolean')
  @Field(() => Boolean)
  completed: boolean

  @ManyToOne(() => List, list => list.listItem, { lazy: true })
  list: List

  @ManyToOne(() => Item, item => item.listItem, { lazy: true })
  @Field(() => Item)
  item: Item
}
