import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { CreateUserRequestDto, PaginatedUserResponseDto, QueryOptionsDto, UpdateUserRequestDto, USER_ROUTES, UserResponseDto } from '@pawspot/api-contracts';
import { UserService } from '../services/user.service';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { ZodSerializerDto } from 'nestjs-zod';

@Controller(`/admin${USER_ROUTES.ROOT}`)
@UseGuards(AuthGuard, AdminGuard)
export class UserAdminController {
    constructor(private readonly userService: UserService) { }

    @ZodSerializerDto(UserResponseDto)
    @Get(USER_ROUTES.BY_ID)
    async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
        return this.userService.getUserById(id);
    }

    @ZodSerializerDto(UserResponseDto)
    @Post(USER_ROUTES.CREATE)
    async createUser(@Body() user: CreateUserRequestDto): Promise<UserResponseDto> {
        return this.userService.createUser(user);
    }

    @ZodSerializerDto(UserResponseDto)
    @Put(USER_ROUTES.UPDATE)
    async updateUser(@Param('id') id: string, @Body() user: UpdateUserRequestDto): Promise<UserResponseDto> {
        return this.userService.updateUser(id, user);
    }

    @Delete(USER_ROUTES.DELETE)
    async deleteUser(@Param('id') id: string) {
        await this.userService.deleteUser(id);
        return { message: 'User deleted successfully' };
    }

    @ZodSerializerDto(PaginatedUserResponseDto)
    @Post(USER_ROUTES.SEARCH)
    async searchUsers(@Body() query: QueryOptionsDto<UserResponseDto>): Promise<PaginatedUserResponseDto> {
        return this.userService.searchUsers(query);
    }
}

