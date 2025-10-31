import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthUserDto, CreateUserRequestDto, LoginResponseDto, RegisterRequestDto, RegisterResponseDto, UserResponseDto, UserSummaryDto } from '@pawspot/api-contracts';
import { User } from '@pawspot/db';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) { }

    private async serializeUser(user: User): Promise<AuthUserDto> {
        const { password, updatedAt, deletedAt, ...serializedUser } = user;
        return serializedUser;
    }

    async validateUser(email: string, password: string): Promise<AuthUserDto> {
        const user: User | null = await this.usersService.findByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const isMatch: boolean = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            throw new BadRequestException('Password does not match');
        }
        return this.serializeUser(user);
    }

    async login(user: User): Promise<LoginResponseDto> {
        const payload = { email: user.email, id: user.id, type: user.type };
        const safeUser = await this.serializeUser(user);
        return { access_token: this.jwtService.sign(payload), user: safeUser };
    }

    async register(user: RegisterRequestDto): Promise<RegisterResponseDto> {
        const existingUser = await this.usersService.findByEmail(user.email);

        if (existingUser) {
            throw new BadRequestException('email already exists');
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser: CreateUserRequestDto = {
            ...user, password: hashedPassword
        };
        const createdUser = await this.usersService.register(newUser);
        return this.login(createdUser);
    }
}
