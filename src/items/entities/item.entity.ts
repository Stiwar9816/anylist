import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {

  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @Column('text')
  @Field(() => String)
  name: string

  @Column('int')
  @Field(() => Int)
  quantity: number

  @Column('text', {
    nullable: true
  })
  @Field(() => String, { nullable: true })
  quantityUnits?: string
}
