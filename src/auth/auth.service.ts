import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { SigninInput, SignupInput } from './dto';
import { AuthResponde } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    private getjwtToken(id: number) {
        return this.jwtService.sign({ id })
    }

    async signup(signupInput: SignupInput): Promise<AuthResponde> {
        const user = await this.usersService.create(signupInput)
        const token = this.getjwtToken(user.id)
        return { token, user }
    }

    async signin(signinInput: SigninInput): Promise<AuthResponde> {
        const { email, password } = signinInput
        const user = await this.usersService.findOneByEmail(email)
        // Compare password
        if (!bcrypt.compareSync(password, user.password)) {
            throw new BadRequestException('Email Or Password do not match')
        }
        const token = this.getjwtToken(user.id)
        return { token, user }
    }

    async validateUser(id: number): Promise<User> {
        const user = await this.usersService.findOneById(id)
        if (!user.isActive)
            throw new UnauthorizedException(`User is inactive, talk with an admin`)
        delete user.password
        return user
    }

    revalidateToken(user: User): AuthResponde {
        const token = this.getjwtToken(user.id)
        return { token, user }
    }
}
