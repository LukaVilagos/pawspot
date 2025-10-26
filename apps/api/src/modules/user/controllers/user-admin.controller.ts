import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { USER_ROUTES, UserResponseDto, UsersListResponseDto } from '@pawspot/api-contracts';
import { UserService } from '../services/user.service';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';

@Controller(`/admin${USER_ROUTES.ROOT}`)
@UseGuards(AuthGuard, AdminGuard)
export class UserAdminController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getAll(): Promise<UsersListResponseDto> {
        return this.userService.getUser();
    }

    @Get(USER_ROUTES.BY_ID)
    async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
        return this.userService.getUserById(id);
    }

    @Delete(USER_ROUTES.DELETE)
    async deleteUser(@Param('id') id: string) {
        await this.userService.deleteUser(id);
        return { message: 'User deleted successfully' };
    }
}
