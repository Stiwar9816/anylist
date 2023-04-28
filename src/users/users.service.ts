import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  private readonly logger = new Logger('UsersService')

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = await this.userRepository.create({
        ...signupInput,
        // Encrypt password
        password: bcrypt.hashSync(signupInput.password, 10)
      })

      return await this.userRepository.save(newUser)
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find()
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email })
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${email} not found`
      })
    }
  }

  async findOneById(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id })
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`
      })
    }
  }

  block(id: number): Promise<User> {
    throw new Error(`block not implemented`)
  }

  // Manejo de excepciones
  private handleDBException(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail.replace('Key ', ''))

    if (error.code === 'error-001')
      throw new BadRequestException(error.detail.replace('Key ', ''))

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }

  private handleDBNotFound(user: User, email: string) {
    if (!user) throw new NotFoundException(`User with email ${email} not found`)
  }
}
