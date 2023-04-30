import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {

  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number

  @Column('text', { unique: true })
  @Field(() => String)
  fullName: string

  @Column('text', { unique: true })
  @Field(() => String)
  email: string

  @Column('text')
  password: string

  @Column('text', {
    array: true,
    default: ['user']
  })
  @Field(() => [String])
  roles: string[]

  @Column('boolean', {
    default: true
  })
  @Field(() => Boolean)
  isActive: boolean

  // Relaciones
  @ManyToOne(() => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User
}
