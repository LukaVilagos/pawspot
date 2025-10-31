import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { ADMIN_USER_ROUTES, CreateUserRequestDto, PaginatedUserResponseDto, QueryOptionsDto, UpdateUserRequestDto, UserResponseDto } from '@pawspot/api-contracts';
import { UserService } from '../services/user.service';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { ZodSerializerDto } from 'nestjs-zod';

@Controller(ADMIN_USER_ROUTES.ROOT)
@UseGuards(AuthGuard, AdminGuard)
export class UserAdminController {
    constructor(private readonly userService: UserService) { }

    @ZodSerializerDto(UserResponseDto)
    @Get(ADMIN_USER_ROUTES.BY_ID)
    async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
        return this.userService.findById(id);
    }

    @ZodSerializerDto(UserResponseDto)
    @Post(ADMIN_USER_ROUTES.CREATE)
    async createUser(@Body() user: CreateUserRequestDto): Promise<UserResponseDto> {
        return this.userService.create(user);
    }

    @ZodSerializerDto(UserResponseDto)
    @Put(ADMIN_USER_ROUTES.UPDATE)
    async updateUser(@Param('id') id: string, @Body() user: UpdateUserRequestDto): Promise<UserResponseDto> {
        return this.userService.update(id, user);
    }

    @Delete(ADMIN_USER_ROUTES.DELETE)
    async deleteUser(@Param('id') id: string) {
        await this.userService.delete(id);
        return { message: 'User deleted successfully' };
    }

    @ZodSerializerDto(PaginatedUserResponseDto)
    @Post(ADMIN_USER_ROUTES.SEARCH)
    async searchUsers(@Body() query: QueryOptionsDto<UserResponseDto>): Promise<PaginatedUserResponseDto> {
        return this.userService.search(query);
    }
}

