import { Injectable } from '@nestjs/common';
import { CreateUserRequestDto } from '@pawspot/api-contracts';
import { User } from '@pawspot/db';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async getUser(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        return user;
    }

    async createUser(user: CreateUserRequestDto): Promise<User> {
        return this.prisma.user.create({
            data: user,
        });
    }
}
