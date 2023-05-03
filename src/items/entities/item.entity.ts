import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {

  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number

  @Column('text')
  @Field(() => String)
  name: string

  // @Column('int')
  // @Field(() => Int)
  // quantity: number

  @Column('text', {
    nullable: true
  })
  @Field(() => String, { nullable: true })
  quantityUnits?: string

  @ManyToOne(() => User, user => user.items, { nullable: false, lazy: true })
  @Index('userID-index')
  @Field(() => User)
  user: User
}
