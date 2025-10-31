import { Injectable } from '@nestjs/common';
import { CreateUserRequestDto, PaginatedResponse, QueryOptionsDto, UserResponseDto, UsersListResponseDto } from '@pawspot/api-contracts';
import { User } from '@pawspot/db';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { SearchService } from 'src/modules/prisma/services/search.service';
import * as bcrypt from 'bcrypt';
import { PawSpotLogger } from 'src/common/logger/logger';
import { AuditService } from 'src/modules/audit/services/audit.service';


@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private searchService: SearchService,
    private auditService: AuditService) { }

  private readonly logger = new PawSpotLogger(UserService.name);

  async getUser(): Promise<UsersListResponseDto> {
    this.logger.log('Getting all users');
    return this.prisma.client.user.findMany();
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    this.logger.log(`Getting user by id: ${id}`);
    const user = await this.prisma.client.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.client.user.findUnique({
      where: { email },
    });

    return user;
  }

  async registerUser(user: CreateUserRequestDto): Promise<User> {
    return this.prisma.client.user.create({
      data: user,
    });
  }

  async createUser(user: CreateUserRequestDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    const createdUser = await this.prisma.client.user.create({
      data: user,
      omit: { password: true },
    });

    this.auditService.logAction(createdUser.id, 'Created user');
    return createdUser;
  }

  async updateUser(id: string, user: Partial<CreateUserRequestDto>): Promise<UserResponseDto> {
    return this.prisma.client.user.update({
      where: { id },
      data: user,
      omit: { password: true },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.client.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async searchUsers(query: QueryOptionsDto<UserResponseDto>): Promise<PaginatedResponse<UserResponseDto>> {
    return this.searchService.search<UserResponseDto>('user', query);
  }
}
