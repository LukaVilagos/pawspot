import { Injectable } from '@nestjs/common';
import { AdminUpdateUserRequestDto, CreateUserRequestDto, PaginatedResponse, QueryOptionsDto, UserResponseDto, UsersListResponseDto } from '@pawspot/api-contracts';
import { User } from '@pawspot/db';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { PrismaQueryBuilderService } from 'src/modules/prisma/services/prisma-query-builder.service';
import * as bcrypt from 'bcrypt';
import { PawSpotLogger } from 'src/common/logger/logger';
import { AuditService } from 'src/modules/audit/services/audit.service';

const USER_OMIT_FIELDS = { password: true, updatedAt: true, deletedAt: true } as const;
const USER_INCLUDE_FIELDS = {
  sanctuaries: { select: { id: true, name: true, location: true } },
  followedSanctuaries: { select: { id: true, name: true, location: true } },
} as const;

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private prismaQueryBuilder: PrismaQueryBuilderService,
    private auditService: AuditService) { }

  private readonly logger = new PawSpotLogger(UserService.name);

  async findAll(): Promise<UsersListResponseDto> {
    this.logger.log('Getting all users');
    const users = await this.prisma.client.user.findMany({
      omit: USER_OMIT_FIELDS,
      include: USER_INCLUDE_FIELDS,
    });
    return users;
  }

  async findById(id: string): Promise<UserResponseDto> {
    this.logger.log(`Getting user by id: ${id}`);
    const user = await this.prisma.client.user.findUnique({
      where: { id },
      omit: USER_OMIT_FIELDS,
      include: USER_INCLUDE_FIELDS,
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.log(`Getting user by email: ${email}`);
    const user = await this.prisma.client.user.findUnique({
      where: { email },
    });

    return user;
  }

  async register(user: CreateUserRequestDto): Promise<User> {
    this.logger.log(`Registering user: ${user.email}`);
    return this.prisma.client.user.create({
      data: user,
    });
  }

  async create(user: CreateUserRequestDto): Promise<UserResponseDto> {
    this.logger.log(`Creating user: ${user.email}`);
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    const createdUser = await this.prisma.client.user.create({
      data: user,
      omit: USER_OMIT_FIELDS,
      include: USER_INCLUDE_FIELDS,
    });

    await this.auditService.logAction(createdUser.id, 'Created user');
    return createdUser;
  }

  async update(id: string, userData: AdminUpdateUserRequestDto): Promise<UserResponseDto> {
    this.logger.log(`Updating user: ${id}`);
    const updatedUser = await this.prisma.client.user.update({
      where: { id },
      data: userData,
      omit: USER_OMIT_FIELDS,
      include: USER_INCLUDE_FIELDS,
    });
    await this.auditService.logAction(id, 'Updated user');
    return updatedUser;
  }

  async delete(id: string) {
    this.logger.log(`Deleting user: ${id}`);
    await this.prisma.client.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.auditService.logAction(id, 'Deleted user');
  }

  async search(query: QueryOptionsDto<UserResponseDto>): Promise<PaginatedResponse<UserResponseDto>> {
    this.logger.log(`Searching users with query: ${JSON.stringify(query)}`);
    return this.prismaQueryBuilder.search<UserResponseDto>('user', query, {
      omit: USER_OMIT_FIELDS,
      include: USER_INCLUDE_FIELDS,
    });
  }
}
