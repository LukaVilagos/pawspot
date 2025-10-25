import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserRequestDto, LoginResponseDto, RegisterRequestDto, RegisterResponseDto, UserResponseDto } from '@pawspot/api-contracts';
import { User } from '@pawspot/db';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<UserResponseDto> {
        const user: User | null = await this.usersService.getUserByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const isMatch: boolean = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            throw new BadRequestException('Password does not match');
        }
        return user;
    }

    async login(user: User): Promise<LoginResponseDto> {
        const payload = { email: user.email, id: user.id };
        return { access_token: this.jwtService.sign(payload), user };
    }

    async register(user: RegisterRequestDto): Promise<RegisterResponseDto> {
        const existingUser = await this.usersService.getUserByEmail(user.email);

        if (existingUser) {
            throw new BadRequestException('email already exists');
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser: CreateUserRequestDto = {
            ...user, password: hashedPassword
        };
        const createdUser = await this.usersService.createUser(newUser);
        return this.login(createdUser);
    }
}
