import { Injectable } from '@nestjs/common';
import { User } from '@pawspot/db';
import Logger from '@pawspot/logger';
import { PrismaService } from 'src/prisma/services/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async getUser(): Promise<User[]> {
        return this.prisma.user.findMany();
    }
}
