import { Injectable } from '@nestjs/common';
import { CreateUserRequestDto, PaginatedResponse, QueryOptionsDto, UserResponseDto, UsersListResponseDto } from '@pawspot/api-contracts';
import { User } from '@pawspot/db';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { SearchService } from 'src/modules/prisma/services/search.service';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private searchService: SearchService) { }

  async getUser(): Promise<UsersListResponseDto> {
    return this.prisma.client.user.findMany();
  }

  async getUserById(id: string): Promise<UserResponseDto> {
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
    return this.prisma.client.user.create({
      data: user,
      omit: { password: true },
    });
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
